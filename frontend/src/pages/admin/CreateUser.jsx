import { useState } from "react"
import { FaArrowLeft, FaUserPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

import AdminLayout from "../../layouts/AdminLayout"

function CreateUser() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    role: "teacher"

  })

  const handleChange = (e) => {

    setFormData({

      ...formData,
      [e.target.name]: e.target.value

    })

  }

  const handleSubmit = (e) => {

    e.preventDefault()

    alert(
      "Création d'utilisateur bientôt disponible 🚀"
    )

  }

  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <button
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

      {/* BANNIERE */}

      <div className="
      bg-gradient-to-r
      from-purple-600
      to-indigo-600
      rounded-3xl
      p-8
      text-white
      shadow-lg
      ">

        <h1 className="text-5xl font-bold">
          Ajouter un utilisateur
        </h1>

        <p className="mt-3 text-purple-100">
          Créez un compte enseignant ou administrateur
        </p>

      </div>

      {/* FORMULAIRE */}

      <form
        onSubmit={handleSubmit}
        className="mt-10"
      >

        <div className="
        bg-white
        rounded-3xl
        shadow-sm
        p-8
        ">

          <h2 className="text-2xl font-bold mb-8">
            Informations du compte
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

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
              />

            </div>

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
              />

            </div>

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
              />

            </div>

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

                <option value="teacher">
                  Enseignant
                </option>

                <option value="admin">
                  Administrateur
                </option>

              </select>

            </div>

          </div>

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

              <FaUserPlus />

              Créer l'utilisateur

            </button>

          </div>

        </div>

      </form>

    </AdminLayout>

  )

}

export default CreateUser