// ============================================================
// Import d'Express
// ============================================================
import express from "express";

// ============================================================
// Import des fonctions du contrôleur
// ============================================================
import {
    createChapter,
    getCourseChapters,
    updateChapter,
    deleteChapter,
} from "../controllers/chapterController.js";

// ============================================================
// Création du routeur Express
// ============================================================
const router = express.Router();

/**
 * ============================================================
 * CREER UN CHAPITRE
 * ============================================================
 * Méthode : POST
 * URL : /api/chapters
 */
router.post("/", createChapter);

/**
 * ============================================================
 * RECUPERER TOUS LES CHAPITRES D'UN COURS
 * ============================================================
 * Méthode : GET
 * URL : /api/chapters/course/:courseId
 */
router.get("/course/:courseId", getCourseChapters);

/**
 * ============================================================
 * MODIFIER UN CHAPITRE
 * ============================================================
 * Méthode : PUT
 * URL : /api/chapters/:id
 */
router.put("/:id", updateChapter);

/**
 * ============================================================
 * SUPPRIMER UN CHAPITRE
 * ============================================================
 * Méthode : DELETE
 * URL : /api/chapters/:id
 */
router.delete("/:id", deleteChapter);

// ============================================================
// Export du routeur
// ============================================================
export default router;