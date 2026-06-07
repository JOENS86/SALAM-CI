import AdminLayout from "../../layouts/AdminLayout"

import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaAward,
  FaSignal
} from "react-icons/fa"

function Dashboard() {

  const stats = [

    {
      title: "Total utilisateurs",
      value: "1,254",
      icon: <FaUsers />,
      color: "bg-blue-500"
    },

    {
      title: "Étudiants",
      value: "1,089",
      icon: <FaUserGraduate />,
      color: "bg-green-500"
    },

    {
      title: "Enseignants",
      value: "165",
      icon: <FaChalkboardTeacher />,
      color: "bg-purple-500"
    },

    {
      title: "Cours",
      value: "342",
      icon: <FaBook />,
      color: "bg-orange-500"
    },

    {
      title: "Conférences",
      value: "89",
      icon: <FaVideo />,
      color: "bg-red-500"
    },

    {
      title: "Documents",
      value: "2,456",
      icon: <FaFileAlt />,
      color: "bg-indigo-500"
    },

    {
      title: "Certificats",
      value: "678",
      icon: <FaAward />,
      color: "bg-yellow-500"
    },

    {
      title: "Connexions du jour",
      value: "432",
      icon: <FaSignal />,
      color: "bg-pink-500"
    }

  ]

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Dashboard Administrateur
        </h1>

        <p className="text-gray-500 mt-2">
          Vue d'ensemble de la plateforme SALAM CI
        </p>

      </div>

      {/* CARTES */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="
            bg-white
            rounded-3xl
            p-6
            shadow-sm
            hover:shadow-xl
            transition
            "
          >

            <div
              className={`
              w-14
              h-14
              rounded-2xl
              text-white
              flex
              items-center
              justify-center
              text-xl
              ${item.color}
              `}
            >

              {item.icon}

            </div>

            <p className="text-gray-500 mt-6">
              {item.title}
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {item.value}
            </h2>

          </div>

        ))}

      </div>

      {/* BLOCS */}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Nouveaux utilisateurs
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>Aïcha Traoré</span>
              <span className="text-green-600">
                Étudiant
              </span>
            </div>

            <div className="flex justify-between">
              <span>Mamadou Koné</span>
              <span className="text-blue-600">
                Enseignant
              </span>
            </div>

            <div className="flex justify-between">
              <span>Fatou Diallo</span>
              <span className="text-green-600">
                Étudiant
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Cours récents
          </h2>

          <div className="space-y-5">

            <div>
              <h3 className="font-semibold">
                Intelligence Artificielle
              </h3>

              <p className="text-gray-500">
                Dr. Bamba
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Blockchain Fundamentals
              </h3>

              <p className="text-gray-500">
                Prof. Sanogo
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                DevOps Practices
              </h3>

              <p className="text-gray-500">
                Dr. Koné
              </p>
            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  )

}

export default Dashboard