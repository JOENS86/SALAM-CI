import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {

    createVideo,
    getVideosByChapter,
    updateVideo,
    deleteVideo

} from "../controllers/videoController.js";

const router = express.Router();

// =============================
// AJOUTER
// =============================
router.post(

    "/",

    upload.single("video"),

    createVideo

);

// =============================
// VIDEOS D'UN CHAPITRE
// =============================
router.get(

    "/chapter/:chapterId",

    getVideosByChapter

);

// =============================
// MODIFIER
// =============================
router.put(

    "/:id",

    upload.single("video"),

    updateVideo

);

// =============================
// SUPPRIMER
// =============================
router.delete(

    "/:id",

    deleteVideo

);

export default router;
