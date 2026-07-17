import mongoose from "mongoose"

// =========================
// CONFERENCE SCHEMA
// =========================
const conferenceSchema = new mongoose.Schema(

{

    // =========================
    // TITRE
    // =========================
    title:{

        type:String,

        required:true,

        trim:true

    },

    // =========================
    // DESCRIPTION
    // =========================
    description:{

        type:String,

        required:true

    },

    // =========================
    // IMAGE
    // =========================
    thumbnail:{

        type:String,

        default:""

    },

    // =========================
    // LIEN VISIO
    // =========================
    meetingLink:{

        type:String,

        required:true

    },

    // =========================
    // DATE
    // =========================
    conferenceDate:{

        type:Date,

        required:true

    },

    // =========================
    // ENSEIGNANT
    // =========================
    teacher:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    // =========================
    // STATUT
    // =========================
    status:{

        type:String,

        enum:[
            "En attente",
            "Publié",
            "Suspendu",
            "Terminée"
        ],

        default:"En attente"

    },

    // =========================
    // ACTIVE
    // =========================
    isActive:{

        type:Boolean,

        default:true

    },

    // =========================
    // PARTICIPANTS
    // =========================
    participantsCount:{

        type:Number,

        default:0

    },

    // =========================
    // DATE PUBLICATION
    // =========================
    publishedAt:{

        type:Date,

        default:null

    }

},

{

    timestamps:true

}

)

export default mongoose.model(
    "Conference",
    conferenceSchema
)