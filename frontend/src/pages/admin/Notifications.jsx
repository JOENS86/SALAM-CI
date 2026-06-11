import { useState } from "react"

import AdminLayout from "../../layouts/AdminLayout"

import {
  FaBell,
  FaPaperPlane
} from "react-icons/fa"

function Notifications() {

  const [notification, setNotification] = useState({

    title: "",
    message: "",
    target: "all"

  })

  const handleChange = (e) => {

    setNotification({

      ...notification,
      [e.target.name]: e.target.value

    })

  }

  const handleSubmit = (e) => {

    e.preventDefault()

    alert(
      "Envoi de notification bientôt disponible 🚀"
    )

  }

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="text-gray-500 mt-2">
          Envoyez des notifications aux utilisateurs
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* FORMULAIRE */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Nouvelle notification
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <input
              type="text"
              name="title"
              placeholder="Titre de la notification"
              value={notification.title}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              p-4
              "
            />

            <textarea
              name="message"
              placeholder="Message..."
              value={notification.message}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              p-4
              h-40
              "
            />

            <select
              name="target"
              value={notification.target}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              p-4
              "
            >

              <option value="all">
                Tous les utilisateurs
              </option>

              <option value="students">
                Étudiants
              </option>

              <option value="teachers">
                Enseignants
              </option>

              <option value="admins">
                Administrateurs
              </option>

            </select>

            <button
              type="submit"
              className="
              bg-gradient-to-r
              from-purple-600
              to-indigo-600
              text-white
              px-8
              py-4
              rounded-2xl
              flex
              items-center
              gap-3
              "
            >

              <FaPaperPlane />

              Envoyer

            </button>

          </form>

        </div>

        {/* HISTORIQUE */}

        <div className="bg-white rounded-3xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Historique
          </h2>

          <div className="space-y-5">

            <div className="border-b pb-4">

              <div className="flex items-center gap-3">

                <FaBell className="text-purple-600" />

                <h3 className="font-semibold">
                  Maintenance prévue
                </h3>

              </div>

              <p className="text-gray-500 text-sm mt-2">
                Envoyée à tous
              </p>

            </div>

            <div className="border-b pb-4">

              <div className="flex items-center gap-3">

                <FaBell className="text-purple-600" />

                <h3 className="font-semibold">
                  Nouvelle conférence
                </h3>

              </div>

              <p className="text-gray-500 text-sm mt-2">
                Envoyée aux étudiants
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3">

                <FaBell className="text-purple-600" />

                <h3 className="font-semibold">
                  Mise à jour plateforme
                </h3>

              </div>

              <p className="text-gray-500 text-sm mt-2">
                Envoyée aux enseignants
              </p>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  )

}

export default Notifications