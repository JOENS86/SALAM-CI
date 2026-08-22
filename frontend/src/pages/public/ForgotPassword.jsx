import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaLock
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
  // ÉTAPES RÉCUPÉRATION TÉLÉPHONE
  // =========================
  const [phoneStep, setPhoneStep] = useState("phone")

  // =========================
  // CODE SMS
  // =========================
  const [phoneCode, setPhoneCode] = useState("")

  // =========================
  // TOKEN DE RÉINITIALISATION
  // =========================
  const [resetToken, setResetToken] = useState("")

  // =========================
  // NOUVEAU MOT DE PASSE
  // =========================
  const [newPassword, setNewPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

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
  // ENVOYER LE CODE SMS
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

    try {

      setLoading(true)

      const res = await API.post(
        "/auth/forgot-password-phone",
        {
          phone: phone.trim()
        }
      )

      successToast(
        "Code envoyé",
        res.data.message
      )

      // Passage à l'étape du code
      setPhoneStep("code")

    }

    catch (error) {

      console.log(error)

      errorToast(
        "Erreur",
        error.response?.data?.message ||
        "Impossible d'envoyer le code SMS."
      )

    }

    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // VÉRIFIER LE CODE SMS
  // =====================================================

  const handleVerifyPhoneCode = async (e) => {

    e.preventDefault()

    if (!phoneCode.trim()) {

      errorToast(
        "Code requis",
        "Veuillez saisir le code reçu par SMS."
      )

      return

    }

    try {

      setLoading(true)

      const res = await API.post(
        "/auth/verify-phone-reset",
        {
          phone: phone.trim(),
          code: phoneCode.trim()
        }
      )

      successToast(
        "Téléphone vérifié",
        res.data.message
      )

      // Récupération du token temporaire
      setResetToken(res.data.resetToken)

      // Passage au nouveau mot de passe
      setPhoneStep("password")

    }

    catch (error) {

      console.log(error)

      errorToast(
        "Code incorrect",
        error.response?.data?.message ||
        "Le code est incorrect ou expiré."
      )

    }

    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // RÉINITIALISER LE MOT DE PASSE PAR TÉLÉPHONE
  // =====================================================

  const handlePhonePasswordReset = async (e) => {

    e.preventDefault()

    if (!newPassword || !confirmPassword) {

      errorToast(
        "Champs requis",
        "Veuillez remplir les deux champs."
      )

      return

    }

    if (newPassword.length < 6) {

      errorToast(
        "Mot de passe trop court",
        "Le mot de passe doit contenir au moins 6 caractères."
      )

      return

    }

    if (newPassword !== confirmPassword) {

      errorToast(
        "Mots de passe différents",
        "Les deux mots de passe ne correspondent pas."
      )

      return

    }

    try {

      setLoading(true)

      const res = await API.post(
        `/auth/reset-password-phone/${resetToken}`,
        {
          password: newPassword
        }
      )

      successToast(
        "Mot de passe modifié",
        res.data.message
      )

      // Retour à la connexion
      setTimeout(() => {

        navigate("/login")

      }, 1500)

    }

    catch (error) {

      console.log(error)

      errorToast(
        "Erreur",
        error.response?.data?.message ||
        "Impossible de modifier le mot de passe."
      )

    }

    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // RETOUR AU CHOIX
  // =====================================================

  const resetMethod = () => {

    setMethod(null)

    setEmail("")

    setPhone("")

    setPhoneStep("phone")

    setPhoneCode("")

    setResetToken("")

    setNewPassword("")

    setConfirmPassword("")

  }


  // =====================================================
  // RETOUR À L'ÉTAPE PRÉCÉDENTE
  // =====================================================

  const backToPhone = () => {

    if (phoneStep === "code") {

      setPhoneStep("phone")

      setPhoneCode("")

      return

    }

    if (phoneStep === "password") {

      setPhoneStep("code")

      setResetToken("")

      setNewPassword("")

      setConfirmPassword("")

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

                onClick={() => {

                  setMethod("phone")
                  setPhoneStep("phone")

                }}

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
            TÉLÉPHONE
        ===================================================== */}

        {method === "phone" && (

          <>

            {/* =================================================
                ÉTAPE 1 : NUMÉRO
            ================================================= */}

            {phoneStep === "phone" && (

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

                    {loading
                      ? "Envoi du code..."
                      : "Envoyer le code par SMS"
                    }

                  </button>

                </form>

              </>

            )}


            {/* =================================================
                ÉTAPE 2 : CODE SMS
            ================================================= */}

            {phoneStep === "code" && (

              <>

                <div
                  className="
                  mt-6
                  text-center
                  bg-purple-50
                  rounded-2xl
                  p-5
                  "
                >

                  <FaPhone
                    className="
                    mx-auto
                    text-purple-600
                    text-2xl
                    "
                  />

                  <p className="mt-3 text-gray-600">

                    Un code de vérification a été envoyé
                    au numéro :

                  </p>

                  <p className="font-bold text-purple-600 mt-2">

                    {phone}

                  </p>

                </div>


                <form
                  onSubmit={handleVerifyPhoneCode}
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

                      Code de vérification

                    </label>


                    <input

                      type="text"

                      inputMode="numeric"

                      maxLength={6}

                      value={phoneCode}

                      onChange={(e) =>
                        setPhoneCode(
                          e.target.value.replace(/\D/g, "")
                        )
                      }

                      placeholder="123456"

                      autoComplete="one-time-code"

                      required

                      className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-center
                      text-2xl
                      tracking-[0.5em]
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
                      ? "Vérification..."
                      : "Vérifier le code"
                    }

                  </button>

                </form>


                <button

                  type="button"

                  onClick={backToPhone}

                  className="
                  w-full
                  mt-4
                  text-purple-600
                  font-semibold
                  hover:underline
                  "

                >

                  ← Modifier le numéro

                </button>

              </>

            )}


            {/* =================================================
                ÉTAPE 3 : NOUVEAU MOT DE PASSE
            ================================================= */}

            {phoneStep === "password" && (

              <>

                <div
                  className="
                  mt-6
                  text-center
                  bg-green-50
                  rounded-2xl
                  p-5
                  "
                >

                  <FaLock
                    className="
                    mx-auto
                    text-green-600
                    text-2xl
                    "
                  />

                  <p className="mt-3 text-gray-600">

                    Votre numéro a été vérifié.
                    Vous pouvez maintenant choisir
                    un nouveau mot de passe.

                  </p>

                </div>


                <form
                  onSubmit={handlePhonePasswordReset}
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

                      Nouveau mot de passe

                    </label>


                    <input

                      type="password"

                      value={newPassword}

                      onChange={(e) =>
                        setNewPassword(e.target.value)
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
                      outline-none
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-100
                      "

                    />

                  </div>


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


                    <input

                      type="password"

                      value={confirmPassword}

                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
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
                      ? "Modification..."
                      : "Modifier le mot de passe"
                    }

                  </button>

                </form>


                <button

                  type="button"

                  onClick={backToPhone}

                  className="
                  w-full
                  mt-4
                  text-purple-600
                  font-semibold
                  hover:underline
                  "

                >

                  ← Retour au code

                </button>

              </>

            )}


            {/* =========================
                CHANGER DE MÉTHODE
            ========================== */}

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