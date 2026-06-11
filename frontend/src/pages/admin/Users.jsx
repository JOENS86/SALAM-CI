import AdminLayout from "../../layouts/AdminLayout"
import { useNavigate } from "react-router-dom"
import {
    FaUsers,
    FaUserShield,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaSearch,
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaBan
  } from "react-icons/fa"

function Users() {
  const navigate = useNavigate()

  const goToCreateUser = () => {

    navigate("/admin-create-user")
  
  }

  const users = [

    {
      name: "Jean Kouassi",
      email: "jean.kouassi@example.com",
      role: "Étudiant",
      status: "Actif",
      date: "15 Jan 2026"
    },

    {
      name: "Dr. Koné",
      email: "kone@example.com",
      role: "Enseignant",
      status: "Actif",
      date: "10 Déc 2025"
    },

    {
      name: "Aïcha Traoré",
      email: "aicha@example.com",
      role: "Étudiant",
      status: "Actif",
      date: "20 Jan 2026"
    },

    {
      name: "Prof. Diallo",
      email: "diallo@example.com",
      role: "Enseignant",
      status: "Actif",
      date: "5 Nov 2025"
    },

    {
      name: "Admin Principal",
      email: "admin@salamci.com",
      role: "Administrateur",
      status: "Actif",
      date: "1 Déc 2025"
    }

  ]

  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Gestion des Utilisateurs
          </h1>

          <p className="text-gray-500 mt-2">
            Gérez les comptes de la plateforme
          </p>

        </div>

        <button
           type="button"
           onClick={goToCreateUser}
           className="
              bg-gradient-to-r
              from-purple-600
               to-indigo-600
              text-white
              px-6
              py-4
              rounded-2xl
              flex
              items-center
              gap-3
              shadow-lg
              hover:scale-105
              transition-all
              duration-300
              "
            >
             <FaUserPlus />
            Ajouter un utilisateur
       </button>

      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Total
      </p>

      <h2 className="text-4xl font-bold mt-2">
        6
      </h2>

    </div>

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">

      <FaUsers />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Administrateurs
      </p>

      <h2 className="text-4xl font-bold mt-2 text-purple-600">
        1
      </h2>

    </div>

    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">

      <FaUserShield />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Enseignants
      </p>

      <h2 className="text-4xl font-bold mt-2 text-blue-600">
        2
      </h2>

    </div>

    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">

      <FaChalkboardTeacher />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Étudiants
      </p>

      <h2 className="text-4xl font-bold mt-2 text-green-600">
        3
      </h2>

    </div>

    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">

      <FaUserGraduate />

    </div>

  </div>

</div>

</div>

      {/* FILTRES */}

      <div className="flex gap-4 mb-6">

        <div className="flex-1 relative">

          <FaSearch
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="
            w-full
            bg-white
            rounded-2xl
            pl-12
            p-4
            shadow-sm
            "
          />

        </div>

        <select
          className="
          bg-white
          rounded-2xl
          px-5
          shadow-sm
          "
        >

          <option>Tous les rôles</option>
          <option>Administrateur</option>
          <option>Enseignant</option>
          <option>Étudiant</option>

        </select>

      </div>

      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-5">
                Utilisateur
              </th>

              <th className="text-left">
                Rôle
              </th>

              <th className="text-left">
                Statut
              </th>

              <th className="text-left">
                Inscription
              </th>

              <th className="text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user, index) => (

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-5">

                  <div>

                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {user.email}
                    </p>

                  </div>

                </td>

                <td>

                  <span
                    className="
                    bg-blue-100
                    text-blue-600
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    "
                  >
                    {user.role}
                  </span>

                </td>

                <td>

                  <span
                    className="
                    bg-green-100
                    text-green-600
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    "
                  >
                    {user.status}
                  </span>

                </td>

                <td>
                  {user.date}
                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button className="text-blue-600">
                      <FaEdit />
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

export default Users