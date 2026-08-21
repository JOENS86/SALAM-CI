import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

import {

  getUsers,
  getTeachers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus

} from "../controllers/userController.js"

const router = express.Router()


// ======================================
// STATISTIQUES
// GET /api/users/stats
// ADMIN UNIQUEMENT
// ======================================
router.get(

  "/stats",

  authMiddleware,

  adminMiddleware,

  getUserStats

)


// ======================================
// PROFIL CONNECTÉ
// GET /api/users/profile
// UTILISATEUR AUTHENTIFIÉ
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
// ENSEIGNANTS
// GET /api/users/teachers
// UTILISATEUR AUTHENTIFIÉ
// ======================================
router.get(

  "/teachers",

  authMiddleware,

  getTeachers

)


// ======================================
// TOUS LES UTILISATEURS
// GET /api/users
// ADMIN UNIQUEMENT
// ======================================
router.get(

  "/",

  authMiddleware,

  adminMiddleware,

  getUsers

)


// ======================================
// CRÉER UN UTILISATEUR
// POST /api/users
// ADMIN UNIQUEMENT
// ======================================
router.post(

  "/",

  authMiddleware,

  adminMiddleware,

  createUser

)


// ======================================
// RÉCUPÉRER UN UTILISATEUR
// GET /api/users/:id
// ADMIN UNIQUEMENT
// ======================================
router.get(

  "/:id",

  authMiddleware,

  adminMiddleware,

  getUserById

)


// ======================================
// MODIFIER UN UTILISATEUR
// PUT /api/users/:id
// ADMIN UNIQUEMENT
// ======================================
router.put(

  "/:id",

  authMiddleware,

  adminMiddleware,

  updateUser

)


// ======================================
// SUPPRIMER UN UTILISATEUR
// DELETE /api/users/:id
// ADMIN UNIQUEMENT
// ======================================
router.delete(

  "/:id",

  authMiddleware,

  adminMiddleware,

  deleteUser

)


// ======================================
// ACTIVER / DÉSACTIVER
// PATCH /api/users/:id/status
// ADMIN UNIQUEMENT
// ======================================
router.patch(

  "/:id/status",

  authMiddleware,

  adminMiddleware,

  toggleUserStatus

)


export default router