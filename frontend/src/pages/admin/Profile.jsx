import AdminLayout from "../../layouts/AdminLayout"

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaShieldAlt
} from "react-icons/fa"

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <AdminLayout>

      {/* HEADER */}

      <h1 className="text-5xl font-bold">
        Mon Profil
      </h1>

      <p className="text-gray-500 mt-3">
        Gérez vos informations administrateur
      </p>

      {/* PROFIL */}

      <div className="grid lg:grid-cols-3 gap-8 mt-10">

        {/* CARTE PROFIL */}

        <div className="bg-white rounded-3xl shadow-sm p-8">

          <div className="flex flex-col items-center">

            <div className="relative">

              <div
                className="
                w-36
                h-36
                rounded-full
                bg-purple-600
                text-white
                flex
                items-center
                justify-center
                text-5xl
                font-bold
                "
              >

                {user?.name?.charAt(0)}

              </div>

              <button
                className="
                absolute
                bottom-0
                right-0
                bg-purple-600
                text-white
                p-3
                rounded-full
                "
              >

                <FaCamera />

              </button>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {user?.name}
            </h2>

            <p className="text-gray-500 mt-2">
              Administrateur SALAM CI
            </p>

            <div
              className="
              mt-4
              px-4
              py-2
              rounded-full
              bg-purple-100
              text-purple-600
              flex
              items-center
              gap-2
              "
            >

              <FaShieldAlt />

              Administrateur

            </div>

          </div>

        </div>

        {/* INFOS */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-8">
            Informations personnelles
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-medium">
                Nom complet
              </label>

              <input
                type="text"
                defaultValue={user?.name}
                className="
                w-full
                border
                rounded-2xl
                p-4
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                defaultValue={user?.email}
                className="
                w-full
                border
                rounded-2xl
                p-4
                "
              />

            </div>

          </div>

        </div>

      </div>

      {/* SECURITE */}

      <div className="bg-white rounded-3xl shadow-sm p-8 mt-8">

        <h2 className="text-2xl font-bold mb-8">
          Sécurité
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="
            border
            rounded-2xl
            p-4
            "
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="
            border
            rounded-2xl
            p-4
            "
          />

        </div>

        <button
          className="
          mt-6
          bg-gradient-to-r
          from-purple-600
          to-indigo-600
          text-white
          px-8
          py-4
          rounded-2xl
          "
        >

          Modifier le mot de passe

        </button>

      </div>

      {/* ACTIVITE */}

      <div className="bg-white rounded-3xl shadow-sm p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Activité récente
        </h2>

        <div className="space-y-4">

          <div className="border-b pb-4">

            Connexion à la plateforme

          </div>

          <div className="border-b pb-4">

            Modification des paramètres

          </div>

          <div>

            Gestion des utilisateurs

          </div>

        </div>

      </div>

    </AdminLayout>

  )

}

export default Profile