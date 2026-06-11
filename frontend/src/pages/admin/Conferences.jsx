import AdminLayout from "../../layouts/AdminLayout"

import {
    FaSearch,
    FaEye,
    FaBan,
    FaTrash,
    FaVideo,
    FaCalendarAlt,
    FaCheckCircle
  } from "react-icons/fa"

function Conferences() {

  const conferences = [

    {
      title: "Machine Learning Avancé",
      teacher: "Dr. Koné",
      date: "15 Juin 2026",
      participants: 120,
      status: "Programmée"
    },

    {
      title: "React Best Practices",
      teacher: "Prof. Diallo",
      date: "18 Juin 2026",
      participants: 85,
      status: "Programmée"
    },

    {
      title: "Introduction IA",
      teacher: "Dr. Bamba",
      date: "01 Juin 2026",
      participants: 210,
      status: "Terminée"
    }

  ]

  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Gestion des Conférences
        </h1>

        <p className="text-gray-500 mt-2">
          Supervisez les conférences de la plateforme
        </p>

      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Total conférences
      </p>

      <h2 className="text-4xl font-bold mt-2">
        24
      </h2>

    </div>

    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">

      <FaVideo />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Programmées
      </p>

      <h2 className="text-4xl font-bold mt-2 text-blue-600">
        15
      </h2>

    </div>

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">

      <FaCalendarAlt />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Terminées
      </p>

      <h2 className="text-4xl font-bold mt-2 text-green-600">
        9
      </h2>

    </div>

    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">

      <FaCheckCircle />

    </div>

  </div>

</div>

</div>

      {/* RECHERCHE */}

      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 mb-8">

        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Rechercher une conférence..."
          className="flex-1 outline-none"
        />

      </div>

      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-5">
                Conférence
              </th>

              <th className="text-left">
                Enseignant
              </th>

              <th className="text-left">
                Date
              </th>

              <th className="text-left">
                Participants
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

            {conferences.map((conference, index) => (

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-5">

                  <div className="flex items-center gap-3">

                    <FaVideo className="text-purple-600" />

                    <span className="font-semibold">
                      {conference.title}
                    </span>

                  </div>

                </td>

                <td>
                  {conference.teacher}
                </td>

                <td>
                  {conference.date}
                </td>

                <td>
                  {conference.participants}
                </td>

                <td>

                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ${
                      conference.status === "Terminée"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }
                    `}
                  >

                    {conference.status}

                  </span>

                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button className="text-blue-600">
                      <FaEye />
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

export default Conferences