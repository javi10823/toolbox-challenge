import {
  fetchFileList,
  downloadFileData,
  processCSV,
} from "../utils/files.utils.js";

export const getFilesData = async (req, res) => {
  try {
    const files = await fetchFileList();

    const fileDataPromises = files.map(async (fileName) => {
      const fileContent = await downloadFileData(fileName);
      if (!fileContent) return null;

      const formattedData = processCSV(fileContent, fileName);
      return { file: fileName, lines: formattedData };
    });

    const processedFiles = await Promise.all(fileDataPromises);
    const validFiles = processedFiles.filter(
      (file) => file && file.lines.length > 0
    );

    res.status(200).json(validFiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to process files" });
  }
};

export const getList = async (req, res) => {
  try {
    const files = await fetchFileList();
    res.status(200).json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch file list" });
  }
};
