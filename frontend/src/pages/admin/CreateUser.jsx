import { useState, useEffect } from "react"

import {

  FaArrowLeft,
  FaUserPlus

} from "react-icons/fa"

import {

  useNavigate,
  useParams

} from "react-router-dom"

// =========================
// API
// =========================
import API from "../../services/api"

// =========================
// TOASTS
// =========================
import {

  successToast,
  errorToast

} from "../../utils/toast"

// =========================
// LAYOUT
// =========================
import AdminLayout from "../../layouts/AdminLayout"

function CreateUser() {

  // =========================
  // NAVIGATION
  // =========================
  const navigate = useNavigate()

  // =========================
  // ID DANS L'URL
  // =========================
  const { id } = useParams()

  // =========================
  // MODE MODIFICATION ?
  // =========================
  const isEdit = !!id

  // =========================
  // FORMULAIRE
  // =========================
  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    role: "teacher"

  })

  // =========================
  // CHARGER UTILISATEUR
  // =========================
  const getUser = async () => {

    try {

      const res = await API.get(

        `/users/${id}`

      )

      setFormData({

        name: res.data.name,
        email: res.data.email,
        password: "",
        role: res.data.role

      })

    }

    catch (error) {

      console.log(error)

      errorToast(

        "Erreur",

        "Impossible de charger l'utilisateur."

      )

    }

  }

  // =========================
  // CHARGEMENT INITIAL
  // =========================
  useEffect(() => {

    if (isEdit) {

      getUser()

    }

  }, [id])

  // =========================
  // CHANGEMENT INPUT
  // =========================
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }

  // =========================
  // ENREGISTRER
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      // =========================
      // MODIFICATION
      // =========================
      if (isEdit) {

        const res = await API.put(

          `/users/${id}`,

          {

            name: formData.name,
            email: formData.email,
            role: formData.role

          }

        )

        console.log(res.data)

        // =========================
        // POPUP
        // =========================
        successToast(

          "Modification réussie",

          "Les informations ont été enregistrées avec succès."

        )

        // =========================
        // RETOUR LISTE
        // =========================
        setTimeout(() => {

          navigate(

            "/admin-users",

            {

              replace: true

            }

          )

        }, 1500)

        return

      }

      // =========================
      // CRÉATION
      // =========================
      const res = await API.post(

        "/auth/register",

        formData

      )

      console.log(res.data)

      successToast(

        "Utilisateur créé",

        "Le nouvel utilisateur a été ajouté."

      )

      setTimeout(() => {

        navigate(

          "/admin-users",

          {

            replace: true

          }

        )

      }, 1500)

    }

    catch (error) {

      console.log(error)

      errorToast(

        "Erreur",

        error.response?.data?.message ||

        "Une erreur est survenue."

      )

    }

  }

  return (

    <AdminLayout>
  
      {/* =========================
          HEADER
      ========================== */}
  
      <div className="flex justify-between items-center mb-8">
  
        <button
  
          type="button"
  
          onClick={() => navigate("/admin-users")}
  
          className="
          flex
          items-center
          gap-3
          bg-white
          px-5
          py-3
          rounded-2xl
          shadow-sm
          hover:shadow-md
          transition
          "
  
        >
  
          <FaArrowLeft />
  
          Retour
  
        </button>
  
      </div>
  
      {/* =========================
          BANNIÈRE
      ========================== */}
  
      <div
        className="
        bg-gradient-to-r
        from-purple-600
        to-indigo-600
        rounded-3xl
        p-8
        text-white
        shadow-lg
        "
      >
  
        <h1 className="text-5xl font-bold">
  
          {
  
            isEdit
  
              ? "Modifier un utilisateur"
  
              : "Ajouter un utilisateur"
  
          }
  
        </h1>
  
        <p className="mt-3 text-purple-100">
  
          {
  
            isEdit
  
              ? "Modifiez les informations de cet utilisateur."
  
              : "Créez un compte enseignant ou administrateur."
  
          }
  
        </p>
  
      </div>
  
      {/* =========================
          FORMULAIRE
      ========================== */}
  
      <form
  
        onSubmit={handleSubmit}
  
        className="mt-10"
  
      >
  
        <div
          className="
          bg-white
          rounded-3xl
          shadow-sm
          p-8
          "
        >
  
          <h2 className="text-2xl font-bold mb-8">
  
            Informations du compte
  
          </h2>
  
          <div className="grid md:grid-cols-2 gap-6">
  
            {/* =========================
                NOM
            ========================== */}
  
            <div>
  
              <label className="font-medium block mb-2">
  
                Nom complet
  
              </label>
  
              <input
  
                type="text"
  
                name="name"
  
                value={formData.name}
  
                onChange={handleChange}
  
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
                "
  
                placeholder="Nom complet"
  
                required
  
              />
  
            </div>
  
            {/* =========================
                EMAIL
            ========================== */}
  
            <div>
  
              <label className="font-medium block mb-2">
  
                Email
  
              </label>
  
              <input
  
                type="email"
  
                name="email"
  
                value={formData.email}
  
                onChange={handleChange}
  
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
                "
  
                placeholder="email@exemple.com"
  
                required
  
              />
  
            </div>
  
            {/* =========================
                MOT DE PASSE
            ========================== */}
  
            {
  
              !isEdit &&
  
              <div>
  
                <label className="font-medium block mb-2">
  
                  Mot de passe
  
                </label>
  
                <input
  
                  type="password"
  
                  name="password"
  
                  value={formData.password}
  
                  onChange={handleChange}
  
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                  "
  
                  placeholder="********"
  
                  required
  
                />
  
              </div>
  
            }
  
            {/* =========================
                RÔLE
            ========================== */}
  
            <div>
  
              <label className="font-medium block mb-2">
  
                Rôle
  
              </label>
  
              <select
  
                name="role"
  
                value={formData.role}
  
                onChange={handleChange}
  
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
                "
  
              >
  
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
  
          </div>
  
          {/* =========================
              BOUTON
          ========================== */}
  
          <div className="mt-10 flex justify-end">
  
            <button
  
              type="submit"
  
              className="
              flex
              items-center
              gap-3
              bg-gradient-to-r
              from-purple-600
              to-indigo-600
              text-white
              px-8
              py-4
              rounded-2xl
              shadow-lg
              hover:scale-105
              transition
              "
  
            >
  
              {
  
                isEdit
  
                ?
  
                <>
  
                  💾 Enregistrer les modifications
  
                </>
  
                :
  
                <>
  
                  <FaUserPlus />
  
                  Créer l'utilisateur
  
                </>
  
              }
  
            </button>
  
          </div>
  
        </div>
  
      </form>
  
    </AdminLayout>
  
  )
  
  }
  
  export default CreateUser
