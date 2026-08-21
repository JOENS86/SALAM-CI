import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaShieldAlt
} from "react-icons/fa"

import API from "../../services/api"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function ForgotPassword() {

  const navigate = useNavigate()

  // =========================
  // MÉTHODE DE RÉCUPÉRATION
  // =========================
  const [method, setMethod] = useState(null)

  // =========================
  // EMAIL
  // =========================
  const [email, setEmail] = useState("")

  // =========================
  // TÉLÉPHONE
  // =========================
  const [phone, setPhone] = useState("")

  // =========================
  // CHARGEMENT
  // =========================
  const [loading, setLoading] = useState(false)


  // =====================================================
  // RÉCUPÉRATION PAR EMAIL
  // =====================================================

  const handleEmailSubmit = async (e) => {

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


  // =====================================================
  // RÉCUPÉRATION PAR TÉLÉPHONE
  // =====================================================

  const handlePhoneSubmit = async (e) => {

    e.preventDefault()

    if (!phone.trim()) {

      errorToast(
        "Téléphone requis",
        "Veuillez saisir votre numéro de téléphone."
      )

      return

    }

    /*
      =====================================================
      IMPORTANT

      Le système SMS n'est pas encore branché.

      On ne fait donc PAS encore de requête API ici.

      Cette partie sera connectée plus tard à notre
      système OTP SMS.

      Pour l'instant, on prépare uniquement l'interface.
      =====================================================
    */

    errorToast(
      "Service SMS",
      "La récupération par téléphone sera bientôt disponible."
    )

  }


  // =====================================================
  // RETOUR AU CHOIX
  // =====================================================

  const resetMethod = () => {

    setMethod(null)

    setEmail("")

    setPhone("")

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

          <FaShieldAlt />

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


        {/* =====================================================
            ÉTAPE 1 : CHOIX DE LA MÉTHODE
        ===================================================== */}

        {!method && (

          <>

            <p
              className="
              text-center
              text-gray-500
              mt-4
              leading-7
              "
            >

              Comment souhaitez-vous récupérer
              votre compte ?

            </p>


            <div className="grid grid-cols-2 gap-4 mt-8">

              {/* =========================
                  EMAIL
              ========================== */}

              <button

                type="button"

                onClick={() => setMethod("email")}

                className="
                border-2
                border-gray-200
                hover:border-purple-500
                hover:bg-purple-50
                rounded-2xl
                p-6
                transition-all
                group
                "

              >

                <div
                  className="
                  w-14
                  h-14
                  mx-auto
                  rounded-full
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  group-hover:scale-110
                  transition
                  "
                >

                  <FaEnvelope />

                </div>


                <h2
                  className="
                  font-bold
                  text-lg
                  mt-4
                  "
                >

                  Par e-mail

                </h2>


                <p
                  className="
                  text-gray-500
                  text-sm
                  mt-2
                  "
                >

                  Recevoir un lien sécurisé

                </p>

              </button>


              {/* =========================
                  TÉLÉPHONE
              ========================== */}

              <button

                type="button"

                onClick={() => setMethod("phone")}

                className="
                border-2
                border-gray-200
                hover:border-purple-500
                hover:bg-purple-50
                rounded-2xl
                p-6
                transition-all
                group
                "

              >

                <div
                  className="
                  w-14
                  h-14
                  mx-auto
                  rounded-full
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  group-hover:scale-110
                  transition
                  "
                >

                  <FaPhone />

                </div>


                <h2
                  className="
                  font-bold
                  text-lg
                  mt-4
                  "
                >

                  Par téléphone

                </h2>


                <p
                  className="
                  text-gray-500
                  text-sm
                  mt-2
                  "
                >

                  Recevoir un code SMS

                </p>

              </button>

            </div>

          </>

        )}


        {/* =====================================================
            ÉTAPE 2 : EMAIL
        ===================================================== */}

        {method === "email" && (

          <>

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


            <form
              onSubmit={handleEmailSubmit}
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


            <button

              type="button"

              onClick={resetMethod}

              className="
              w-full
              mt-4
              text-purple-600
              font-semibold
              hover:underline
              "

            >

              ← Choisir une autre méthode

            </button>

          </>

        )}


        {/* =====================================================
            ÉTAPE 2 : TÉLÉPHONE
        ===================================================== */}

        {method === "phone" && (

          <>

            <p
              className="
              text-center
              text-gray-500
              mt-4
              leading-7
              "
            >

              Entrez le numéro de téléphone associé
              à votre compte. Un code de vérification
              vous sera envoyé par SMS.

            </p>


            <form
              onSubmit={handlePhoneSubmit}
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

                  Numéro de téléphone

                </label>


                <input

                  type="tel"

                  value={phone}

                  onChange={(e) =>
                    setPhone(e.target.value)
                  }

                  placeholder="+225 07 00 00 00 00"

                  autoComplete="tel"

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

                Envoyer le code par SMS

              </button>

            </form>


            <button

              type="button"

              onClick={resetMethod}

              className="
              w-full
              mt-4
              text-purple-600
              font-semibold
              hover:underline
              "

            >

              ← Choisir une autre méthode

            </button>

          </>

        )}


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