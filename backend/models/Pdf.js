import mongoose from "mongoose";

// =========================
// PDF SCHEMA
// =========================
const pdfSchema = new mongoose.Schema(

    {

        // =========================
        // TITRE
        // =========================
        title: {

            type: String,

            required: true,

            trim: true

        },

        // =========================
        // DESCRIPTION
        // =========================
        description: {

            type: String,

            default: ""

        },

        // =========================
        // FICHIER PDF
        // =========================
        file: {

            type: String,

            required: true

        },

        // =========================
        // CHAPITRE
        // =========================
        chapter: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Chapter",

            required: true

        },

        // =========================
        // ORDRE D'AFFICHAGE
        // =========================
        order: {

            type: Number,

            default: 1

        },

        // =========================
        // NOMBRE DE TELECHARGEMENTS
        // =========================
        downloads: {

            type: Number,

            default: 0

        }

    },

    {

        timestamps: true

    }

);

const Pdf = mongoose.model(

    "Pdf",

    pdfSchema

);

export default Pdf;