import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

import {

  getUsers,
  getUserStats,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus

} from "../controllers/userController.js"

const router = express.Router()

// ======================================
// STATISTIQUES
// GET /api/users/stats
// ======================================
router.get(

  "/stats",

  authMiddleware,

  getUserStats

)

// ======================================
// PROFIL CONNECTÉ
// GET /api/users/profile
// ======================================
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

// ======================================
// TOUS LES UTILISATEURS
// GET /api/users
// ======================================
router.get(

  "/",

  authMiddleware,

  getUsers

)

// ======================================
// RÉCUPÉRER UN UTILISATEUR
// GET /api/users/:id
// ======================================
router.get(

  "/:id",

  authMiddleware,

  getUserById

)

// ======================================
// MODIFIER UN UTILISATEUR
// PUT /api/users/:id
// ======================================
router.put(

  "/:id",

  authMiddleware,

  updateUser

)

// ======================================
// SUPPRIMER UN UTILISATEUR
// DELETE /api/users/:id
// ======================================
router.delete(

  "/:id",

  authMiddleware,

  deleteUser

)

// ======================================
// ACTIVER / DÉSACTIVER
// PATCH /api/users/:id/status
// ======================================
router.patch(

  "/:id/status",

  authMiddleware,

  toggleUserStatus

)

export default router

