import DashboardLayout from "../../layouts/DashboardLayout"
import {
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileVideo
} from "react-icons/fa"

function Downloads() {

  const files = [
    {
      id: 1,
      name: "Guide React.pdf",
      type: "PDF",
      size: "2.3 MB",
      date: "08 Juin 2026"
    },
    {
      id: 2,
      name: "NodeJS Cours.docx",
      type: "WORD",
      size: "1.8 MB",
      date: "05 Juin 2026"
    },
    {
      id: 3,
      name: "Formation MongoDB.mp4",
      type: "VIDEO",
      size: "120 MB",
      date: "02 Juin 2026"
    }
  ]

  const getIcon = (type) => {

    if (type === "PDF") {
      return <FaFilePdf className="text-red-500 text-3xl" />
    }

    if (type === "WORD") {
      return <FaFileWord className="text-blue-500 text-3xl" />
    }

    return <FaFileVideo className="text-purple-600 text-3xl" />

  }

  return (

    <DashboardLayout>

      {/* HEADER */}

      <h1 className="text-5xl font-bold text-gray-900">
        Téléchargements
      </h1>

      <p className="text-gray-500 mt-3">
        Historique des ressources téléchargées
      </p>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Fichiers téléchargés
          </p>

          <h2 className="text-5xl font-bold text-purple-600 mt-3">
            24
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Documents PDF
          </p>

          <h2 className="text-5xl font-bold text-red-500 mt-3">
            10
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Vidéos
          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-3">
            14
          </h2>

        </div>

      </div>

      {/* LISTE */}

      <div className="mt-12 space-y-5">

        {files.map((file) => (

          <div
            key={file.id}
            className="bg-white rounded-3xl shadow p-6 flex justify-between items-center flex-wrap gap-4"
          >

            <div className="flex items-center gap-4">

              {getIcon(file.type)}

              <div>

                <h2 className="font-bold text-lg">
                  {file.name}
                </h2>

                <p className="text-gray-500">
                  {file.size}
                </p>

                <p className="text-gray-400 text-sm">
                  {file.date}
                </p>

              </div>

            </div>

            <button className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-3 rounded-xl flex items-center gap-2">

              <FaDownload />

              Télécharger

            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Downloads