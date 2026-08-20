import express from "express";
import { getAllFiles } from "../controllers/fileController.js";

const router = express.Router();

// GET /api/files
router.get("/", getAllFiles);

export default router;