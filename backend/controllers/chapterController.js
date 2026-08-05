// Import du modèle Chapter
import Chapter from "../models/Chapter.js";
import Video from "../models/Video.js";
import Pdf from "../models/Pdf.js";
import Quiz from "../models/Quiz.js";
import Exercise from "../models/Exercise.js";

/**
 * ============================================================
 * CREER UN NOUVEAU CHAPITRE
 * ============================================================
 */
export const createChapter = async (req, res) => {
    try {

        // Récupération des données envoyées par le frontend
        const {
            title,
            description,
            course
        } = req.body;

        /**
         * Vérification :
         * le titre et le cours sont obligatoires.
         */
        if (!title || !course) {
            return res.status(400).json({
                message: "Le titre et le cours sont obligatoires."
            });
        }

        /**
         * Recherche du dernier chapitre
         * afin de déterminer automatiquement son ordre.
         */
        const lastChapter = await Chapter
            .findOne({ course })
            .sort({ order: -1 });

        /**
         * Si aucun chapitre n'existe encore,
         * on commence à 1.
         */
        const nextOrder = lastChapter
            ? lastChapter.order + 1
            : 1;

        /**
         * Création du nouveau chapitre
         */
        const chapter = await Chapter.create({

            title,

            description,

            course,

            order: nextOrder

        });

        return res.status(201).json(chapter);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur serveur."
        });

    }
};

/**
 * ============================================================
 * RECUPERER TOUS LES CHAPITRES D'UN COURS
 * ============================================================
 */
export const getCourseChapters = async (req, res) => {

    try {

        const { courseId } = req.params;

        /**
         * Recherche de tous les chapitres
         * appartenant au cours.
         */

        const chapters = await Chapter
            .find({ course: courseId })
            .sort({ order: 1 });

        const chaptersWithStats = await Promise.all(

            chapters.map(async (chapter) => {

                const videoCount = await Video.countDocuments({
                    chapter: chapter._id
                });

                const pdfCount = await Pdf.countDocuments({
                    chapter: chapter._id
                });

                const quizCount = await Quiz.countDocuments({
                    chapter: chapter._id
                });

                const exerciseCount = await Exercise.countDocuments({
                    chapter: chapter._id
                });

                return {

                    ...chapter.toObject(),

                    videoCount,

                    pdfCount,

                    quizCount,

                    exerciseCount

                };

            })

        );

        return res.json(chaptersWithStats);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Erreur serveur."

        });

    }

};

/**
 * ============================================================
 * MODIFIER UN CHAPITRE
 * ============================================================
 */
export const updateChapter = async (req, res) => {

    try {

        const { id } = req.params;

        /**
         * Mise à jour du chapitre
         */
        const chapter = await Chapter.findByIdAndUpdate(

            id,

            req.body,

            {
                new: true
            }

        );

        if (!chapter) {

            return res.status(404).json({
                message: "Chapitre introuvable."
            });

        }

        return res.json(chapter);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur serveur."
        });

    }

};

/**
 * ============================================================
 * SUPPRIMER UN CHAPITRE
 * ============================================================
 */
export const deleteChapter = async (req, res) => {

    try {

        const { id } = req.params;

        const chapter = await Chapter.findByIdAndDelete(id);

        if (!chapter) {

            return res.status(404).json({
                message: "Chapitre introuvable."
            });

        }

        return res.json({
            message: "Chapitre supprimé avec succès."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Erreur serveur."
        });

    }

};