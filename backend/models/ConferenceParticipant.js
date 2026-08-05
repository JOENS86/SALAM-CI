import mongoose from "mongoose";

// =====================================================
// MODELE : PARTICIPANT D'UNE CONFERENCE
// =====================================================

const conferenceParticipantSchema = new mongoose.Schema(

    {

        // =====================================================
        // CONFERENCE
        // =====================================================

        conference: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Conference",

            required: true

        },

        // =====================================================
        // ETUDIANT
        // =====================================================

        student: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // HEURE D'ENTREE
        // =====================================================

        joinedAt: {

            type: Date

        },

        // =====================================================
        // HEURE DE SORTIE
        // =====================================================

        leftAt: {

            type: Date

        },

        // =====================================================
        // TEMPS PASSE DANS LA CONFERENCE (minutes)
        // =====================================================

        attendanceDuration: {

            type: Number,

            default: 0

        },

        // =====================================================
        // PRESENCE
        // =====================================================

        attended: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // MICRO ACTIVE
        // =====================================================

        microphoneEnabled: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // CAMERA ACTIVE
        // =====================================================

        cameraEnabled: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // MAIN LEVEE
        // =====================================================

        handRaised: {

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

    "ConferenceParticipant",

    conferenceParticipantSchema

);