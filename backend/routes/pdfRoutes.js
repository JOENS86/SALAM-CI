import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
    createPdf,
    getChapterPdfs,
    updatePdf,
    deletePdf
} from "../controllers/pdfController.js";

const router = express.Router();

// =====================================
// AJOUTER
// =====================================
router.post(

    "/",

    upload.single("pdf"),

    createPdf

);

// =====================================
// PDF D'UN CHAPITRE
// =====================================
router.get(

    "/chapter/:chapterId",

    getChapterPdfs

);


// =====================================
// MODIFIER
// =====================================
router.put(
    "/:id",
    upload.single("pdf"),
    updatePdf
);


// =====================================
// SUPPRIMER
// =====================================
router.delete(

    "/:id",

    deletePdf

);

export default router;