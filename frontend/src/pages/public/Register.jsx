import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import API from "../../services/api"
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function Register() {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate()


  // =====================================================
  // FORMULAIRE
  // =====================================================

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    password: "",

    confirmPassword: "",

    role: "student"

  })


  // =====================================================
  // AFFICHAGE MOTS DE PASSE
  // =====================================================

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)


  // =====================================================
  // CHARGEMENT
  // =====================================================

  const [loading, setLoading] =
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
  // INSCRIPTION
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()


    if (loading) {

      return

    }


    // =================================================
    // NETTOYAGE
    // =================================================

    const name =
      formData.name.trim()

    const email =
      formData.email.trim().toLowerCase()

    const password =
      formData.password

    const confirmPassword =
      formData.confirmPassword

    const role =
      formData.role


    // =================================================
    // VALIDATION NOM
    // =================================================

    if (!name) {

      errorToast(
        "Inscription impossible",
        "Veuillez saisir votre nom complet."
      )

      return

    }


    // =================================================
    // VALIDATION EMAIL
    // =================================================

    if (!email) {

      errorToast(
        "Inscription impossible",
        "Veuillez saisir votre adresse email."
      )

      return

    }


    // =================================================
    // VALIDATION MOT DE PASSE
    // =================================================

    if (password.length < 6) {

      errorToast(
        "Mot de passe trop court",
        "Le mot de passe doit contenir au moins 6 caractères."
      )

      return

    }


    // =================================================
    // CONFIRMATION MOT DE PASSE
    // =================================================

    if (password !== confirmPassword) {

      errorToast(
        "Mots de passe différents",
        "Les deux mots de passe ne correspondent pas."
      )

      return

    }


    // =================================================
    // SÉCURITÉ RÔLE
    // =================================================

    if (
      role !== "student" &&
      role !== "teacher"
    ) {

      errorToast(
        "Type de compte invalide",
        "Veuillez sélectionner un type de compte valide."
      )

      return

    }


    try {

      setLoading(true)


      // =================================================
      // DONNÉES ENVOYÉES AU BACKEND
      // =================================================

      const payload = {

        name,

        email,

        password,

        role

      }


      console.log(
        "📝 Inscription :",
        {
          ...payload,
          password: "********"
        }
      )


      // =================================================
      // APPEL API
      // =================================================

      const res = await API.post(

        "/auth/register",

        payload

      )


      console.log(
        "✅ Inscription réussie :",
        res.data
      )


      // =================================================
      // EMAIL POUR LOGIN
      // =================================================

      localStorage.setItem(
        "registeredEmail",
        email
      )


      // =================================================
      // MESSAGE SUCCÈS
      // =================================================

      successToast(

        "Compte créé",

        "Votre compte SALAM CI a été créé avec succès. 🎉"

      )


      // =================================================
      // REDIRECTION LOGIN
      // =================================================

      navigate(
        "/login",
        {
          replace: true
        }
      )


    }

    catch (error) {

      console.error(
        "❌ Erreur inscription :",
        error
      )


      if (
        error.response?.data?.message
      ) {

        errorToast(

          "Inscription impossible",

          error.response.data.message

        )

      }

      else {

        errorToast(

          "Erreur",

          "Une erreur est survenue lors de l'inscription."

        )

      }

    }

    finally {

      setLoading(false)

    }

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
      py-10
    ">


      {/* =================================================
          ACCUEIL
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
          CARTE
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

          Créer un compte

        </p>


        {/* =================================================
            FORMULAIRE
        ================================================= */}

        <form

          onSubmit={handleSubmit}

          className="
            mt-10
            space-y-6
          "

        >


          {/* =================================================
              NOM
          ================================================= */}

          <div>

            <label className="
              block
              mb-2
              font-medium
            ">

              Nom complet

            </label>


            <input

              type="text"

              name="name"

              value={formData.name}

              onChange={handleChange}

              placeholder="Votre nom complet"

              required

              disabled={loading}

              autoComplete="name"

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


          {/* =================================================
              EMAIL
          ================================================= */}

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

              autoComplete="email"

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


          {/* =================================================
              MOT DE PASSE
          ================================================= */}

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

                onChange={handleChange}

                placeholder="********"

                required

                disabled={loading}

                autoComplete="new-password"

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


            <p className="
              text-xs
              text-gray-500
              mt-2
            ">

              Minimum 6 caractères.

            </p>

          </div>


          {/* =================================================
              CONFIRMATION
          ================================================= */}

          <div>

            <label className="
              block
              mb-2
              font-medium
            ">

              Confirmer le mot de passe

            </label>


            <div className="
              relative
            ">

              <input

                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }

                name="confirmPassword"

                value={
                  formData.confirmPassword
                }

                onChange={handleChange}

                placeholder="********"

                required

                disabled={loading}

                autoComplete="new-password"

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


          {/* =================================================
              TYPE DE COMPTE
          ================================================= */}

          <div>

            <label className="
              block
              mb-2
              font-medium
            ">

              Type de compte

            </label>


            <select

              name="role"

              value={formData.role}

              onChange={handleChange}

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

            >

              <option value="student">

                Étudiant

              </option>


              <option value="teacher">

                Enseignant

              </option>

            </select>

          </div>


          {/* =================================================
              BOUTON
          ================================================= */}

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

              ? "Création du compte..."

              : "S'inscrire"

            }

          </button>


        </form>


        {/* =================================================
            LOGIN
        ================================================= */}

        <p className="
          text-center
          mt-6
          text-gray-500
        ">

          Déjà un compte ?


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


export default Register