import mongoose from "mongoose";

// =====================================================
// MODELE : INSCRIPTION A UN COURS
// =====================================================

const enrollmentSchema = new mongoose.Schema(

    {

        // =====================================================
        // ETUDIANT
        // =====================================================

        student: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // COURS
        // =====================================================

        course: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Course",

            required: true

        },

        // =====================================================
        // DATE D'INSCRIPTION
        // =====================================================

        enrolledAt: {

            type: Date,

            default: Date.now

        },

        // =====================================================
        // PROGRESSION (%)
        // =====================================================

        progress: {

            type: Number,

            default: 0,

            min: 0,

            max: 100

        },

        // =====================================================
        // COURS TERMINE ?
        // =====================================================

        completed: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // CERTIFICAT OBTENU ?
        // =====================================================

        certificateIssued: {

            type: Boolean,

            default: false

        },

        // =====================================================
        // DATE DU CERTIFICAT
        // =====================================================

        certificateDate: {

            type: Date,

            default: null

        },

        // =====================================================
        // DERNIER ACCES
        // =====================================================

        lastAccess: {

            type: Date,

            default: Date.now

        },

        // =====================================================
        // TEMPS PASSE (minutes)
        // =====================================================

        totalWatchTime: {

            type: Number,

            default: 0

        },

        // =====================================================
        // STATUT
        // =====================================================

        status: {

            type: String,

            enum: [

                "active",

                "completed",

                "abandoned"

            ],

            default: "active"

        }

    },

    {

        timestamps: true

    }

);

// =====================================================
// UNE INSCRIPTION PAR ETUDIANT ET PAR COURS
// =====================================================

enrollmentSchema.index(

    {

        student: 1,

        course: 1

    },

    {

        unique: true

    }

);

// =====================================================
// INDEX
// =====================================================

enrollmentSchema.index({

    student: 1

});

enrollmentSchema.index({

    course: 1

});

enrollmentSchema.index({

    status: 1

});

// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(

    "Enrollment",

    enrollmentSchema

);
