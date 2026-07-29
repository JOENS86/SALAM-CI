
import fs from "fs";
import Video from "../models/Video.js";

// ============================================================
// AJOUTER UNE VIDEO
// POST /api/videos
// ============================================================

export const createVideo = async (req, res) => {

    try {

        const {

            title,

            description,

            duration,

            order,

            chapter

        } = req.body;

        // ==========================
        // VIDEO
        // ==========================

        const video = req.file
            ? req.file.path
            : "";

        const newVideo = await Video.create({

            title,

            description,

            duration,

            order,

            chapter,

            video

        });

        res.status(201).json({

            message: "Vidéo ajoutée avec succès.",

            video: newVideo

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ============================================================
// VIDEOS D'UN CHAPITRE
// ============================================================

export const getVideosByChapter = async (req, res) => {

    try {

        const videos = await Video.find({

            chapter: req.params.chapterId

        })

        .sort({

            order: 1

        });

        res.json(videos);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ============================================================
// MODIFIER UNE VIDEO
// PUT /api/videos/:id
// ============================================================
export const updateVideo = async (req, res) => {

    try {

        const video = await Video.findById(req.params.id);

        if (!video) {

            return res.status(404).json({

                message: "Vidéo introuvable."

            });

        }

        video.title = req.body.title;
        video.description = req.body.description;
        video.duration = req.body.duration;
        video.order = req.body.order;

        if (req.file) {

            if (video.video && fs.existsSync(video.video)) {

                fs.unlinkSync(video.video);

            }

            video.video = req.file.path;

        }

        await video.save();

        res.status(200).json({

            message: "Vidéo modifiée avec succès.",

            video

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ============================================================
// SUPPRIMER UNE VIDEO
// DELETE /api/videos/:id
// ============================================================
export const deleteVideo = async (req, res) => {

    try {

        const video = await Video.findById(req.params.id);

        if (!video) {

            return res.status(404).json({

                message: "Vidéo introuvable."

            });

        }

        if (video.video && fs.existsSync(video.video)) {

            fs.unlinkSync(video.video);

        }

        await video.deleteOne();

        res.status(200).json({

            message: "Vidéo supprimée."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};