import Settings from "../models/Settings.js";
import bcrypt from "bcryptjs"
import User from "../models/User.js"

// =====================================================
// RÉCUPÉRER LES PARAMÈTRES
// GET /api/settings
// =====================================================
export const getSettings = async (req, res) => {

  try {

    let settings = await Settings.findOne();

    // =====================================================
    // CRÉER LES PARAMÈTRES PAR DÉFAUT SI ABSENTS
    // =====================================================

    if (!settings) {

      settings = await Settings.create({});

    }

    res.status(200).json({

      success: true,

      settings

    });

  }

  catch (error) {

    console.error(
      "❌ Erreur récupération paramètres :",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Impossible de récupérer les paramètres.",

      error: error.message

    });

  }

};


// =====================================================
// MODIFIER LES PARAMÈTRES
// PUT /api/settings
// =====================================================
export const updateSettings = async (req, res) => {

  try {

    const {

      platformName,
      email,
      phone,
      address,
      description,

      notifications,

      appearance,

      maintenance

    } = req.body;


    // =====================================================
    // RECHERCHER LES PARAMÈTRES
    // =====================================================

    let settings = await Settings.findOne();


    // =====================================================
    // CRÉER SI ABSENTS
    // =====================================================

    if (!settings) {

      settings = new Settings();

    }


    // =====================================================
    // PARAMÈTRES GÉNÉRAUX
    // =====================================================

    if (platformName !== undefined) {

      settings.platformName = platformName;

    }

    if (email !== undefined) {

      settings.email = email;

    }

    if (phone !== undefined) {

      settings.phone = phone;

    }

    if (address !== undefined) {

      settings.address = address;

    }

    if (description !== undefined) {

      settings.description = description;

    }


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    if (notifications) {

      if (notifications.newUser !== undefined) {

        settings.notifications.newUser =
          notifications.newUser;

      }

      if (notifications.newTeacher !== undefined) {

        settings.notifications.newTeacher =
          notifications.newTeacher;

      }

      if (notifications.newCourse !== undefined) {

        settings.notifications.newCourse =
          notifications.newCourse;

      }

      if (notifications.conferenceRequest !== undefined) {

        settings.notifications.conferenceRequest =
          notifications.conferenceRequest;

      }

      if (notifications.email !== undefined) {

        settings.notifications.email =
          notifications.email;

      }

    }


    // =====================================================
    // APPARENCE
    // =====================================================

    if (appearance) {

      if (appearance.theme !== undefined) {

        settings.appearance.theme =
          appearance.theme;

      }

      if (appearance.animations !== undefined) {

        settings.appearance.animations =
          appearance.animations;

      }

    }


    // =====================================================
    // MAINTENANCE
    // =====================================================

    if (maintenance) {

      if (maintenance.enabled !== undefined) {

        settings.maintenance.enabled =
          maintenance.enabled;

      }

      if (maintenance.message !== undefined) {

        settings.maintenance.message =
          maintenance.message;

      }

    }


    // =====================================================
    // SAUVEGARDE
    // =====================================================

    await settings.save();


    // =====================================================
    // RÉPONSE
    // =====================================================

    res.status(200).json({

      success: true,

      message:
        "Paramètres enregistrés avec succès.",

      settings

    });

  }

  catch (error) {

    console.error(
      "❌ Erreur modification paramètres :",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Impossible d'enregistrer les paramètres.",

      error: error.message

    });

  }

};

// =====================================================
// CHANGER LE MOT DE PASSE ADMINISTRATEUR
// PUT /api/settings/change-password
// =====================================================
export const changeAdminPassword = async (req, res) => {

  try {

    // =====================================================
    // VÉRIFIER QUE L'UTILISATEUR EST ADMIN
    // =====================================================

    if (req.user.role !== "admin") {

      return res.status(403).json({

        success: false,

        message:
          "Accès réservé à l'administrateur."

      })

    }


    // =====================================================
    // RÉCUPÉRATION DES DONNÉES
    // =====================================================

    const {

      currentPassword,
      newPassword,
      confirmPassword

    } = req.body


    // =====================================================
    // CHAMPS OBLIGATOIRES
    // =====================================================

    if (

      !currentPassword ||
      !newPassword ||
      !confirmPassword

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Tous les champs de mot de passe sont obligatoires."

      })

    }


    // =====================================================
    // VÉRIFICATION CONFIRMATION
    // =====================================================

    if (newPassword !== confirmPassword) {

      return res.status(400).json({

        success: false,

        message:
          "Les nouveaux mots de passe ne correspondent pas."

      })

    }


    // =====================================================
    // LONGUEUR MINIMALE
    // =====================================================

    if (newPassword.length < 8) {

      return res.status(400).json({

        success: false,

        message:
          "Le nouveau mot de passe doit contenir au moins 8 caractères."

      })

    }


    // =====================================================
    // RÉCUPÉRER L'ADMIN
    // =====================================================

    const admin = await User.findById(req.user._id)

    if (!admin) {

      return res.status(404).json({

        success: false,

        message:
          "Administrateur introuvable."

      })

    }


    // =====================================================
    // VÉRIFICATION ANCIEN MOT DE PASSE
    // =====================================================

    const passwordIsCorrect = await bcrypt.compare(

      currentPassword,

      admin.password

    )


    if (!passwordIsCorrect) {

      return res.status(400).json({

        success: false,

        message:
          "Le mot de passe actuel est incorrect."

      })

    }


    // =====================================================
    // EMPÊCHER LE MÊME MOT DE PASSE
    // =====================================================

    const samePassword = await bcrypt.compare(

      newPassword,

      admin.password

    )


    if (samePassword) {

      return res.status(400).json({

        success: false,

        message:
          "Le nouveau mot de passe doit être différent de l'ancien."

      })

    }


    // =====================================================
    // HASH DU NOUVEAU MOT DE PASSE
    // =====================================================

    const hashedPassword = await bcrypt.hash(

      newPassword,

      10

    )


    // =====================================================
    // MISE À JOUR
    // =====================================================

    admin.password = hashedPassword

    // Invalide les anciennes sessions
    admin.sessionVersion += 1

    await admin.save()


    // =====================================================
    // RÉPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      requiresLogin: true,

      message:
        "Mot de passe modifié avec succès. Veuillez vous reconnecter."

    })

  }

  catch (error) {

    console.error(

      "❌ Erreur changement mot de passe :",

      error

    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible de modifier le mot de passe."

    })

  }

}