import AdminLayout from "../../layouts/AdminLayout"

import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaBan,
  FaTrash
} from "react-icons/fa"

function Courses() {

  const courses = [

    {
      title: "Développement React",
      teacher: "Dr. Koné",
      category: "Frontend",
      students: 120,
      status: "Publié"
    },

    {
      title: "Node.js Avancé",
      teacher: "Prof. Diallo",
      category: "Backend",
      students: 85,
      status: "En attente"
    },

    {
      title: "MongoDB Essentials",
      teacher: "Dr. Bamba",
      category: "Base de données",
      students: 63,
      status: "Publié"
    }

  ]

  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Gestion des Cours
        </h1>

        <p className="text-gray-500 mt-2">
          Gérez les cours publiés sur la plateforme
        </p>

      </div>

      {/* RECHERCHE */}

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex items-center gap-4">

        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Rechercher un cours..."
          className="flex-1 outline-none"
        />

      </div>

      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-5">
                Cours
              </th>

              <th className="text-left">
                Enseignant
              </th>

              <th className="text-left">
                Catégorie
              </th>

              <th className="text-left">
                Étudiants
              </th>

              <th className="text-left">
                Statut
              </th>

              <th className="text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {courses.map((course, index) => (

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-5 font-semibold">
                  {course.title}
                </td>

                <td>
                  {course.teacher}
                </td>

                <td>
                  {course.category}
                </td>

                <td>
                  {course.students}
                </td>

                <td>

                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ${
                      course.status === "Publié"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }
                    `}
                  >

                    {course.status}

                  </span>

                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button className="text-blue-600">
                      <FaEye />
                    </button>

                    <button className="text-green-600">
                      <FaCheckCircle />
                    </button>

                    <button className="text-orange-500">
                      <FaBan />
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

export default Courses