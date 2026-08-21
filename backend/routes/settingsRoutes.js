import express from "express";

import {
  getSettings,
  updateSettings
} from "../controllers/settingsController.js";


const router = express.Router();


// =====================================================
// RÉCUPÉRER LES PARAMÈTRES
// GET /api/settings
// =====================================================

router.get(
  "/",
  getSettings
);


// =====================================================
// MODIFIER LES PARAMÈTRES
// PUT /api/settings
// =====================================================

router.put(
  "/",
  updateSettings
);


export default router;