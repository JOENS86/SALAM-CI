import mongoose from "mongoose"

// =========================
// CATEGORY SCHEMA
// =========================
const categorySchema = new mongoose.Schema(

    {

        // =========================
        // NOM
        // =========================
        name: {

            type: String,
            required: true,
            unique: true,
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
        // COULEUR
        // =========================
        color: {

            type: String,
            default: "#7C3AED"

        },

        // =========================
        // ACTIVE
        // =========================
        isActive: {

            type: Boolean,
            default: true

        }

    },

    {

        timestamps: true

    }

)

// =========================
// MODEL
// =========================
const Category = mongoose.model(

    "Category",

    categorySchema

)

export default Category