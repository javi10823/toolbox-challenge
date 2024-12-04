import express from "express";
const router = express.Router();
import { filesController } from "../controllers/files.js";
import {
  downloadFileData,
  fetchFileList,
  processCSV,
} from "../utils/files.utils.js";
const { getFilesData, getList } = filesController({
  fetchFileList,
  downloadFileData,
  processCSV,
});
router.get("/data", getFilesData);

router.get("/list", getList);

export default router;
