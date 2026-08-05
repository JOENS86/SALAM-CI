import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {

    enrollStudent,
    getMyCourses,
    getTeacherStudents,
    updateProgress,
    unenrollStudent,
    checkEnrollment,
    getEnrollment

} from "../controllers/enrollmentController.js";

const router = express.Router();

// =====================================================
// INSCRIPTION A UN COURS
// =====================================================

router.post(

    "/",

    authMiddleware,

    enrollStudent

);

// =====================================================
// SE DESINSCRIRE
// =====================================================
router.delete(

    "/:courseId",

    authMiddleware,

    unenrollStudent

);

// =====================================================
// VERIFIER L'INSCRIPTION
// =====================================================
router.get(

    "/check/:courseId",

    authMiddleware,

    checkEnrollment

);

// =====================================================
// MES COURS (ETUDIANT)
// =====================================================

router.get(

    "/my-courses",

    authMiddleware,

    getMyCourses

);

// =====================================================
// ETUDIANTS DE L'ENSEIGNANT
// =====================================================
router.get(

    "/teacher/students",

    authMiddleware,

    getTeacherStudents

);

// =====================================================
// MISE A JOUR DE LA PROGRESSION
// =====================================================
router.patch(

    "/:courseId/progress",

    authMiddleware,

    updateProgress

);

// =====================================================
// DETAILS D'UNE INSCRIPTION
// =====================================================
router.get(

    "/:id",

    authMiddleware,

    getEnrollment

);


export default router;