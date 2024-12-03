import express from "express";
const router = express.Router();
import * as filesController from "../controllers/files.js";

router.get("/data", filesController.getFilesData);

router.get("/list", filesController.getList);

export default router;
