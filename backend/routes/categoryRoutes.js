import express from "express"

import {

    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats,
    getCategoriesList

} from "../controllers/categoryController.js"

const router = express.Router()

// =========================
// STATISTIQUES
// =========================
router.get("/stats", getCategoryStats)

// =========================
// LISTE DES CATÉGORIES
// GET /api/categories/list
// =========================
router.get(
    "/list",
    getCategoriesList
);

// =========================
// LISTE DES CATEGORIES
// =========================
router.get("/", getCategories)

// =========================
// DETAILS
// =========================
router.get("/:id", getCategory)

// =========================
// AJOUT
// =========================
router.post("/", createCategory)

// =========================
// MODIFICATION
// =========================
router.put("/:id", updateCategory)

// =========================
// SUPPRESSION
// =========================
router.delete("/:id", deleteCategory)

export default router