import Course from "../models/Course.js";
import Pdf from "../models/Pdf.js";
import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";

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

                    source: "course-thumbnail",

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

                    source: "course-thumbnail",
                    
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

                    source: "course-thumbnail",

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

                source: "course-pdf",

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

                source: "course-video",

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


// =====================================================
// SUPPRIMER UN FICHIER
// DELETE /api/files/:source/:sourceId
// =====================================================
export const deleteFile = async (req, res) => {

    try {

        const { source, sourceId } = req.params;

        console.log("🗑️ Suppression fichier :", {
            source,
            sourceId
        });

        // =================================================
        // FICHIER DU COURS
        // =================================================

        if (
            source === "course-thumbnail" ||
            source === "course-pdf" ||
            source === "course-video"
        ) {

            const course = await Course.findById(sourceId);

            if (!course) {

                return res.status(404).json({
                    success: false,
                    message: "Cours introuvable"
                });

            }

            let field = null;

            if (source === "course-thumbnail") {
                field = "thumbnail";
            }

            if (source === "course-pdf") {
                field = "pdf";
            }

            if (source === "course-video") {
                field = "video";
            }

            const fileUrl = course[field];

            if (!fileUrl) {

                return res.status(404).json({
                    success: false,
                    message: "Fichier introuvable"
                });

            }

            // =================================================
            // SUPPRESSION CLOUDINARY
            // =================================================

            if (fileUrl.includes("res.cloudinary.com")) {

                try {

                    const uploadIndex =
                        fileUrl.indexOf("/upload/");

                    if (uploadIndex !== -1) {

                        let publicId =
                            fileUrl.substring(
                                uploadIndex + "/upload/".length
                            );

                        // Retirer la version v123456...
                        publicId =
                            publicId.replace(
                                /^v\d+\//,
                                ""
                            );

                        // Retirer l'extension
                        const extensionIndex =
                            publicId.lastIndexOf(".");

                        if (extensionIndex !== -1) {

                            publicId =
                                publicId.substring(
                                    0,
                                    extensionIndex
                                );

                        }

                        let resourceType = "image";

                        if (source === "course-video") {
                            resourceType = "video";
                        }

                        console.log(
                            "☁️ Suppression Cloudinary :",
                            publicId
                        );

                        await cloudinary.uploader.destroy(
                            publicId,
                            {
                                resource_type: resourceType
                            }
                        );

                    }

                } catch (cloudinaryError) {

                    console.error(
                        "⚠️ Erreur Cloudinary :",
                        cloudinaryError.message
                    );

                }

            }

            // =================================================
            // SUPPRESSION DE L'URL DANS MONGODB
            // =================================================

            course[field] = "";

            await course.save();

            return res.status(200).json({

                success: true,

                message: "Fichier supprimé avec succès"

            });

        }

        // =================================================
        // PDF DE CHAPITRE
        // =================================================

        if (source === "chapter-pdf") {

            const pdf = await Pdf.findById(sourceId);

            if (!pdf) {

                return res.status(404).json({
                    success: false,
                    message: "PDF introuvable"
                });

            }

            await Pdf.findByIdAndDelete(sourceId);

            return res.status(200).json({

                success: true,

                message: "PDF supprimé avec succès"

            });

        }

        // =================================================
        // VIDEO DE CHAPITRE
        // =================================================

        if (source === "chapter-video") {

            const video = await Video.findById(sourceId);

            if (!video) {

                return res.status(404).json({
                    success: false,
                    message: "Vidéo introuvable"
                });

            }

            await Video.findByIdAndDelete(sourceId);

            return res.status(200).json({

                success: true,

                message: "Vidéo supprimée avec succès"

            });

        }

        // =================================================
        // SOURCE INCONNUE
        // =================================================

        return res.status(400).json({

            success: false,

            message: "Type de fichier non pris en charge"

        });

    } catch (error) {

        console.error(
            "❌ Erreur suppression fichier :",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Erreur lors de la suppression du fichier",

            error: error.message

        });

    }

};