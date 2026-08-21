import jwt from "jsonwebtoken"
import User from "../models/User.js"

// =========================
// MIDDLEWARE AUTHENTIFICATION
// =========================
const authMiddleware = async (req, res, next) => {

  try {

    // =========================
    // RÉCUPÉRATION DU HEADER
    // =========================
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res.status(401).json({

        message: "Accès refusé. Token manquant."

      })

    }

    // =========================
    // EXTRACTION TOKEN
    // =========================
    const token = authHeader.split(" ")[1]

    if (!token) {

      return res.status(401).json({

        message: "Token manquant."

      })

    }

    // =========================
    // VÉRIFICATION JWT
    // =========================
    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    )

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(decoded.id)

    if (!user) {

      return res.status(401).json({

        message: "Utilisateur introuvable."

      })

    }

    // =========================
    // COMPTE ACTIF
    // =========================
    if (user.isActive === false) {

      return res.status(403).json({

        message: "Votre compte est désactivé."

      })

    }

    // =========================
    // VERSION SESSION
    // =========================
    if (

      decoded.sessionVersion !== user.sessionVersion

    ) {

      return res.status(401).json({

        code: "SESSION_INVALIDATED",

        message:
          "Votre session a expiré. Veuillez vous reconnecter."

      })

    }

    // =========================
    // UTILISATEUR CONNECTÉ
    // =========================
    req.user = user

    next()

  }

  catch (error) {

    console.error(
      "❌ Erreur authentification :",
      error.message
    )

    return res.status(401).json({

      message: "Token invalide ou expiré."

    })

  }

}

export default authMiddleware