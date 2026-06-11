import AdminLayout from "../../layouts/AdminLayout"

import {
  FaFilePdf,
  FaFileVideo,
  FaImage,
  FaDownload,
  FaEye,
  FaTrash,
  FaSearch
} from "react-icons/fa"

function Files() {

  const files = [

    {
      name: "Cours React.pdf",
      type: "PDF",
      owner: "Dr. Koné",
      size: "2.4 MB"
    },

    {
      name: "Introduction IA.mp4",
      type: "Vidéo",
      owner: "Dr. Bamba",
      size: "150 MB"
    },

    {
      name: "Architecture.jpg",
      type: "Image",
      owner: "Prof. Diallo",
      size: "1.2 MB"
    }

  ]

  const getIcon = (type) => {

    switch(type) {

      case "PDF":
        return <FaFilePdf className="text-red-500" />

      case "Vidéo":
        return <FaFileVideo className="text-blue-500" />

      case "Image":
        return <FaImage className="text-green-500" />

      default:
        return <FaFilePdf />

    }

  }

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Gestion des Fichiers
        </h1>

        <p className="text-gray-500 mt-2">
          Consultez et gérez les fichiers de la plateforme
        </p>

      </div>

      {/* RECHERCHE */}

      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 mb-8">

        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Rechercher un fichier..."
          className="flex-1 outline-none"
        />

      </div>

      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-5">
                Fichier
              </th>

              <th className="text-left">
                Type
              </th>

              <th className="text-left">
                Auteur
              </th>

              <th className="text-left">
                Taille
              </th>

              <th className="text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {files.map((file, index) => (

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-5">

                  <div className="flex items-center gap-3">

                    {getIcon(file.type)}

                    <span className="font-semibold">
                      {file.name}
                    </span>

                  </div>

                </td>

                <td>
                  {file.type}
                </td>

                <td>
                  {file.owner}
                </td>

                <td>
                  {file.size}
                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button className="text-blue-600">
                      <FaEye />
                    </button>

                    <button className="text-green-600">
                      <FaDownload />
                    </button>

                    <button className="text-red-600">
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  )

}

export default Files