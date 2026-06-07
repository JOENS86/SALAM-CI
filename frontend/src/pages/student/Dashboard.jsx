import DashboardLayout from "../../layouts/DashboardLayout"
import {
  FaBook,
  FaVideo,
  FaAward,
  FaDownload
} from "react-icons/fa"

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div>

        <h1 className="text-5xl font-bold text-gray-900">
          Bienvenue, {user?.name}
        </h1>

        <p className="mt-4 text-gray-500 text-lg">
          Email : {user?.email}
        </p>

        <p className="text-gray-500 mt-2">
          Membre SALAM CI
        </p>

      </div>

      {/* STATISTIQUES */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

      <div className="bg-white rounded-3xl shadow p-6">
              {/* Carte Cours */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Cours suivis
          </p>
            <FaBook className="text-blue-600 text-3xl" />
        </div>
        <h2 className="text-5xl font-bold mt-4 text-blue-600">
           8
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
              {/* Carte Conférences */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Conférences Participées
          </p>
            <FaVideo className="text-green-500 text-3xl" />
        </div>
        <h2 className="text-5xl font-bold mt-4 text-green-500">
            12
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
              {/* Carte Certificats */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Certificats Obtenus
          </p>
            <FaAward className="text-orange-500 text-3xl" />
        </div>
        <h2 className="text-5xl font-bold mt-4 text-orange-500">
             3
        </h2>

      </div>

      <div className="bg-white rounded-3xl shadow p-6">
              {/* Carte Téléchargements */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Fichiers téléchargés
          </p>
            <FaDownload className="text-purple-600 text-3xl" />
        </div>
        <h2 className="text-5xl font-bold mt-4 text-purple-600">
             24
        </h2>
      </div>

      </div>

      {/* SECTION ACTIVITÉS */}

      <div className="grid lg:grid-cols-3 gap-8 mt-12">

        {/* COURS */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Derniers cours consultés
          </h2>

          <div className="space-y-6">

            <div>

              <h3 className="font-semibold">
                Introduction à React
              </h3>

              <p className="text-sm text-gray-500">
                Progression : 75%
              </p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-blue-600 h-2 rounded-full w-[75%]"></div>
              </div>

            </div>

            <div>

              <h3 className="font-semibold">
                Node.js Avancé
              </h3>

              <p className="text-sm text-gray-500">
                Progression : 45%
              </p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
              </div>

            </div>

            <div>

              <h3 className="font-semibold">
                MongoDB Essentials
              </h3>

              <p className="text-sm text-gray-500">
                Progression : 90%
              </p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-blue-600 h-2 rounded-full w-[90%]"></div>
              </div>

            </div>

          </div>

        </div>

        {/* CONFERENCES */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Dernières conférences
          </h2>

          <div className="space-y-5">

            <div>
              <h3 className="font-semibold">
                Architecture Microservices
              </h3>

              <p className="text-gray-500 text-sm">
                5 Juin 2026
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Sécurité Web
              </h3>

              <p className="text-gray-500 text-sm">
                3 Juin 2026
              </p>
            </div>

          </div>

        </div>

        {/* TELECHARGEMENTS */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Derniers téléchargements
          </h2>

          <div className="space-y-5">

            <div>

              <h3 className="font-semibold">
                React-Hooks-Guide.pdf
              </h3>

              <p className="text-gray-500 text-sm">
                2.3 MB
              </p>

            </div>

            <div>

              <h3 className="font-semibold">
                NodeJS-Best-Practices.docx
              </h3>

              <p className="text-gray-500 text-sm">
                1.8 MB
              </p>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  )

}

export default Dashboard