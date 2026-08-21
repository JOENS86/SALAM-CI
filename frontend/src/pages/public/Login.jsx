import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import API from "../../services/api"

import { FaArrowLeft } from "react-icons/fa"

import {
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaBookOpen,
  FaAward,
  FaVideo,
  FaShieldAlt
} from "react-icons/fa"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function Login() {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate()

  const location = useLocation()

  const params =
    new URLSearchParams(location.search)


  // =====================================================
  // CONTEXTE D'ACCÈS
  // =====================================================

  const isCommunity =
    params.get("community") === "true"

  const isCourses =
    params.get("courses") === "true"

  const isCertificates =
    params.get("certificates") === "true"

  const isConference =
    params.get("conference") === "true"


  const hideRegister =
    isCommunity ||
    isCourses ||
    isCertificates ||
    isConference


  let accessIcon = null

  let accessTitle = ""

  let accessDescription = ""


  if (isCommunity) {

    accessIcon =
      <FaUsers className="text-4xl text-purple-600" />

    accessTitle =
      "Accès réservé aux membres"

    accessDescription =
      "Connectez-vous pour accéder à la Communauté Active SALAM CI et rejoindre les échanges entre étudiants et enseignants."

  }

  else if (isCourses) {

    accessIcon =
      <FaBookOpen className="text-4xl text-purple-600" />

    accessTitle =
      "Accès aux formations"

    accessDescription =
      "Connectez-vous pour accéder à toutes les formations SALAM CI et poursuivre votre apprentissage."

  }

  else if (isCertificates) {

    accessIcon =
      <FaAward className="text-4xl text-purple-600" />

    accessTitle =
      "Accédez à vos certificats"

    accessDescription =
      "Connectez-vous pour consulter, télécharger et partager tous vos certificats obtenus sur SALAM CI."

  }

  else if (isConference) {

    accessIcon =
      <FaVideo className="text-4xl text-purple-600" />

    accessTitle =
      "Accès aux conférences"

    accessDescription =
      "Connectez-vous pour rejoindre les conférences en direct organisées sur SALAM CI."

  }


  // =====================================================
  // FORMULAIRE
  // =====================================================

  const [formData, setFormData] = useState({

    email:
      localStorage.getItem("registeredEmail") || "",

    password: ""

  })


  const [showPassword, setShowPassword] =
    useState(false)


  // =====================================================
  // ÉTAT CHARGEMENT
  // =====================================================

  const [loading, setLoading] =
    useState(false)


  // =====================================================
  // 2FA
  // =====================================================

  const [twoFactorRequired, setTwoFactorRequired] =
    useState(false)


  const [twoFactorUserId, setTwoFactorUserId] =
    useState(null)


  const [twoFactorCode, setTwoFactorCode] =
    useState("")


  const [verifyingTwoFactor, setVerifyingTwoFactor] =
    useState(false)


  // =====================================================
  // GESTION INPUTS
  // =====================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }


  // =====================================================
  // REDIRECTION APRÈS CONNEXION
  // =====================================================

  const redirectAfterLogin = (user) => {

    if (!user) {

      console.error(
        "❌ Utilisateur absent après connexion."
      )

      errorToast(
        "Erreur",
        "Les informations utilisateur sont introuvables."
      )

      return

    }


    // =================================================
    // ACCÈS SPÉCIFIQUES
    // =================================================

    if (params.get("courses") === "true") {

      navigate(
        "/courses",
        {
          replace: true
        }
      )

      return

    }


    if (params.get("conference") === "true") {

      navigate(
        "/conference-room",
        {
          replace: true
        }
      )

      return

    }


    if (params.get("community") === "true") {

      navigate(
        "/community",
        {
          replace: true
        }
      )

      return

    }


    if (params.get("certificates") === "true") {

      navigate(
        "/certificates",
        {
          replace: true
        }
      )

      return

    }


    // =================================================
    // REDIRECTION SELON LE RÔLE
    // =================================================

    const role = user.role


    if (role === "admin") {

      navigate(
        "/admin-dashboard",
        {
          replace: true
        }
      )

    }

    else if (role === "teacher") {

      navigate(
        "/teacher-dashboard",
        {
          replace: true
        }
      )

    }

    else {

      navigate(
        "/student-dashboard",
        {
          replace: true
        }
      )

    }

  }


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()


    if (loading) {

      return

    }


    try {

      setLoading(true)


      console.log(
        "🔐 Tentative de connexion :",
        formData.email
      )


      // =================================================
      // APPEL BACKEND
      // =================================================

      const res = await API.post(

        "/auth/login",

        formData

      )


      console.log(
        "🔐 Réponse login :",
        res.data
      )


      const data = res.data


      // =================================================
      // VÉRIFICATION 2FA
      // =================================================
      //
      // IMPORTANT :
      // Lorsque le 2FA est activé, le backend renvoie :
      //
      // {
      //   requiresTwoFactor: true,
      //   userId: "..."
      // }
      //
      // Il n'y a donc PAS encore de token/user.
      // =================================================

      if (data.requiresTwoFactor) {

        console.log(
          "🔐 Authentification 2FA requise."
        )


        setTwoFactorUserId(
          data.userId
        )


        setTwoFactorCode("")


        setTwoFactorRequired(true)


        setLoading(false)


        // TRÈS IMPORTANT
        // On arrête ici.
        return

      }


      // =================================================
      // VÉRIFICATION RÉPONSE NORMALE
      // =================================================

      if (!data.token || !data.user) {

        console.error(
          "❌ Réponse login invalide :",
          data
        )


        throw new Error(
          "Réponse de connexion invalide."
        )

      }


      // =================================================
      // SAUVEGARDE TOKEN
      // =================================================

      localStorage.setItem(

        "token",

        data.token

      )


      // =================================================
      // SAUVEGARDE UTILISATEUR
      // =================================================

      localStorage.setItem(

        "user",

        JSON.stringify(data.user)

      )


      // =================================================
      // EMAIL TEMPORAIRE
      // =================================================

      localStorage.removeItem(
        "registeredEmail"
      )


      // =================================================
      // TOAST
      // =================================================

      successToast(

        "Connexion réussie",

        "Bienvenue sur SALAM CI."

      )


      // =================================================
      // REDIRECTION
      // =================================================

      redirectAfterLogin(
        data.user
      )

    }


    catch (error) {

      console.error(
        "❌ Erreur connexion :",
        error
      )


      // Si le backend a retourné un message précis

      if (
        error.response?.data?.message
      ) {

        errorToast(
          "Connexion refusée",
          error.response.data.message
        )

      }

      else {

        errorToast(

          "Connexion refusée",

          "Email ou mot de passe incorrect."

        )

      }

    }


    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // VÉRIFICATION DU CODE 2FA
  // =====================================================

  const handleVerifyTwoFactor = async (e) => {

    e.preventDefault()


    if (verifyingTwoFactor) {

      return

    }


    // =================================================
    // VALIDATION CODE
    // =================================================

    if (
      !twoFactorCode ||
      twoFactorCode.length !== 6
    ) {

      errorToast(

        "Code invalide",

        "Veuillez saisir le code à 6 chiffres."

      )

      return

    }


    try {

      setVerifyingTwoFactor(true)


      console.log(
        "🔐 Vérification du code 2FA..."
      )


      // =================================================
      // APPEL BACKEND
      // =================================================

      const res = await API.post(

        "/auth/2fa/verify-login",

        {

          userId:
            twoFactorUserId,

          token:
            twoFactorCode

        }

      )


      console.log(
        "🔐 Réponse vérification 2FA :",
        res.data
      )


      const data = res.data


      // =================================================
      // VÉRIFICATION RÉPONSE
      // =================================================

      if (!data.token || !data.user) {

        throw new Error(
          "Réponse 2FA invalide."
        )

      }


      // =================================================
      // SAUVEGARDE TOKEN
      // =================================================

      localStorage.setItem(

        "token",

        data.token

      )


      // =================================================
      // SAUVEGARDE USER
      // =================================================

      localStorage.setItem(

        "user",

        JSON.stringify(data.user)

      )


      // =================================================
      // NETTOYAGE
      // =================================================

      localStorage.removeItem(
        "registeredEmail"
      )


      // =================================================
      // FERMER 2FA
      // =================================================

      setTwoFactorRequired(false)

      setTwoFactorUserId(null)

      setTwoFactorCode("")


      // =================================================
      // SUCCÈS
      // =================================================

      successToast(

        "Connexion réussie",

        "Bienvenue sur SALAM CI."

      )


      // =================================================
      // REDIRECTION
      // =================================================

      redirectAfterLogin(
        data.user
      )

    }


    catch (error) {

      console.error(
        "❌ Erreur vérification 2FA :",
        error
      )


      if (
        error.response?.data?.message
      ) {

        errorToast(

          "Code 2FA incorrect",

          error.response.data.message

        )

      }

      else {

        errorToast(

          "Erreur",

          "Impossible de vérifier le code 2FA."

        )

      }

    }


    finally {

      setVerifyingTwoFactor(false)

    }

  }


  // =====================================================
  // ANNULER LE 2FA
  // =====================================================

  const cancelTwoFactor = () => {

    setTwoFactorRequired(false)

    setTwoFactorUserId(null)

    setTwoFactorCode("")

  }


  // =====================================================
  // INTERFACE
  // =====================================================

  return (

    <div className="
      min-h-screen
      bg-[#eef2ff]
      flex
      items-center
      justify-center
      px-6
      relative
    ">


      {/* =================================================
          BOUTON ACCUEIL
      ================================================= */}

      <button

        type="button"

        onClick={() =>
          navigate("/")
        }

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

        Accueil

      </button>


      {/* =================================================
          CONTENEUR
      ================================================= */}

      <div

        className={`
          w-full
          flex
          items-center
          justify-center
          gap-24
          ${
            isCommunity ||
            isCourses ||
            isCertificates ||
            isConference
              ? "max-w-6xl"
              : "max-w-md"
          }
        `}

      >


        {/* =================================================
            DESCRIPTION CONTEXTE
        ================================================= */}

        {(
          isCommunity ||
          isCourses ||
          isCertificates ||
          isConference
        ) && (

          <div className="
            text-center
            max-w-md
          ">

            <div className="
              w-24
              h-24
              mx-auto
              rounded-full
              bg-purple-100
              flex
              items-center
              justify-center
              mb-6
            ">

              {accessIcon}

            </div>


            <h1 className="
              text-4xl
              font-bold
            ">

              {accessTitle}

            </h1>


            <p className="
              text-gray-500
              mt-4
              leading-8
            ">

              {accessDescription}

            </p>

          </div>

        )}


        {/* =================================================
            CARTE LOGIN
        ================================================= */}

        <div className="
          bg-white
          w-full
          max-w-md
          p-8
          rounded-2xl
          shadow-lg
        ">


          {/* =================================================
              TITRE
          ================================================= */}

          {!(
            isCommunity ||
            isCourses ||
            isCertificates ||
            isConference
          ) && (

            <>

              <h1 className="
                text-5xl
                font-bold
                text-center
              ">

                SALAM{" "}

                <span className="
                  text-purple-600
                ">

                  CI

                </span>

              </h1>


              <p className="
                text-center
                text-gray-500
                mt-3
              ">

                Plateforme de formation en ligne

              </p>

            </>

          )}


          {/* =================================================
              FORMULAIRE LOGIN
          ================================================= */}

          <form

            onSubmit={handleSubmit}

            className="
              mt-10
              space-y-6
            "

          >


            {/* EMAIL */}

            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Email

              </label>


              <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}

                placeholder="votre@email.com"

                required

                disabled={loading}

                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-purple-500
                  disabled:bg-gray-100
                "

              />

            </div>


            {/* MOT DE PASSE */}

            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Mot de passe

              </label>


              <div className="
                relative
              ">


                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  value={
                    formData.password
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="********"

                  required

                  disabled={loading}

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
                    disabled:bg-gray-100
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


            {/* BOUTON */}

            <button

              type="submit"

              disabled={loading}

              className="
                w-full
                bg-purple-600
                hover:bg-purple-700
                disabled:bg-purple-400
                transition
                text-white
                py-3
                rounded-xl
                font-semibold
              "

            >

              {loading

                ? "Connexion..."

                : "Se connecter"

              }

            </button>


          </form>


          {/* =================================================
              INSCRIPTION
          ================================================= */}
{!hideRegister && (

<div className="text-center mt-6">

  <p className="text-gray-500">

    Pas encore de compte ?

    <Link
      to="/register"
      className="text-purple-600 font-semibold ml-2"
    >
      S'inscrire
    </Link>

  </p>

  <Link
    to="/forgot-password"
    className="
      inline-block
      mt-4
      text-purple-600
      font-semibold
      hover:text-purple-800
      transition
    "
  >
    Mot de passe oublié ?
  </Link>

</div>

)}

        </div>

      </div>


      {/* =====================================================
          MODALE 2FA
      ===================================================== */}

      {twoFactorRequired && (

        <div className="
          fixed
          inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          px-6
        ">


          <div className="
            bg-white
            w-full
            max-w-md
            rounded-3xl
            shadow-2xl
            p-8
          ">


            {/* ICÔNE */}

            <div className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-purple-100
              flex
              items-center
              justify-center
              mb-5
            ">

              <FaShieldAlt className="
                text-3xl
                text-purple-600
              "/>

            </div>


            {/* TITRE */}

            <h2 className="
              text-2xl
              font-bold
              text-center
            ">

              Vérification en deux étapes

            </h2>


            <p className="
              text-center
              text-gray-500
              mt-3
              leading-6
            ">

              Ouvrez votre application
              d'authentification et saisissez
              le code à 6 chiffres affiché.

            </p>


            {/* FORMULAIRE 2FA */}

            <form

              onSubmit={
                handleVerifyTwoFactor
              }

              className="
                mt-7
                space-y-5
              "

            >


              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                  text-center
                ">

                  Code de sécurité

                </label>


                <input

                  type="text"

                  inputMode="numeric"

                  autoComplete="one-time-code"

                  maxLength={6}

                  value={
                    twoFactorCode
                  }

                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)

                    setTwoFactorCode(
                      value
                    )

                  }}

                  placeholder="000000"

                  autoFocus

                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    px-4
                    py-4
                    text-center
                    text-3xl
                    tracking-[0.5em]
                    font-bold
                    outline-none
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "

                />

              </div>


              {/* VALIDATION */}

              <button

                type="submit"

                disabled={
                  verifyingTwoFactor ||
                  twoFactorCode.length !== 6
                }

                className="
                  w-full
                  bg-purple-600
                  hover:bg-purple-700
                  disabled:bg-purple-300
                  text-white
                  py-3.5
                  rounded-2xl
                  font-semibold
                  transition
                "

              >

                {verifyingTwoFactor

                  ? "Vérification..."

                  : "Vérifier le code"

                }

              </button>


              {/* ANNULER */}

              <button

                type="button"

                onClick={
                  cancelTwoFactor
                }

                disabled={
                  verifyingTwoFactor
                }

                className="
                  w-full
                  text-gray-500
                  hover:text-gray-700
                  py-2
                  font-medium
                "

              >

                Retour à la connexion

              </button>


            </form>


          </div>

        </div>

      )}

    </div>

  )

}


export default Login