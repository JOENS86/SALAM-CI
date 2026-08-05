import mongoose from "mongoose";

// =====================================================
// MODELE : MESSAGE DE CONFERENCE
// =====================================================

const conferenceMessageSchema = new mongoose.Schema(

    {

        // =====================================================
        // CONFERENCE CONCERNEE
        // =====================================================

        conference: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Conference",

            required: true

        },

        // =====================================================
        // EXPEDITEUR
        // =====================================================

        sender: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // TYPE D'UTILISATEUR
        // =====================================================

        senderRole: {

            type: String,

            enum: [

                "admin",

                "teacher",

                "student"

            ],

            required: true

        },

        // =====================================================
        // CONTENU DU MESSAGE
        // =====================================================

        message: {

            type: String,

            required: true,

            trim: true

        },

        // =====================================================
        // MESSAGE MODIFIE ?
        // =====================================================

        edited: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // DATE DE MODIFICATION
        // =====================================================

        editedAt: {

            type: Date

        },

        // =====================================================
        // MESSAGE SUPPRIME ?
        // =====================================================

        deleted: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }

);

// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(

    "ConferenceMessage",

    conferenceMessageSchema

);