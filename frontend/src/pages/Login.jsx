import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import API from "../services/api"

function Login() {

  // =========================
  // NAVIGATION
  // =========================
  const navigate = useNavigate()

  // =========================
  // STATE FORMULAIRE
  // =========================
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // =========================
  // GESTION INPUTS
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      // Envoi backend
      const res = await API.post(
        "/auth/login",
        formData
      )

      console.log(res.data)

      // =========================
      // SAUVEGARDE TOKEN
      // =========================
      localStorage.setItem(
        "token",
        res.data.token
      )

      // =========================
      // SAUVEGARDE USER
      // =========================
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      alert("Connexion réussie")

      // =========================
      // REDIRECTION SELON ROLE
      // =========================
      const role = res.data.user.role

      if (role === "admin") {

        navigate("/admin-dashboard")

      } else if (role === "teacher") {

        navigate("/teacher-dashboard")

      } else {

        navigate("/student-dashboard")

      }

    } catch (error) {

      console.log(error)

      if (error.response?.data?.message) {

        alert(error.response.data.message)

      } else {

        alert("Erreur connexion")

      }

    }

  }

  return (

    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* TITRE */}
        <h1 className="text-5xl font-bold text-center">
          SALAM <span className="text-purple-600">CI</span>
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Plateforme de formation en ligne
        </p>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* EMAIL */}
          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block mb-2 font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

          {/* BOUTON */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold"
          >
            Se connecter
          </button>

        </form>

        {/* REGISTER */}
        <p className="text-center mt-6 text-gray-500">

          Pas encore de compte ?

          <Link
            to="/register"
            className="text-purple-600 font-semibold ml-2"
          >
            S'inscrire
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login