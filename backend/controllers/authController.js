import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body

    // Vérifie si utilisateur existe déjà
    const existingUser = await User.findOne({ email })

    if (existingUser) {

      return res.status(400).json({
        message: "Utilisateur existe déjà"
      })

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    // Création token JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    // Réponse
    res.status(201).json({
      token,
      user
    })

  } catch (error) {

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

    const {
      email,
      password
    } = req.body

    // Recherche utilisateur
    const user = await User.findOne({ email })

    if (!user) {

      return res.status(404).json({
        message: "Utilisateur introuvable"
      })

    }

    // Vérification mot de passe
    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {

      return res.status(400).json({
        message: "Mot de passe incorrect"
      })

    }

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    // Réponse
    res.status(200).json({
      token,
      user
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}