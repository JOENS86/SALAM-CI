// =========================
// MIDDLEWARE ADMINISTRATEUR
// =========================
const adminMiddleware = (req, res, next) => {

    // =========================
    // VÉRIFICATION UTILISATEUR
    // =========================
    if (!req.user) {
  
      return res.status(401).json({
  
        message: "Utilisateur non authentifié."
  
      })
  
    }
  
    // =========================
    // VÉRIFICATION RÔLE ADMIN
    // =========================
    if (req.user.role !== "admin") {
  
      return res.status(403).json({
  
        message:
          "Accès refusé. Cette action est réservée aux administrateurs."
  
      })
  
    }
  
    next()
  
  }
  
  export default adminMiddleware