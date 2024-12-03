import axios from "axios";

const BASE_URL = "https://echo-serv.tbxnet.com/v1/secret";
const API_KEY = "Bearer aSuperSecretKey";

export const fetchFileList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: API_KEY },
    });
    return response.data.files || [];
  } catch (error) {
    console.error("Error fetching file list:", error.message);
    throw new Error("Failed to fetch file list");
  }
};

export const downloadFileData = async (fileName) => {
  try {
    const response = await axios.get(`${BASE_URL}/file/${fileName}`, {
      headers: { Authorization: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.warn(`Error fetching file: ${fileName}`);
    return null;
  }
};

export const processCSV = (csvContent, fileName) => {
  const lines = csvContent.split("\n");
  const result = [];

  lines.slice(1).forEach((line) => {
    const parts = line.trim().split(",");

    if (parts.length !== 4) {
      console.warn(`Malformed line in file ${fileName}: ${line}`);
      return;
    }

    const [file, text, number, hex] = parts;

    if (
      file !== fileName ||
      !text ||
      isNaN(Number(number)) ||
      !/^[a-fA-F0-9]{32}$/.test(hex)
    ) {
      console.warn(`Invalid data in file ${fileName}: ${line}`);
      return;
    }

    result.push({
      text,
      number: Number(number),
      hex,
    });
  });

  return result;
};
