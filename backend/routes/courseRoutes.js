import express from "express"

import upload from "../middleware/uploadMiddleware.js"

import {

  createCourse,
  getCourses,
  getCourseStats,
  getCourseById,
  publishCourse,
  suspendCourse,
  deleteCourse

} from "../controllers/courseController.js"

const router = express.Router()

// =========================
// CREATE COURSE
// =========================
router.post(

  "/create",

  upload.fields([
    { name: "thumbnail" },
    { name: "pdf" },
    { name: "video" }
  ]),

  createCourse

)

// ======================================
// STATISTIQUES
// ======================================
router.get(
  "/stats",
  getCourseStats
)

// ======================================
// RÉCUPÉRER UN COURS
// ======================================
router.get(
  "/:id",
  getCourseById
)

// ======================================
// PUBLIER
// ======================================
router.patch(
  "/:id/publish",
  publishCourse
)

// ======================================
// SUSPENDRE
// ======================================
router.patch(
  "/:id/suspend",
  suspendCourse
)

// ======================================
// SUPPRIMER
// ======================================
router.delete(
  "/:id",
  deleteCourse
)

// ======================================
// LISTE DES COURS
// ======================================
router.get(
  "/",
  getCourses
)

export default router