import { Link } from "react-router-dom"
import { useState } from "react"
import API from "../services/api"

function Register() {

  // =========================
  // STATE DU FORMULAIRE
  // =========================
  // Ici on stocke toutes les données du formulaire
  // dans un seul objet
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  })

  // =========================
  // GESTION DES CHAMPS INPUT
  // =========================
  // Cette fonction récupère automatiquement
  // la valeur de chaque input
  const handleChange = (e) => {

    setFormData({
      ...formData,

      // e.target.name = nom du champ
      // e.target.value = valeur tapée
      [e.target.name]: e.target.value
    })

  }

  // =========================
  // SOUMISSION FORMULAIRE
  // =========================
  const handleSubmit = async (e) => {

    // Empêche le rechargement de la page
    e.preventDefault()

    try {

      // Envoi des données vers le backend
      const res = await API.post(
        "/auth/register",
        formData
      )

      console.log(res.data)

      // Message succès
      alert("Compte créé avec succès")

      // Réinitialisation formulaire
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student"
      })

    } catch (error) {

      console.log(error)

      // Gestion erreur backend
      if (error.response?.data?.message) {

        alert(error.response.data.message)

      } else {

        alert("Erreur inscription")

      }

    }

  }

  return (

    // =========================
    // CONTAINER PRINCIPAL
    // =========================
    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center px-6">

      {/* CARD FORMULAIRE */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* TITRE */}
        <h1 className="text-5xl font-bold text-center">
          SALAM <span className="text-purple-600">CI</span>
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Créer un compte
        </p>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* NOM */}
          <div>

            <label className="block mb-2 font-medium">
              Nom complet
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

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

          {/* MOT DE PASSE */}
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

          {/* ROLE */}
          <div>

            <label className="block mb-2 font-medium">
              Type de compte
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            >

              {/* IMPORTANT :
                  Les values doivent correspondre
                  EXACTEMENT aux roles MongoDB
              */}

              <option value="student">
                Étudiant
              </option>

              <option value="teacher">
                Enseignant
              </option>

              <option value="admin">
                Administrateur
              </option>

            </select>

          </div>

          {/* BOUTON */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold"
          >
            S'inscrire
          </button>

        </form>

        {/* LIEN LOGIN */}
        <p className="text-center mt-6 text-gray-500">

          Déjà un compte ?

          <Link
            to="/login"
            className="text-purple-600 font-semibold ml-2"
          >
            Se connecter
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Register