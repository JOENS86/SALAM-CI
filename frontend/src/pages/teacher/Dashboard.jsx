import TeacherLayout from "../../layouts/TeacherLayout"

import {
  FaBook,
  FaUsers,
  FaVideo,
  FaFileAlt,
  FaAward
} from "react-icons/fa"

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const activities = [
    {
      title: "Nouveau cours créé",
      description: "Introduction à l'Intelligence Artificielle",
      date: "5 Juin 2026"
    },
    {
      title: "Nouvelles inscriptions",
      description: "15 étudiants inscrits à Python Avancé",
      date: "4 Juin 2026"
    },
    {
      title: "Conférence programmée",
      description: "Session Q&A Machine Learning",
      date: "3 Juin 2026"
    },
    {
      title: "Cours mis à jour",
      description: "Développement Web avec React",
      date: "2 Juin 2026"
    }
  ]

  return (

    <TeacherLayout>

      {/* BANNIERE */}

      <div className="bg-gradient-to-r from-[#081028] via-[#101938] to-[#2f3652] rounded-3xl p-10 text-white shadow-xl">

        <h1 className="text-5xl font-bold">
          Bienvenue, {user?.name} !
        </h1>

        <p className="mt-4 text-lg text-gray-300">
          {user?.email}
        </p>

      </div>

      {/* TITRE */}

      <h2 className="text-3xl font-bold mt-12 mb-6">
        Statistiques générales
      </h2>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

        <div className="bg-white rounded-3xl p-6 shadow-md flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Cours publiés
            </p>

            <h3 className="text-4xl font-bold mt-2">
              12
            </h3>
          </div>

          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
            <FaBook />
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Étudiants inscrits
            </p>

            <h3 className="text-4xl font-bold mt-2">
              248
            </h3>
          </div>

          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
            <FaUsers />
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Conférences
            </p>

            <h3 className="text-4xl font-bold mt-2">
              8
            </h3>
          </div>

          <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl">
            <FaVideo />
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Documents
            </p>

            <h3 className="text-4xl font-bold mt-2">
              45
            </h3>
          </div>

          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
            <FaFileAlt />
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md flex justify-between items-center">

          <div>
            <p className="text-gray-500">
              Certificats
            </p>

            <h3 className="text-4xl font-bold mt-2">
              156
            </h3>
          </div>

          <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl">
            <FaAward />
          </div>

        </div>

      </div>

      {/* ACTIVITES */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Activités récentes
        </h2>

        <div className="bg-white rounded-3xl shadow-md overflow-hidden">

          {activities.map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center p-4 border-b last:border-b-0"
            >

              <div>

                <h3 className="font-bold text-xl">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.description}
                </p>

              </div>

              <span className="text-gray-400">
                {item.date}
              </span>

            </div>

          ))}

        </div>

      </div>

    </TeacherLayout>

  )
}

export default Dashboard