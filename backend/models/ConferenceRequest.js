import mongoose from "mongoose";

// =====================================================
// MODELE : DEMANDE DE CONFERENCE
// =====================================================

const conferenceRequestSchema = new mongoose.Schema(

    {

        // =====================================================
        // ENSEIGNANT AYANT FAIT LA DEMANDE
        // =====================================================

        teacher: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // COURS CONCERNE
        // =====================================================

        course: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Course",

            required: true

        },

        // =====================================================
        // TITRE DE LA CONFERENCE
        // =====================================================

        title: {

            type: String,

            required: true,

            trim: true

        },

        // =====================================================
        // DESCRIPTION
        // =====================================================

        description: {

            type: String,

            default: ""

        },

        // =====================================================
        // IMAGE DE LA CONFERENCE
        // =====================================================

        image: {

            type: String,

            default: ""

        },

        // =====================================================
        // DATE
        // =====================================================

        date: {

            type: Date,

            required: true

        },

        // =====================================================
        // HEURE
        // =====================================================

        time: {

            type: String,

            required: true

        },

        // =====================================================
        // DUREE (en minutes)
        // =====================================================

        duration: {

            type: Number,

            default: 60

        },

        // =====================================================
        // NOMBRE MAXIMUM DE PARTICIPANTS
        // =====================================================

        maxParticipants: {

            type: Number,

            default: 100

        },

        // =====================================================
        // LIEN DE CONFERENCE (JITSI, ZOOM...)
        // =====================================================

        meetingLink: {

            type: String,

            default: ""

        },

        // =====================================================
        // STATUT DE LA DEMANDE
        // =====================================================

        status: {

            type: String,

            enum: [

                "pending",

                "approved",

                "rejected"

            ],

            default: "pending"

        },

        // =====================================================
        // COMMENTAIRE DE L'ADMINISTRATEUR
        // =====================================================

        adminComment: {

            type: String,

            default: ""

        },

        // =====================================================
        // DATE DE VALIDATION
        // =====================================================

        approvedAt: {

            type: Date

        },

        // =====================================================
        // ADMIN QUI A TRAITE LA DEMANDE
        // =====================================================

        approvedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User"

        }

    },

    {

        timestamps: true

    }

);

// =====================================================
// EXPORT DU MODELE
// =====================================================

export default mongoose.model(

    "ConferenceRequest",

    conferenceRequestSchema

);