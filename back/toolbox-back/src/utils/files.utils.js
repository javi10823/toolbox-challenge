import https from "https";

const BASE_URL = "echo-serv.tbxnet.com";
const API_KEY = "Bearer aSuperSecretKey";

const getOptions = (path) => ({
  hostname: BASE_URL,
  path: path || "",
  method: "GET",
  headers: {
    Authorization: API_KEY,
  },
});

const handleResponse = (resolve, reject) => (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    try {
      resolve(data);
    } catch (error) {
      console.error("Error:", error);
      reject(new Error("Failed to parse response data"));
    }
  });

  response.on("error", (err) => {
    console.error("Error:", err.message);

    reject(err);
  });
};

const fetchData = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, handleResponse(resolve, reject));
    req.on("error", (err) => {
      console.error("Request failed:", err.message);
      reject(new Error("Request failed: " + err.message));
    });
    req.end();
  });
};

const fetchFileList = async () => {
  try {
    const options = getOptions("/v1/secret/files");
    const response = await fetchData(options);
    return JSON.parse(response).files || [];
  } catch (error) {
    console.error("Error fetching file list:", error.message);
    throw new Error("Failed to fetch file list");
  }
};

const downloadFileData = async (fileName) => {
  try {
    const options = getOptions(`/v1/secret/file/${fileName}`);

    const response = await fetchData(options);
    return response;
  } catch (error) {
    console.warn(`Error fetching file: ${fileName}`);
    return null;
  }
};

const processCSV = (csvContent, fileName) => {
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
export { fetchFileList, processCSV, downloadFileData };
