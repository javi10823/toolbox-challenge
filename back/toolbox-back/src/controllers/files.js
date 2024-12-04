export const filesController = (filesUtils) => {
  const { fetchFileList, downloadFileData, processCSV } = filesUtils;
  const getFilesData = async (req, res) => {
    try {
      const { fileName: requestedFileName } = req.query;

      const files = requestedFileName
        ? [requestedFileName]
        : await fetchFileList();

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

  const getList = async (req, res) => {
    try {
      const files = await fetchFileList();
      res.status(200).json(files);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch file list" });
    }
  };

  return { getFilesData, getList };
};
