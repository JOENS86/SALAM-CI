import mongoose from "mongoose";

// =====================================================
// MODELE : CONFERENCE
// =====================================================

const conferenceSchema = new mongoose.Schema(

    {

        // =====================================================
        // DEMANDE D'ORIGINE
        // =====================================================

        request: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "ConferenceRequest",

            required: true

        },

        // =====================================================
        // ADMIN VALIDATEUR
        // =====================================================

        approvedBy: {

           type: mongoose.Schema.Types.ObjectId,

           ref: "User",

           default: null

        },
        
// =====================================================
// ENSEIGNANT AYANT LANCE LA CONFERENCE
// =====================================================

startedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null

},

// =====================================================
// ENSEIGNANT AYANT TERMINE LA CONFERENCE
// =====================================================

endedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null

},

        // =====================================================
        // MOTIF D'ANNULATION
        // =====================================================

        cancelReason: {

          type: String,

          default: ""

        },

        // =====================================================
        // ENSEIGNANT
        // =====================================================

        teacher: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =====================================================
        // SALLE VERROUILLEE
        // =====================================================

        isLocked: {

          type: Boolean,

          default: false

        },

        // =====================================================
        // CONFERENCE PUBLIQUE ?
        // =====================================================

        isPublic: {

          type: Boolean,

          default: false

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
       // ENREGISTREMENT VIDEO
       // =====================================================

        recordingUrl: {

            type: String,

            default: null,
        
            trim: true

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
        // DESCRIPTION
        // =====================================================

        description: {

            type: String,

            default: ""

        },

        // =====================================================
        // IMAGE
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
// DUREE REELLE (minutes)
// =====================================================

actualDuration: {

    type: Number,

    default: 0

},

        // =====================================================
        // DATE ET HEURE COMPLETE DE LA CONFERENCE
        // =====================================================

        scheduledAt: {

          type: Date,

          required: true

        },

        // =====================================================
        // DUREE (minutes)
        // =====================================================

        duration: {

            type: Number,

            default: 60

        },

        // =====================================================
        // SALLE (Jitsi / LiveKit / etc.)
        // =====================================================

        roomId: {

            type: String,

            unique: true,
        
            required: true,
        
            trim: true

        },

        // =====================================================
        // LIEN DE LA CONFERENCE
        // =====================================================

        meetingLink: {

            type: String,
        
            default: null,
        
            trim: true
        
        },

        // =====================================================
        // CODE DE LA CONFERENCE
        // =====================================================

        meetingCode: {

            type: String,

            unique: true,
        
            required: true,
        
            trim: true

        },

// =====================================================
// MOT DE PASSE DE LA CONFERENCE
// =====================================================

meetingPassword: {

    type: String,

    default: null,

    trim: true,

    select: false

},

// =====================================================
// PARTICIPANTS UNIQUES
// =====================================================

uniqueParticipants: {

    type: Number,

    default: 0

},

        // =====================================================
        // NOMBRE MAXIMUM DE PARTICIPANTS
        // =====================================================

        maxParticipants: {

            type: Number,

            default: 100

        },

        // =====================================================
        // NOMBRE ACTUEL DE PARTICIPANTS
        // =====================================================

        currentParticipants: {

            type: Number,

            default: 0,
        
            min: 0        

        },

        // =====================================================
        // TOTAL DES PARTICIPANTS
        // =====================================================

        totalParticipants: {

            type: Number,

            default: 0,
        
            min: 0

        },

        // =====================================================
        // NOMBRE DE MESSAGES
        // =====================================================

        messagesCount: {

            type: Number,

            default: 0,
        
            min: 0

        },

        // =====================================================
        // TAUX DE PRESENCE
        // =====================================================

        attendanceRate: {

            type: Number,

            default: 0,
        
            min: 0,
        
            max: 100

        },

        // =====================================================
        // LA CONFERENCE EST ACTIVE ?
        // =====================================================

        isActive: {

          type: Boolean,

          default: true

        },

        // =====================================================
        // ETAT DE LA CONFERENCE
        // =====================================================

        status: {

            type: String,

            enum: [

                "scheduled",

                "live",

                "completed",

                "cancelled"

            ],

            default: "scheduled"

        },

// =====================================================
// CHAT ACTIVE
// =====================================================
chatEnabled: {

    type: Boolean,

    default: true

},

// =====================================================
// CAMERA ACTIVE
// =====================================================

cameraEnabled: {

    type: Boolean,

    default: true

},

// =====================================================
// MICROPHONE ACTIVE
// =====================================================
microphoneEnabled: {

    type: Boolean,

    default: true

},

// =====================================================
// PARTAGE D'ECRAN ACTIF
// =====================================================

screenSharingEnabled: {

    type: Boolean,

    default: true

},

        // =====================================================
        // DEBUT REEL
        // =====================================================

        startedAt: Date,

        // =====================================================
        // FIN REELLE
        // =====================================================

        endedAt: Date

        },

    {

        timestamps: true

    }

);


        conferenceSchema.index({

            course: 1

        });

        conferenceSchema.index({

            status: 1

        });

        conferenceSchema.index({

            scheduledAt: 1
        
        });

        conferenceSchema.index({

            teacher: 1,
        
            scheduledAt: 1
        
        });

// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(

    "Conference",

    conferenceSchema

);