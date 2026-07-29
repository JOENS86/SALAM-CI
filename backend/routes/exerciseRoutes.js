import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {

    createExercise,
    getExercisesByChapter,
    updateExercise,
    deleteExercise

} from "../controllers/exerciseController.js";

const router = express.Router();

// ======================================================
// AJOUTER
// ======================================================

router.post(

    "/",

    upload.single("attachment"),

    createExercise

);

// ======================================================
// PAR CHAPITRE
// ======================================================

router.get(

    "/chapter/:chapterId",

    getExercisesByChapter

);

// ======================================================
// MODIFIER
// ======================================================

router.put(

    "/:id",

    upload.single("attachment"),

    updateExercise

);

// ======================================================
// SUPPRIMER
// ======================================================

router.delete(

    "/:id",

    deleteExercise

);

export default router;