import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {

  try {

    // =========================
    // RÉCUPÉRATION DES DONNÉES
    // =========================
    const {
      name,
      email,
      password,
      role
    } = req.body

    // =========================
    // VÉRIFICATION EMAIL
    // =========================
    const existingUser = await User.findOne({ email })

    if (existingUser) {

      return res.status(400).json({
        message: "Utilisateur existe déjà"
      })

    }

    // =========================
    // HASH DU MOT DE PASSE
    // =========================
    const hashedPassword = await bcrypt.hash(password, 10)

    // =========================
    // CRÉATION UTILISATEUR
    // =========================
    const user = await User.create({

      name,
      email,
      password: hashedPassword,
      role

    })

// =========================
// CRÉATION TOKEN JWT
// =========================
const token = jwt.sign(

  {
    id: user._id,
    role: user.role,
    // Version actuelle de la session
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
    res.status(201).json({

      token,
      user

    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({

      message: error.message

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