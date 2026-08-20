import Course from "../models/Course.js";
import Pdf from "../models/Pdf.js";
import Video from "../models/Video.js";

// =====================================================
// RÉCUPÉRER TOUS LES FICHIERS DE LA PLATEFORME
// GET /api/files
// =====================================================

export const getAllFiles = async (req, res) => {

    try {

        const files = [];

        // =====================================================
        // 1. FICHIERS DES COURS
        // =====================================================

        const courses = await Course
            .find()
            .populate("teacher", "firstName lastName name email")
            .sort({ createdAt: -1 });

        courses.forEach((course) => {

            // -------------------------
            // IMAGE DU COURS
            // -------------------------

            if (course.thumbnail) {

                files.push({

                    _id: `${course._id}-thumbnail`,

                    name: `${course.title} - Image`,

                    type: "Image",

                    owner:
                        course.teacher?.name ||
                        `${course.teacher?.firstName || ""} ${course.teacher?.lastName || ""}`.trim() ||
                        "Inconnu",

                    size: "—",

                    url: course.thumbnail,

                    source: "course",

                    sourceId: course._id,

                    createdAt: course.createdAt

                });

            }

            // -------------------------
            // PDF DU COURS
            // -------------------------

            if (course.pdf) {

                files.push({

                    _id: `${course._id}-pdf`,

                    name: `${course.title}.pdf`,

                    type: "PDF",

                    owner:
                        course.teacher?.name ||
                        `${course.teacher?.firstName || ""} ${course.teacher?.lastName || ""}`.trim() ||
                        "Inconnu",

                    size: "—",

                    url: course.pdf,

                    source: "course",

                    sourceId: course._id,

                    createdAt: course.createdAt

                });

            }

            // -------------------------
            // VIDÉO DU COURS
            // -------------------------

            if (course.video) {

                files.push({

                    _id: `${course._id}-video`,

                    name: `${course.title}.mp4`,

                    type: "Vidéo",

                    owner:
                        course.teacher?.name ||
                        `${course.teacher?.firstName || ""} ${course.teacher?.lastName || ""}`.trim() ||
                        "Inconnu",

                    size: "—",

                    url: course.video,

                    source: "course",

                    sourceId: course._id,

                    createdAt: course.createdAt

                });

            }

        });


        // =====================================================
        // 2. PDF DES CHAPITRES
        // =====================================================

        const pdfs = await Pdf
            .find()
            .populate({
                path: "chapter",
                populate: {
                    path: "course",
                    populate: {
                        path: "teacher",
                        select: "firstName lastName name email"
                    }
                }
            })
            .sort({ createdAt: -1 });


        pdfs.forEach((pdf) => {

            const teacher = pdf.chapter?.course?.teacher;

            files.push({

                _id: pdf._id,

                name: pdf.title || "Document PDF",

                type: "PDF",

                owner:
                    teacher?.name ||
                    `${teacher?.firstName || ""} ${teacher?.lastName || ""}`.trim() ||
                    "Inconnu",

                size: "—",

                url: pdf.file,

                source: "chapter-pdf",

                sourceId: pdf._id,

                createdAt: pdf.createdAt

            });

        });


        // =====================================================
        // 3. VIDÉOS DES CHAPITRES
        // =====================================================

        const videos = await Video
            .find()
            .populate({
                path: "chapter",
                populate: {
                    path: "course",
                    populate: {
                        path: "teacher",
                        select: "firstName lastName name email"
                    }
                }
            })
            .sort({ createdAt: -1 });


        videos.forEach((video) => {

            const teacher = video.chapter?.course?.teacher;

            files.push({

                _id: video._id,

                name: video.title || "Vidéo",

                type: "Vidéo",

                owner:
                    teacher?.name ||
                    `${teacher?.firstName || ""} ${teacher?.lastName || ""}`.trim() ||
                    "Inconnu",

                size: "—",

                url: video.video,

                source: "chapter-video",

                sourceId: video._id,

                createdAt: video.createdAt

            });

        });


        // =====================================================
        // TRI FINAL
        // =====================================================

        files.sort((a, b) => {

            return new Date(b.createdAt || 0) -
                   new Date(a.createdAt || 0);

        });


        // =====================================================
        // RÉPONSE
        // =====================================================

        res.status(200).json({

            success: true,

            count: files.length,

            files

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur récupération fichiers :",
            error
        );

        res.status(500).json({

            success: false,

            message: "Erreur lors de la récupération des fichiers",

            error: error.message

        });

    }

};