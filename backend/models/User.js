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
    // Permet d'invalider tous les
    // anciens tokens lorsque
    // le rôle est modifié.
    // =========================
    sessionVersion: {

      type: Number,

      default: 0

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
    // secret dans les requêtes MongoDB.
    // Il faudra utiliser :
    // .select("+twoFactorSecret")
    // lorsque le backend en a besoin.
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