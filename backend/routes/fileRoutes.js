import express from "express";
import { getAllFiles, deleteFile } from "../controllers/fileController.js";

const router = express.Router();

// GET /api/files
router.get("/", getAllFiles);

// DELETE /api/files/:source/:sourceId
router.delete("/:source/:sourceId", deleteFile);

export default router;