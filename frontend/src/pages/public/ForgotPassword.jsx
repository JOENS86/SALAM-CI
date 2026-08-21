import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaEnvelope } from "react-icons/fa"

import API from "../../services/api"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function ForgotPassword() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!email.trim()) {

      errorToast(
        "Email requis",
        "Veuillez saisir votre adresse email."
      )

      return

    }

    try {

      setLoading(true)

      const res = await API.post(
        "/auth/forgot-password",
        {
          email: email.trim().toLowerCase()
        }
      )

      successToast(
        "Demande envoyée",
        res.data.message
      )

      setEmail("")

    }

    catch (error) {

      console.log(error)

      errorToast(
        "Erreur",
        error.response?.data?.message ||
        "Impossible de traiter la demande."
      )

    }

    finally {

      setLoading(false)

    }

  }


  return (

    <div
      className="
      min-h-screen
      bg-[#eef2ff]
      flex
      items-center
      justify-center
      px-6
      relative
      "
    >

      {/* =========================
          RETOUR
      ========================== */}

      <button

        onClick={() => navigate("/login")}

        className="
        absolute
        top-8
        left-8
        bg-gradient-to-r
        from-purple-600
        to-indigo-600
        text-white
        px-5
        py-3
        rounded-2xl
        flex
        items-center
        gap-3
        shadow-lg
        hover:scale-105
        transition-all
        "

      >

        <FaArrowLeft />

        Retour

      </button>


      {/* =========================
          CARD
      ========================== */}

      <div
        className="
        bg-white
        w-full
        max-w-md
        p-8
        rounded-3xl
        shadow-lg
        "
      >

        {/* =========================
            ICÔNE
        ========================== */}

        <div
          className="
          w-20
          h-20
          mx-auto
          rounded-full
          bg-purple-100
          text-purple-600
          flex
          items-center
          justify-center
          text-3xl
          "
        >

          <FaEnvelope />

        </div>


        {/* =========================
            TITRE
        ========================== */}

        <h1
          className="
          text-4xl
          font-bold
          text-center
          mt-6
          "
        >

          Mot de passe oublié ?

        </h1>


        <p
          className="
          text-center
          text-gray-500
          mt-4
          leading-7
          "
        >

          Entrez votre adresse email.
          Nous vous enverrons un lien sécurisé
          pour réinitialiser votre mot de passe.

        </p>


        {/* =========================
            FORMULAIRE
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          <div>

            <label
              className="
              block
              mb-2
              font-medium
              "
            >

              Adresse email

            </label>


            <input

              type="email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              placeholder="votre@email.com"

              autoComplete="email"

              required

              className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-100
              "

            />

          </div>


          {/* =========================
              BOUTON
          ========================== */}

          <button

            type="submit"

            disabled={loading}

            className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            disabled:bg-purple-300
            transition
            text-white
            py-3
            rounded-xl
            font-semibold
            "

          >

            {loading
              ? "Envoi en cours..."
              : "Envoyer le lien de récupération"
            }

          </button>

        </form>


        {/* =========================
            RETOUR CONNEXION
        ========================== */}

        <p
          className="
          text-center
          mt-6
          text-gray-500
          "
        >

          Vous vous souvenez de votre mot de passe ?

          <Link
            to="/login"
            className="
            text-purple-600
            font-semibold
            ml-2
            "
          >

            Se connecter

          </Link>

        </p>

      </div>

    </div>

  )

}

export default ForgotPassword