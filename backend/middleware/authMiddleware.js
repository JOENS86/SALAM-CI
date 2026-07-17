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

    // Vérifie si le token existe
    if (!authHeader) {

      return res.status(401).json({

        message: "Accès refusé"

      })

    }

    // =========================
    // EXTRACTION DU TOKEN
    // Format :
    // Bearer TOKEN
    // =========================
    const token = authHeader.split(" ")[1]

    // =========================
    // DÉCODAGE JWT
    // =========================
    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    )

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(decoded.id)

    // Vérifie si l'utilisateur existe
    if (!user) {

      return res.status(401).json({

        message: "Utilisateur introuvable"

      })

    }

    // =========================
    // VÉRIFICATION VERSION SESSION
    // =========================
    if (

      decoded.sessionVersion !== user.sessionVersion

    ) {

      return res.status(401).json({

        code: "ROLE_CHANGED",

        message:
          "Votre rôle a été modifié. Veuillez vous reconnecter."

      })

    }

    // =========================
    // UTILISATEUR DISPONIBLE
    // POUR LES AUTRES ROUTES
    // =========================
    req.user = user

    next()

  }

  catch (error) {

    return res.status(401).json({

      message: "Token invalide"

    })

  }

}

export default authMiddleware