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

            trim: true,

            maxlength: 200

        },


        // =====================================================
        // MESSAGE
        // =====================================================

        message: {

            type: String,

            required: true,

            trim: true,

            maxlength: 1000

        },


        // =====================================================
        // TYPE DE NOTIFICATION
        // =====================================================

        type: {

            type: String,

            enum: [

                // ---------------------------------------------
                // CONFERENCES
                // ---------------------------------------------

                "conference_request",

                "conference_approved",

                "conference_rejected",

                "conference_scheduled",

                "conference_started",

                "conference_completed",

                "conference_cancelled",


                // ---------------------------------------------
                // COMMUNAUTE
                // ---------------------------------------------

                "community_post",

                "community_comment",

                "community_like",

                "community_mention",

                "community_share",


                // ---------------------------------------------
                // FORMATION
                // ---------------------------------------------

                "course",

                "quiz",

                "exercise",

                "certificate",


                // ---------------------------------------------
                // COMMUNICATION
                // ---------------------------------------------

                "message",


                // ---------------------------------------------
                // SYSTEME
                // ---------------------------------------------

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

                "message",

                "communityPost",

                "communityComment"

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
        // NOTIFICATION LUE ?
        // =====================================================

        isRead: {

            type: Boolean,

            default: false

        }

    },


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    {

        timestamps: true

    }

);


// =====================================================
// INDEX
// =====================================================

// Permet de récupérer rapidement les notifications
// d'un utilisateur dans l'ordre chronologique.

notificationSchema.index({

    recipient: 1,

    createdAt: -1

});


// Permet de récupérer rapidement les notifications
// non lues.

notificationSchema.index({

    recipient: 1,

    isRead: 1

});


// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(

    "Notification",

    notificationSchema

);