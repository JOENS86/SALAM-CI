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
      required: true

    },

    // =========================
    // EMAIL
    // =========================
    email: {

      type: String,
      required: true,
      unique: true

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

    }

  },

  {

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

export default User