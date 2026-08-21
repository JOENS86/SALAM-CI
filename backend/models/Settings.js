import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "SALAM CI",
      trim: true
    },

    email: {
      type: String,
      default: "",
      trim: true
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },

    address: {
      type: String,
      default: "",
      trim: true
    },

    description: {
      type: String,
      default:
        "Plateforme de formation en ligne permettant aux enseignants et aux étudiants de partager et suivre des contenus pédagogiques."
    },

    notifications: {
      newUser: {
        type: Boolean,
        default: true
      },

      newTeacher: {
        type: Boolean,
        default: true
      },

      newCourse: {
        type: Boolean,
        default: true
      },

      conferenceRequest: {
        type: Boolean,
        default: true
      },

      email: {
        type: Boolean,
        default: true
      }
    },

    appearance: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "light"
      },

      animations: {
        type: Boolean,
        default: true
      }
    },

    maintenance: {
      enabled: {
        type: Boolean,
        default: false
      },

      message: {
        type: String,
        default:
          "La plateforme est actuellement en maintenance. Merci de revenir plus tard."
      }
    }
  },
  {
    timestamps: true
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;