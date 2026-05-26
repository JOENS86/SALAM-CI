import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

  // Vérifie token
  const token = localStorage.getItem("token")

  // Si pas connecté
  if (!token) {

    return <Navigate to="/login" />

  }

  // Sinon accès autorisé
  return children

}

export default ProtectedRoute