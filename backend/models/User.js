import mongoose from "mongoose"

// =========================
// USER SCHEMA
// =========================
const userSchema = new mongoose.Schema(

  {

    // =========================
    // NOM COMPLET
    // =========================
    name: {

      type: String,

      required: true,

      trim: true

    },

    // =========================
    // EMAIL
    // =========================
    email: {

      type: String,

      required: true,

      unique: true,

      trim: true,

      lowercase: true

    },

    // =========================
    // NUMÉRO DE TÉLÉPHONE
    // =========================
    phone: {

      type: String,

      default: null,

      trim: true

    },

    // =========================
    // MOT DE PASSE
    // =========================
    password: {

      type: String,

      required: true

    },

    // =========================
    // RÔLE
    // =========================
    role: {

      type: String,

      enum: [

        "student",

        "teacher",

        "admin"

      ],

      default: "student"

    },

    // =========================
    // STATUT DE CONNEXION
    // =========================
    isOnline: {

      type: Boolean,

      default: false

    },

    // =========================
    // COMPTE ACTIF
    // =========================
    isActive: {

      type: Boolean,

      default: true

    },

    // =========================
    // VERSION DE SESSION
    // =========================
    // Permet d'invalider tous les
    // anciens tokens JWT.
    // =========================
    sessionVersion: {

      type: Number,

      default: 0

    },

    // =====================================================
    // RÉCUPÉRATION DU MOT DE PASSE PAR EMAIL
    // =====================================================

    resetPasswordToken: {

      type: String,

      default: null,

      select: false

    },

    resetPasswordExpires: {

      type: Date,

      default: null,

      select: false

    },

    // =====================================================
    // RÉCUPÉRATION DU MOT DE PASSE PAR TÉLÉPHONE
    // =====================================================

    resetPasswordCode: {

      type: String,

      default: null,

      select: false

    },

    resetPasswordCodeExpires: {

      type: Date,

      default: null,

      select: false

    },

    resetPasswordCodeAttempts: {

      type: Number,

      default: 0,

      select: false

    },

    // =========================
    // AUTHENTIFICATION 2 FACTEURS
    // =========================
    twoFactorEnabled: {

      type: Boolean,

      default: false

    },

    // =========================
    // SECRET 2FA
    // =========================
    // Secret utilisé par :
    // - Google Authenticator
    // - Microsoft Authenticator
    // - Authy
    //
    // select: false permet de ne pas
    // retourner automatiquement le
    // secret dans les requêtes.
    // =========================
    twoFactorSecret: {

      type: String,

      default: null,

      select: false

    }

  },

  {

    // =========================
    // CREATED AT
    // UPDATED AT
    // =========================
    timestamps: true

  }

)


// =========================
// MODEL
// =========================
const User = mongoose.model(

  "User",

  userSchema

)


// =========================
// EXPORT
// =========================
export default User