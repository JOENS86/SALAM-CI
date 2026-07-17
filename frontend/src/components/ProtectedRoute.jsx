import { Navigate } from "react-router-dom"

// =========================
// PROTECTED ROUTE
// Vérifie si l'utilisateur est connecté
// =========================
function ProtectedRoute({ children }) {

  // =========================
  // RÉCUPÉRATION DES DONNÉES
  // =========================
  const token = localStorage.getItem("token")

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  // =========================
  // PAS CONNECTÉ
  // =========================
  if (!token || !user) {

    return <Navigate to="/login" replace />

  }

  // =========================
  // ADMIN
  // =========================
  if (
    window.location.pathname.startsWith("/admin") &&
    user.role !== "admin"
  ) {

    return <Navigate to="/login" replace />

  }

  // =========================
  // ENSEIGNANT
  // =========================
  if (
    window.location.pathname.startsWith("/teacher") &&
    user.role !== "teacher"
  ) {

    return <Navigate to="/login" replace />

  }

  // =========================
  // ÉTUDIANT
  // =========================
  if (
    window.location.pathname.startsWith("/student") &&
    user.role !== "student"
  ) {

    return <Navigate to="/login" replace />

  }

  // =========================
  // AUTORISÉ
  // =========================
  return children

}

export default ProtectedRoute