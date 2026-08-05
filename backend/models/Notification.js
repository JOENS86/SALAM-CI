import mongoose from "mongoose";

// =====================================================
// MODELE : NOTIFICATION
// =====================================================

const notificationSchema = new mongoose.Schema(

    {

        // =====================================================
        // DESTINATAIRE
        // =====================================================

        recipient: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // EXPEDITEUR
        // =====================================================

        sender: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },

        // =====================================================
        // TITRE
        // =====================================================

        title: {

            type: String,

            required: true,

            trim: true

        },

        // =====================================================
        // MESSAGE
        // =====================================================

        message: {

            type: String,

            required: true,

            trim: true

        },

        // =====================================================
        // TYPE DE NOTIFICATION
        // =====================================================

        type: {

            type: String,

            enum: [

                "conference_request",

                "conference_approved",

                "conference_rejected",

                "conference_scheduled",

                "conference_started",

                "conference_completed",

                "course",

                "quiz",

                "exercise",

                "certificate",

                "message",

                "system"

            ],

            required: true

        },

        // =====================================================
        // TYPE D'OBJET CONCERNE
        // =====================================================

        entityType: {

            type: String,

            enum: [

                "conference",

                "conferenceRequest",

                "course",

                "quiz",

                "exercise",

                "certificate",

                "message"

            ],

            default: null

        },

        // =====================================================
        // IDENTIFIANT DE L'OBJET
        // =====================================================

        entityId: {

            type: mongoose.Schema.Types.ObjectId,

            default: null

        },

        // =====================================================
        // EMAIL ENVOYE ?
        // =====================================================

        emailSent: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // LUE ?
        // =====================================================

        isRead: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }

);

export default mongoose.model(

    "Notification",

    notificationSchema

);