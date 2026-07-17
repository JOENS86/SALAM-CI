import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import API from "../../services/api"
import { FaArrowLeft } from "react-icons/fa"
import { useLocation } from "react-router-dom"
import {
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaBookOpen,
  FaAward,
  FaVideo
} from "react-icons/fa"
import { successToast, errorToast } from "../../utils/toast";


function Login() {


  // =========================
  // NAVIGATION
  // =========================
  const navigate = useNavigate()

  const location = useLocation()

  const params =
  new URLSearchParams(location.search)

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

  accessIcon = <FaUsers className="text-4xl text-purple-600" />

  accessTitle = "Accès réservé aux membres"

  accessDescription =
    "Connectez-vous pour accéder à la Communauté Active SALAM CI et rejoindre les échanges entre étudiants et enseignants."

}

else if (isCourses) {

  accessIcon = <FaBookOpen className="text-4xl text-purple-600" />

  accessTitle = "Accès aux formations"

  accessDescription =
    "Connectez-vous pour accéder à toutes les formations SALAM CI et poursuivre votre apprentissage."

}

else if (isCertificates) {

  accessIcon = <FaAward className="text-4xl text-purple-600" />

  accessTitle = "Accédez à vos certificats"

  accessDescription =
    "Connectez-vous pour consulter, télécharger et partager tous vos certificats obtenus sur SALAM CI."

}

else if (isConference) {

  accessIcon = <FaVideo className="text-4xl text-purple-600" />

  accessTitle = "Accès aux conférences"

  accessDescription =
    "Connectez-vous pour rejoindre les conférences en direct organisées sur SALAM CI."

}

  // =========================
  // STATE FORMULAIRE
  // =========================
  const [formData, setFormData] = useState({
    email: localStorage.getItem("registeredEmail") || "",
    password: ""
  })

  const [showPassword, setShowPassword] =
  useState(false)

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

      // SUPPRIMER EMAIL TEMPORAIRE
      localStorage.removeItem(
           "registeredEmail"
      )

      successToast(
        "Connexion réussie",
        "Bienvenue sur SALAM CI."
      )
      
      if (params.get("courses") === "true") {
        navigate("/courses", {
          replace: true
        })
        return    
      }  

      if (params.get("conference") === "true") {
        navigate("/conference-room", {
          replace: true
        })    
        return  
      }
      
      if (params.get("community") === "true") {  
        navigate("/community", {
          replace: true
        })
        return  
      }
      
      if (params.get("certificates") === "true") {
        navigate("/certificates", {
          replace: true
        }) 
        return 
      }


      // =========================
      // REDIRECTION SELON ROLE
      // =========================
      const role = res.data.user.role

      if (role === "admin") {

        navigate("/admin-dashboard", {
          replace: true
        })

      } else if (role === "teacher") {

        navigate("/teacher-dashboard", {
          replace: true
        })

      } else {

        navigate("/student-dashboard", {
          replace: true
        })

      }

    } catch (error) {

      console.log(error)

      if (error.response?.data?.message) {

        errorToast(error.response.data.message)

      } else {

        errorToast(
          "Connexion refusée",
          "Email ou mot de passe incorrect."   
        )

      }

    }

  }

  return (

    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center px-6 relative">
  
      <button
        onClick={() => navigate("/")}
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
  
      <div
        className={`
          w-full
          flex
          items-center
          justify-center
          gap-24
          ${ isCommunity || isCourses || isCertificates || isConference ? "max-w-6xl" : "max-w-md" }
        `}
      >
  
  {(isCommunity ||
  isCourses ||
  isCertificates ||
  isConference) && (

  <div className="text-center max-w-md">

    <div
      className="
      w-24
      h-24
      mx-auto
      rounded-full
      bg-purple-100
      flex
      items-center
      justify-center
      mb-6
      "
    >

      {accessIcon}

    </div>

    <h1 className="text-4xl font-bold">

      {accessTitle}

    </h1>

    <p className="text-gray-500 mt-4 leading-8">

      {accessDescription}

    </p>

  </div>

)}
  
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
  
          {/* TITRE */}
  
          {!( isCommunity || isCourses || isCertificates || isConference ) && ( 
            <>
              <h1 className="text-5xl font-bold text-center">
                SALAM <span className="text-purple-600">CI</span>
              </h1>
  
              <p className="text-center text-gray-500 mt-3">
                Plateforme de formation en ligne
              </p>
            </>
  
          )}
  
          {/* FORMULAIRE */}
  
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
  
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
  
            <div>
  
              <label className="block mb-2 font-medium">
                Mot de passe
              </label>
  
              <div className="relative">
  
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
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
                    setShowPassword(!showPassword)
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
  
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold"
            >
              Se connecter
            </button>
  
          </form>
  
          {!hideRegister && (
  
            <p className="text-center mt-6 text-gray-500">
  
              Pas encore de compte ?
  
              <Link
                to="/register"
                className="text-purple-600 font-semibold ml-2"
              >
                S'inscrire
              </Link>
  
            </p>
  
          )}
  
        </div>
  
      </div>
  
    </div>
  
  )
}

export default Login