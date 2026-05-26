import jwt from "jsonwebtoken"

// =========================
// MIDDLEWARE AUTH
// =========================
const authMiddleware = (req, res, next) => {

  try {

    // Récupération token
    const authHeader = req.headers.authorization

    // Vérification token
    if (!authHeader) {

      return res.status(401).json({
        message: "Accès refusé"
      })

    }

    // Format :
    // Bearer TOKEN
    const token = authHeader.split(" ")[1]

    // Vérification JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Sauvegarde user décodé
    req.user = decoded

    // Passe à la suite
    next()

  } catch (error) {

    return res.status(401).json({
      message: "Token invalide"
    })

  }

}

export default authMiddleware