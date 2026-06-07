import DashboardLayout from "../../layouts/DashboardLayout"
import {
  FaAward,
  FaDownload,
  FaEye
} from "react-icons/fa"

function Certificates() {

  const certificates = [
    {
      id: 1,
      course: "Développement React",
      teacher: "M. Kouassi",
      date: "05 Juin 2026"
    },
    {
      id: 2,
      course: "Node.js Avancé",
      teacher: "Mme Yao",
      date: "22 Mai 2026"
    },
    {
      id: 3,
      course: "MongoDB Essentials",
      teacher: "M. Konan",
      date: "10 Avril 2026"
    }
  ]

  return (

    <DashboardLayout>

      {/* HEADER */}

      <h1 className="text-5xl font-bold text-gray-900">
        Mes Certificats
      </h1>

      <p className="text-gray-500 mt-3">
        Consultez et téléchargez vos certificats
      </p>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Certificats obtenus
          </p>

          <h2 className="text-5xl font-bold text-orange-500 mt-3">
            3
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Taux de réussite
          </p>

          <h2 className="text-5xl font-bold text-green-500 mt-3">
            92%
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Score moyen
          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-3">
            17/20
          </h2>

        </div>

      </div>

      {/* LISTE */}

      <div className="mt-12 space-y-6">

        {certificates.map((certificate) => (

          <div
            key={certificate.id}
            className="bg-white rounded-3xl shadow p-6 flex justify-between items-center flex-wrap gap-4"
          >

            <div>

              <div className="flex items-center gap-3">

                <FaAward className="text-orange-500 text-3xl" />

                <h2 className="text-xl font-bold">
                  {certificate.course}
                </h2>

              </div>

              <p className="text-gray-500 mt-2">
                Formateur : {certificate.teacher}
              </p>

              <p className="text-gray-500">
                Obtenu le : {certificate.date}
              </p>

            </div>

            <div className="flex gap-3">

              <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl flex items-center gap-2">

                <FaEye />

                Voir

              </button>

              <button className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-3 rounded-xl flex items-center gap-2">

                <FaDownload />

                Télécharger

              </button>

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Certificates