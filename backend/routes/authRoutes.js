import express from "express"

import {
  register,
  login,
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  verifyTwoFactorLogin
} from "../controllers/authController.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()


// =====================================================
// INSCRIPTION
// =====================================================
router.post(
  "/register",
  register
)


// =====================================================
// CONNEXION
// =====================================================
router.post(
  "/login",
  login
)


// =====================================================
// AUTHENTIFICATION 2 FACTEURS
// =====================================================

// -----------------------------------------------------
// Vérifier le code 2FA pendant la connexion
// -----------------------------------------------------
router.post(
  "/2fa/verify-login",
  verifyTwoFactorLogin
)


// -----------------------------------------------------
// Générer le secret + QR Code
// Nécessite une session authentifiée
// -----------------------------------------------------
router.get(
  "/2fa/setup",
  authMiddleware,
  setupTwoFactor
)


// -----------------------------------------------------
// Vérifier le premier code pour activer le 2FA
// -----------------------------------------------------
router.post(
  "/2fa/verify-setup",
  authMiddleware,
  verifyTwoFactorSetup
)


// -----------------------------------------------------
// Désactiver le 2FA
// Nécessite le token de l'utilisateur
// -----------------------------------------------------
router.post(
  "/2fa/disable",
  authMiddleware,
  disableTwoFactor
)


export default router