import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// =========================
// ROUTE PROTÉGÉE
// =========================
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Profil sécurisé",
      user: req.user
    })

  }
)

export default router