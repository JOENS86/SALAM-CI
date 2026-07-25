import express from "express"

import upload from "../middleware/uploadMiddleware.js"

import {

  createCourse,
  getCourses,
  getTeacherCourses,
  getCourseStats,
  getCoursesByCategory,
  getCourseById,
  publishCourse,
  suspendCourse,
  updateCourse,
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
// COURS D'UN ENSEIGNANT
// ======================================
router.get(
  "/teacher/:teacherId",
  getTeacherCourses
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
  "/category/:category",
  getCoursesByCategory
)

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
// MISE A JOUR
// ======================================
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail" },
    { name: "pdf" },
    { name: "video" }
  ]),
  updateCourse
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