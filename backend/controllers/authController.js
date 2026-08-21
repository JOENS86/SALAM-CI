import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

// =====================================================
// REGISTER
// =====================================================

export const register = async (req, res) => {

  try {

    // =================================================
    // RÉCUPÉRATION DES DONNÉES
    // =================================================

    const {
      name,
      email,
      password,
      role
    } = req.body


    // =================================================
    // NETTOYAGE
    // =================================================

    const cleanName =
      name?.trim()

    const cleanEmail =
      email?.trim().toLowerCase()


    // =================================================
    // VALIDATION NOM
    // =================================================

    if (!cleanName) {

      return res.status(400).json({

        message:
          "Le nom complet est obligatoire."

      })

    }


    // =================================================
    // VALIDATION EMAIL
    // =================================================

    if (!cleanEmail) {

      return res.status(400).json({

        message:
          "L'adresse email est obligatoire."

      })

    }


    // =================================================
    // VALIDATION MOT DE PASSE
    // =================================================

    if (!password) {

      return res.status(400).json({

        message:
          "Le mot de passe est obligatoire."

      })

    }


    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Le mot de passe doit contenir au moins 6 caractères."

      })

    }


    // =================================================
    // VALIDATION DU RÔLE
    // =================================================
    //
    // IMPORTANT :
    // Un utilisateur public ne peut PAS
    // créer un compte administrateur.
    // =================================================

    if (
      role !== "student" &&
      role !== "teacher"
    ) {

      return res.status(400).json({

        message:
          "Type de compte invalide."

      })

    }


    // =================================================
    // VÉRIFICATION EMAIL EXISTANT
    // =================================================

    const existingUser =
      await User.findOne({
        email: cleanEmail
      })


    if (existingUser) {

      return res.status(400).json({

        message:
          "Un utilisateur avec cette adresse email existe déjà."

      })

    }


    // =================================================
    // HASH MOT DE PASSE
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )


    // =================================================
    // CRÉATION UTILISATEUR
    // =================================================

    const user =
      await User.create({

        name:
          cleanName,

        email:
          cleanEmail,

        password:
          hashedPassword,

        role:
          role

      })


    // =================================================
    // UTILISATEUR SÉCURISÉ
    // =================================================
    //
    // Ne jamais renvoyer le mot de passe
    // ni le secret 2FA.
    // =================================================

    const safeUser =
      user.toObject()


    delete safeUser.password

    delete safeUser.twoFactorSecret


    // =================================================
    // RÉPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message:
        "Compte créé avec succès.",

      user:
        safeUser

    })

  }


  catch (error) {

    console.error(
      "ERREUR INSCRIPTION :",
      error
    )


    // =================================================
    // EMAIL DUPLIQUÉ
    // =================================================

    if (
      error.code === 11000
    ) {

      return res.status(400).json({

        message:
          "Cette adresse email est déjà utilisée."

      })

    }


    // =================================================
    // ERREUR GÉNÉRALE
    // =================================================

    return res.status(500).json({

      message:
        "Impossible de créer le compte."

    })

  }

}


// =========================
// LOGIN
// =========================
export const login = async (req, res) => {

  try {

    console.log("================================")
    console.log("LOGIN DEMANDÉ")
    console.log("================================")

    // =========================
    // DONNÉES DU FORMULAIRE
    // =========================
    const {
      email,
      password
    } = req.body

    console.log("Email reçu :", email)

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findOne({ email })

    if (!user) {

      console.log("Utilisateur introuvable")

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    console.log("Utilisateur trouvé :", user.email)

    // =========================
    // VÉRIFICATION MOT DE PASSE
    // =========================
    const isMatch = await bcrypt.compare(

      password,
      user.password

    )

    if (!isMatch) {

      console.log("Mot de passe incorrect")

      return res.status(400).json({

        message: "Mot de passe incorrect"

      })

    }

    console.log("Mot de passe correct")

    // =========================
    // VÉRIFICATION 2FA
    // =========================
    if (user.twoFactorEnabled) {

      return res.status(200).json({

        requiresTwoFactor: true,

        userId: user._id

      })

    }

    // =========================
    // MISE À JOUR DU STATUT
    // =========================
    user.isOnline = true

    console.log("Avant save :", user.isOnline)

    await user.save()

    console.log("Après save :", user.isOnline)

    // =========================
    // VÉRIFICATION MONGODB
    // =========================
    const verification = await User.findById(user._id)

    console.log("Document MongoDB :")
    console.log(verification)


// =========================
// CRÉATION TOKEN JWT
// =========================
const token = jwt.sign(

  {
    id: user._id,
    role: user.role,
    // Version de session actuelle
    sessionVersion: user.sessionVersion
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"

  }
)


    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      token,
      user

    })

  }

  catch (error) {

    console.log("ERREUR LOGIN")
    console.log(error)

    res.status(500).json({

      message: error.message

    })

  }
  
}

// =====================================================
// CONFIGURATION 2FA
// =====================================================
export const setupTwoFactor = async (req, res) => {

  try {

    const user = await User
    .findById(req.user._id)
    .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    if (user.twoFactorEnabled) {

      return res.status(400).json({

        message: "L'authentification à deux facteurs est déjà activée."

      })

    }

    // =========================
    // GÉNÉRATION SECRET
    // =========================
    const secret = speakeasy.generateSecret({

      name: `SALAM CI:${user.email}`,

      issuer: "SALAM CI",

      length: 20

    })

    // =========================
    // SAUVEGARDE SECRET
    // =========================
    user.twoFactorSecret = secret.base32

    await user.save()

    // =========================
    // QR CODE
    // =========================
    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url
    )

    res.status(200).json({

      success: true,

      qrCode,

      secret: secret.base32

    })

  }

  catch (error) {

    console.error(
      "ERREUR CONFIGURATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible de configurer le 2FA."

    })

  }

}


// =====================================================
// VALIDATION ACTIVATION 2FA
// =====================================================
export const verifyTwoFactorSetup = async (req, res) => {

  try {

    const {
      token
    } = req.body

    const user = await User
      .findById(req.user._id)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    if (!user.twoFactorSecret) {

      return res.status(400).json({

        message: "La configuration 2FA n'a pas été commencée."

      })

    }

    const verified = speakeasy.totp.verify({

      secret: user.twoFactorSecret,

      encoding: "base32",

      token,

      window: 1

    })

    if (!verified) {

      return res.status(400).json({

        message: "Code 2FA incorrect."

      })

    }

    user.twoFactorEnabled = true

    await user.save()

    res.status(200).json({

      success: true,

      message:
        "Authentification à deux facteurs activée avec succès."

    })

  }

  catch (error) {

    console.error(
      "ERREUR VALIDATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible d'activer le 2FA."

    })

  }

}


// =====================================================
// DÉSACTIVER 2FA
// =====================================================

export const disableTwoFactor = async (req, res) => {

  try {

    const {
      password
    } = req.body

    const user = await User
      .findById(req.user._id)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    const isMatch = await bcrypt.compare(

      password,

      user.password

    )

    if (!isMatch) {

      return res.status(400).json({

        message: "Mot de passe incorrect."

      })

    }

    user.twoFactorEnabled = false

    user.twoFactorSecret = null

    await user.save()

    res.status(200).json({

      success: true,

      message:
        "Authentification à deux facteurs désactivée."

    })

  }

  catch (error) {

    console.error(
      "ERREUR DÉSACTIVATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible de désactiver le 2FA."

    })

  }

}

// =====================================================
// LOGIN AVEC CODE 2FA
// =====================================================
export const verifyTwoFactorLogin = async (req, res) => {

  try {

    const {
      userId,
      token
    } = req.body

    const user = await User
      .findById(userId)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    if (!user.twoFactorEnabled) {

      return res.status(400).json({

        message: "Le 2FA n'est pas activé."

      })

    }

    const verified = speakeasy.totp.verify({

      secret: user.twoFactorSecret,

      encoding: "base32",

      token,

      window: 1

    })

    if (!verified) {

      return res.status(400).json({

        message: "Code de vérification incorrect."

      })

    }

    // =========================
    // UTILISATEUR EN LIGNE
    // =========================

    user.isOnline = true

    await user.save()

    // =========================
    // JWT FINAL
    // =========================

    const jwtToken = jwt.sign(

      {

        id: user._id,

        role: user.role,

        sessionVersion:
          user.sessionVersion

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    )

    const safeUser = user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret
    
    res.status(200).json({
    
      token: jwtToken,
    
      user: safeUser
    
    })

  }

  catch (error) {

    console.error(
      "ERREUR LOGIN 2FA :",
      error
    )

    res.status(500).json({

      message: "Vérification 2FA impossible."

    })

  }

}