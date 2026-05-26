import express from "express"

import upload from "../middleware/uploadMiddleware.js"

import {
  createCourse,
  getCourses
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

// =========================
// GET COURSES
// =========================
router.get("/", getCourses)

export default router