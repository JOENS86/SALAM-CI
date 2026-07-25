import User from "../models/User.js"

// ======================================
// RÉCUPÉRER LES UTILISATEURS
// AVEC PAGINATION
// GET /api/users?page=1&limit=10
// ======================================
export const getUsers = async (req, res) => {

  try {

    // =========================
    // PARAMÈTRES DE PAGINATION
    // =========================
    const page = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    // =========================
    // CALCUL DU SKIP
    // =========================
    const skip = (page - 1) * limit

    // =========================
    // NOMBRE TOTAL
    // D'UTILISATEURS
    // =========================
    const totalUsers = await User.countDocuments()

    // =========================
    // NOMBRE TOTAL DE PAGES
    // =========================
    const totalPages = Math.ceil(

      totalUsers / limit

    )

    // =========================
    // UTILISATEURS DE LA PAGE
    // =========================
    const users = await User.find()

      .select("-password")

      .sort({

        createdAt: -1

      })

      .skip(skip)

      .limit(limit)

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      users,

      currentPage: page,

      totalPages,

      totalUsers,

      limit

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// RÉCUPÉRER LES ENSEIGNANTS
// GET /api/users/teachers
// ======================================
export const getTeachers = async (req, res) => {

  try {

    const teachers = await User.find({

      role: "teacher",

      isActive: true

    })

      .select("_id name")

      .sort({

        name: 1

      })

    res.status(200).json(teachers)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// RÉCUPÉRER LES STATISTIQUES
// GET /api/users/stats
// ======================================
export const getUserStats = async (req, res) => {

  try {

    const total = await User.countDocuments()

    const students = await User.countDocuments({

      role: "student"

    })

    const teachers = await User.countDocuments({

      role: "teacher"

    })

    const admins = await User.countDocuments({

      role: "admin"

    })

    res.status(200).json({

      total,
      students,
      teachers,
      admins

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// RÉCUPÉRER UN UTILISATEUR
// GET /api/users/:id
// ======================================
export const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)

      .select("-password")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    res.status(200).json(user)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// MODIFIER UN UTILISATEUR
// PUT /api/users/:id
// ======================================
export const updateUser = async (req, res) => {

  try {

    // =========================
    // ID UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // DONNÉES REÇUES
    // =========================
    const {

      name,
      email,
      role

    } = req.body

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    // =========================
    // VÉRIFICATION EMAIL
    // =========================
    const emailExists = await User.findOne({

      email,

      _id: { $ne: id }

    })

    if (emailExists) {

      return res.status(400).json({

        message: "Cet email est déjà utilisé."

      })

    }

    // =========================
    // ANCIEN RÔLE
    // =========================
    const oldRole = user.role

    // =========================
    // MISE À JOUR
    // =========================
    user.name = name

    user.email = email

    user.role = role

    // =========================
    // SI LE RÔLE CHANGE
    // =========================
    if (oldRole !== role) {

      // Déconnexion immédiate
      user.isOnline = false

      // Tous les anciens JWT deviennent invalides
      user.sessionVersion += 1

    }

    // =========================
    // SAUVEGARDE
    // =========================
    await user.save()

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      message: "Utilisateur modifié avec succès.",

      user

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// SUPPRIMER UN UTILISATEUR
// DELETE /api/users/:id
// ======================================
export const deleteUser = async (req, res) => {

  try {

    // =========================
    // ID DE L'UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    // =========================
    // UTILISATEUR INTROUVABLE
    // =========================
    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    // =========================
    // EMPÊCHER LA SUPPRESSION
    // DE SON PROPRE COMPTE
    // =========================
    if (req.user._id.toString() === id) {

      return res.status(400).json({

        message:
          "Vous ne pouvez pas supprimer votre propre compte."

      })

    }

    // =========================
    // SUPPRESSION
    // =========================
    await user.deleteOne()

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      message: "Utilisateur supprimé avec succès."

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// ACTIVER / DÉSACTIVER UN UTILISATEUR
// PATCH /api/users/:id/status
// ======================================
export const toggleUserStatus = async (req, res) => {

  try {

    // =========================
    // ID UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    // =========================
    // UTILISATEUR INTROUVABLE
    // =========================
    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    // =========================
    // EMPÊCHER L'ADMIN
    // DE SE DÉSACTIVER
    // =========================
    if (req.user._id.toString() === id) {

      return res.status(400).json({

        message:
          "Vous ne pouvez pas désactiver votre propre compte."

      })

    }

    // =========================
    // CHANGEMENT DU STATUT
    // =========================
    user.isActive = !user.isActive

    // =========================
    // SI LE COMPTE EST
    // DÉSACTIVÉ
    // =========================
    if (!user.isActive) {

      // Déconnexion immédiate
      user.isOnline = false

      // Tous les anciens tokens deviennent invalides
      user.sessionVersion += 1

    }

    // =========================
    // SAUVEGARDE
    // =========================
    await user.save()

    // =========================
    // MESSAGE
    // =========================
    const message =

      user.isActive

        ? "Utilisateur activé avec succès."

        : "Utilisateur désactivé avec succès."

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      message,

      user

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}