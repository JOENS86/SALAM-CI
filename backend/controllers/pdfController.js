import Pdf from "../models/Pdf.js";

// ======================================
// AJOUTER UN PDF
// POST /api/pdfs
// ======================================
export const createPdf = async (req, res) => {

    try {

        const {

            title,
            description,
            chapter

        } = req.body;

        const file = req.file?.path || "";

        const pdf = await Pdf.create({

            title,

            description,

            chapter,

            file

        });

        res.status(201).json({

            message: "Document ajouté avec succès.",

            pdf

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// PDF D'UN CHAPITRE
// ======================================
export const getChapterPdfs = async (req, res) => {

    try {

        const pdfs = await Pdf.find({

            chapter: req.params.chapterId

        })

        .sort({

            order: 1

        });

        res.status(200).json(pdfs);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// MODIFIER UN PDF
// PUT /api/pdfs/:id
// ======================================
export const updatePdf = async (req, res) => {

    try {

        const pdf = await Pdf.findById(req.params.id);

        if (!pdf) {

            return res.status(404).json({

                message: "Document introuvable."

            });

        }

        pdf.title = req.body.title;

        pdf.description = req.body.description;

        // Si un nouveau fichier est envoyé
        if (req.file) {

            pdf.file = req.file.path;

        }

        await pdf.save();

        res.status(200).json({

            message: "Document modifié avec succès.",

            pdf

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// SUPPRIMER UN PDF
// DELETE /api/pdfs/:id
// ======================================
export const deletePdf = async (req, res) => {

    try {

        const pdf = await Pdf.findById(req.params.id);

        if (!pdf) {

            return res.status(404).json({

                message: "Document introuvable."

            });

        }

        await pdf.deleteOne();

        res.status(200).json({

            message: "Document supprimé."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


