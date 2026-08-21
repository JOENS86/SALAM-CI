import express from "express";

import {
  getSettings,
  updateSettings,
  changeAdminPassword
} from "../controllers/settingsController.js";

import authMiddleware from "../middleware/authMiddleware.js"

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

// =====================================================
// CHANGER MOT DE PASSE ADMIN
// PUT /api/settings/change-password
// =====================================================
router.put(

  "/change-password",

  authMiddleware,

  changeAdminPassword

)


export default router;