import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"

import {
  FaArrowLeft,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa"

import API from "../../services/api"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function ResetPassword() {

  const navigate = useNavigate()

  const { token } = useParams()

  const [password, setPassword] = useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)


  const handleSubmit = async (e) => {

    e.preventDefault()

    // =========================
    // VÉRIFICATION MOT DE PASSE
    // =========================

    if (password.length < 6) {

      errorToast(
        "Mot de passe invalide",
        "Le mot de passe doit contenir au moins 6 caractères."
      )

      return

    }


    if (password !== confirmPassword) {

      errorToast(
        "Confirmation incorrecte",
        "Les deux mots de passe ne correspondent pas."
      )

      return

    }


    try {

      setLoading(true)

      const res = await API.post(

        `/auth/reset-password/${token}`,

        {
          password
        }

      )


      successToast(

        "Mot de passe modifié",

        res.data.message

      )


      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true
          }
        )

      }, 1500)

    }

    catch (error) {

      console.log(error)

      errorToast(

        "Réinitialisation impossible",

        error.response?.data?.message ||
        "Le lien est invalide ou expiré."

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

        Connexion

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

          <FaLock />

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

          Nouveau mot de passe

        </h1>


        <p
          className="
          text-center
          text-gray-500
          mt-4
          leading-7
          "
        >

          Choisissez un nouveau mot de passe
          sécurisé pour votre compte SALAM CI.

        </p>


        {/* =========================
            FORMULAIRE
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* =========================
              NOUVEAU MOT DE PASSE
          ========================== */}

          <div>

            <label
              className="
              block
              mb-2
              font-medium
              "
            >

              Nouveau mot de passe

            </label>


            <div className="relative">

              <input

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                placeholder="********"

                autoComplete="new-password"

                required

                className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                pr-12
                outline-none
                focus:border-purple-500
                "

              />


              <button

                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-500
                "

              >

                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </button>

            </div>

          </div>


          {/* =========================
              CONFIRMATION
          ========================== */}

          <div>

            <label
              className="
              block
              mb-2
              font-medium
              "
            >

              Confirmer le mot de passe

            </label>


            <div className="relative">

              <input

                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }

                value={confirmPassword}

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                placeholder="********"

                autoComplete="new-password"

                required

                className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                pr-12
                outline-none
                focus:border-purple-500
                "

              />


              <button

                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-500
                "

              >

                {showConfirmPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </button>

            </div>

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
              ? "Modification en cours..."
              : "Modifier mon mot de passe"
            }

          </button>

        </form>


        {/* =========================
            CONNEXION
        ========================== */}

        <p
          className="
          text-center
          mt-6
          text-gray-500
          "
        >

          <Link
            to="/login"
            className="
            text-purple-600
            font-semibold
            "
          >

            Retour à la connexion

          </Link>

        </p>

      </div>

    </div>

  )

}

export default ResetPassword