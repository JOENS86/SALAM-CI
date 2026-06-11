import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaLock, FaSignInAlt } from "react-icons/fa"
import API from "../../services/api"

function CommunityAccess() {

    const token = localStorage.getItem("token")

    if (token) {
      return <Navigate to="/community" />
    }

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await API.post(
        "/auth/login",
        formData
      )

      localStorage.setItem(
        "token",
        res.data.token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      navigate("/community")

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Erreur de connexion"
      )

    }

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center px-6">

      {/* ICONE */}

      <div
        className="
        w-24
        h-24
        rounded-full
        bg-green-100
        flex
        items-center
        justify-center
        mb-8
        "
      >
        <FaLock className="text-4xl text-green-600" />
      </div>

      {/* TITRE */}

      <h1 className="text-4xl font-bold text-center">
        Accès réservé aux membres
      </h1>

      <p className="text-gray-500 text-center mt-4 max-w-xl">
        Connectez-vous pour accéder à la Communauté Active
        SALAM CI et rejoindre les échanges entre
        étudiants et enseignants.
      </p>

      {/* CARD LOGIN */}

      <div
        className="
        bg-white
        w-full
        max-w-md
        mt-10
        rounded-3xl
        shadow-xl
        p-8
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <div
            className="
            w-10
            h-10
            bg-green-100
            rounded-xl
            flex
            items-center
            justify-center
            "
          >
            <FaSignInAlt className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold">
            Connexion
          </h2>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="text-sm text-gray-500">
              Adresse email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              className="
              w-full
              mt-2
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-green-500
              "
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Mot de passe
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="
              w-full
              mt-2
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-green-500
              "
            />

          </div>

          <button
            type="submit"
            className="
            w-full
            bg-green-600
            hover:bg-green-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >
            Se connecter
          </button>

        </form>

        <div className="border-t mt-6 pt-6">

          <p className="text-center text-gray-400 text-sm mb-4">
            Connexion rapide (démo)
          </p>

          <div className="space-y-3">

            <div className="bg-gray-100 rounded-xl p-3">
              👨‍🎓 Étudiant SALAM
            </div>

            <div className="bg-gray-100 rounded-xl p-3">
              👨‍🏫 Enseignant SALAM
            </div>

            <div className="bg-gray-100 rounded-xl p-3">
              👨‍💼 Administrateur SALAM
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default CommunityAccess