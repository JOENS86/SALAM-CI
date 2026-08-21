import Settings from "../models/Settings.js";

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