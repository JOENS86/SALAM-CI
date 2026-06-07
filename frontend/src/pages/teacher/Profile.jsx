import TeacherLayout from "../../layouts/TeacherLayout"

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera
} from "react-icons/fa"

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <TeacherLayout>

      {/* TITRE */}

      <h1 className="text-5xl font-bold">
        Mon Profil
      </h1>

      <p className="text-gray-500 mt-3">
        Gérez vos informations personnelles
      </p>

      {/* PROFIL */}

      <div className="grid lg:grid-cols-3 gap-8 mt-10">

        <div className="bg-white rounded-3xl shadow p-8">

          <div className="flex flex-col items-center">

            <div className="relative">

              <div className="w-36 h-36 rounded-full bg-purple-600 flex items-center justify-center text-white text-5xl font-bold">

                {user?.name?.charAt(0)}

              </div>

              <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full">

                <FaCamera />

              </button>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {user?.name}
            </h2>

            <p className="text-gray-500 mt-2">
              Enseignant SALAM CI
            </p>

            <p className="text-gray-400 mt-2">
              {user?.email}
            </p>

          </div>

        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

          <h2 className="text-2xl font-bold mb-8">
            Informations personnelles
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              defaultValue={user?.name}
              className="border rounded-xl p-4"
            />

            <input
              type="email"
              defaultValue={user?.email}
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Téléphone"
              className="border rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Spécialité"
              className="border rounded-xl p-4"
            />

          </div>

        </div>

      </div>

      {/* SECURITE */}

      <div className="grid lg:grid-cols-3 gap-8 mt-8">

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-2xl font-bold">
            Sécurité
          </h2>

          <p className="text-gray-500 mt-3">
            Gérez votre mot de passe.
          </p>

        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

          <div className="space-y-5">

            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="w-full border rounded-xl p-4"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <button className="mt-6 bg-purple-600 text-white px-8 py-4 rounded-xl">

            Modifier le mot de passe

          </button>

        </div>

      </div>

      {/* NOTIFICATIONS */}

      <div className="bg-white rounded-3xl shadow p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Notifications
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Nouvelles inscriptions
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Messages des étudiants
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Rappels des conférences
          </label>

        </div>

      </div>

    </TeacherLayout>

  )

}

export default Profile