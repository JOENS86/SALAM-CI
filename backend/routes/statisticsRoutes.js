import express from "express";

import {
    getPlatformStatistics
} from "../controllers/statisticsController.js";


const router = express.Router();


// =====================================================
// STATISTIQUES GÉNÉRALES
// GET /api/statistics
// =====================================================

router.get(
    "/",
    getPlatformStatistics
);


export default router;