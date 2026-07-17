import AdminLayout from "../../layouts/AdminLayout"
import { useNavigate } from "react-router-dom"
// =========================
// API AXIOS
// =========================
import API from "../../services/api"
// =========================
// TOASTS
// =========================
import {

  successToast,
  errorToast

} from "../../utils/toast"
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
// =========================
// HOOKS REACT
// =========================
import { useState, useEffect } from "react"
// =========================
// MODAL SUPPRESSION
// =========================
import DeleteUserModal from "../../components/DeleteUserModal"
// =========================
// MODAL ACTION INTERDITE
// =========================
import ForbiddenActionModal from "../../components/ForbiddenActionModal"
// =========================
// MODAL ACTIVER / DÉSACTIVER
// =========================
import StatusUserModal from "../../components/StatusUserModal"


function Users() {
  const navigate = useNavigate()

  const goToCreateUser = () => {

    navigate("/admin-create-user")
  
  }

const [users, setUsers] = useState([])

// =========================
// PAGINATION
// =========================
const [page, setPage] = useState(1)
const [limit, setLimit] = useState(10)
const [totalPages, setTotalPages] = useState(1)
const [totalUsers, setTotalUsers] = useState(0)

// =========================
// MODAL SUPPRESSION
// =========================
const [isDeleteOpen, setIsDeleteOpen] = useState(false)
const [selectedUser, setSelectedUser] = useState(null)

// =========================
// MODAL ACTION INTERDITE
// =========================
const [forbiddenOpen, setForbiddenOpen] = useState(false)
const [forbiddenTitle, setForbiddenTitle] = useState("")
const [forbiddenMessage, setForbiddenMessage] = useState("")

// =========================
// MODAL ACTIVER / DÉSACTIVER
// =========================
const [statusModalOpen, setStatusModalOpen] = useState(false)
const [selectedStatusUser, setSelectedStatusUser] = useState(null)
const [activateUser, setActivateUser] = useState(false)

// =========================
// UTILISATEUR CONNECTÉ
// =========================
const currentUser = JSON.parse(
  localStorage.getItem("user")
)

// =========================
// STATISTIQUES
// =========================
const [stats, setStats] = useState({

  total: 0,

  admins: 0,

  teachers: 0,

  students: 0

})
// =========================
// RECHERCHE
// =========================
const [search, setSearch] = useState("")
// =========================
// FILTRE PAR RÔLE
// =========================
const [roleFilter, setRoleFilter] = useState("Tous les rôles")

// =========================
// RÉCUPÉRER LES UTILISATEURS
// =========================
const getUsers = async () => {

  try {

    // =========================
    // APPEL API
    // =========================
    const res = await API.get(

      `/users?page=${page}&limit=${limit}`

    )

    // =========================
    // UTILISATEURS
    // =========================
    setUsers(

      res.data.users

    )

    // =========================
    // PAGINATION
    // =========================
    setTotalPages(

      res.data.totalPages

    )

    setTotalUsers(

      res.data.totalUsers

    )

  }

  catch (error) {

    console.log(error)

  }

}

// =========================
// RÉCUPÉRER LES STATISTIQUES
// =========================
const getStats = async () => {

  try {

      const res = await API.get("/users/stats")

      setStats(res.data)

  }

  catch (error) {

      console.log(error)

  }

}

// =========================
// CHARGEMENT AU DÉMARRAGE
// =========================
useEffect(() => {

  getUsers()

  getStats()

}, [page, limit])


// =========================
// MODIFIER UTILISATEUR
// =========================
const editUser = (user) => {
  // =========================
  // L'ADMIN CLIQUE SUR LUI-MÊME
  // =========================
  if (user._id === currentUser._id) {
      setForbiddenTitle(
          "Modification impossible"
      )
      setForbiddenMessage(
          "Vous ne pouvez pas modifier votre propre compte depuis la gestion des utilisateurs.\n\nUtilisez plutôt la rubrique « Mon Profil »."
      )
      setForbiddenOpen(true)
      return
  }

  // =========================
  // AUTRE UTILISATEUR
  // =========================
  navigate(

      `/admin-edit-user/${user._id}`
  )
}

// =========================
// OUVERTURE MODAL
// =========================
const openDeleteModal = (user) => {

  setSelectedUser(user)

  setIsDeleteOpen(true)

}

// =========================
// OUVERTURE MODAL STATUT
// =========================
const openStatusModal = (

  user,

  activate

) => {

  // =========================
  // L'ADMIN CLIQUE SUR LUI-MÊME
  // =========================
  if (user._id === currentUser._id) {
      setForbiddenTitle(
          "Action impossible"
      )
      setForbiddenMessage(
          "Vous ne pouvez pas modifier votre propre statut."
      )
      setForbiddenOpen(true)
      return
  }
  setSelectedStatusUser(user)
  setActivateUser(activate)
  setStatusModalOpen(true)
}

// =========================
// SUPPRIMER UTILISATEUR
// =========================
const deleteUser = async () => {

  try {

      const res = await API.delete(

          `/users/${selectedUser._id}`

      )

      successToast(

          "Suppression réussie",

          res.data.message

      )

      setIsDeleteOpen(false)

      setSelectedUser(null)

      getUsers()

      getStats()

  }

  catch (error) {

      errorToast(

          "Erreur",

          error.response?.data?.message ||

          "Impossible de supprimer cet utilisateur."

      )

  }

}

// =========================
// ACTIVER / DÉSACTIVER
// =========================
const changeStatus = async () => {

  try {

      const res = await API.patch(

          `/users/${selectedStatusUser._id}/status`

      )

      successToast(

          "Succès",

          res.data.message

      )

      setStatusModalOpen(false)

      setSelectedStatusUser(null)

      getUsers()

      getStats()

  }

  catch (error) {

      errorToast(

          "Erreur",

          error.response?.data?.message ||

          "Impossible de modifier le statut."

      )

  }

}

// =========================
// FILTRAGE RECHERCHE
// =========================
const filteredUsers = users.filter((user) => {
  // -------------------------
  // Recherche
  // -------------------------
  const matchSearch =

      user.name
          .toLowerCase()
          .includes(search.toLowerCase())

      ||

      user.email
          .toLowerCase()
          .includes(search.toLowerCase())

  // -------------------------
  // Filtre rôle
  // -------------------------
  let matchRole = true

  if (roleFilter === "Administrateur") {

      matchRole = user.role === "admin"

  }

  else if (roleFilter === "Enseignant") {

      matchRole = user.role === "teacher"

  }

  else if (roleFilter === "Étudiant") {

      matchRole = user.role === "student"

  }

  return matchSearch && matchRole

})


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
      {stats.total}
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
      {stats.admins}
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
      {stats.teachers}
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
      {stats.students}
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
    value={search}
    onChange={(e) => setSearch(e.target.value)}
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            bg-white
            rounded-2xl
            px-5
            shadow-sm"
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

            {filteredUsers.map((user, index) => (

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
                  <div className={`w-5 h-5 rounded-full mx-auto
                    ${
                      user.isOnline
                   ? "bg-green-500"
                   : "bg-red-500"
                    }
                    `}
                  >
                  </div>
               </td>

                <td>
        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                  <button
                    onClick={() => editUser(user)}
                    disabled={user._id === currentUser._id}
                    title={
                      user._id === currentUser._id
                        ? "Modifiez votre compte depuis Mon Profil."
                        : "Modifier cet utilisateur"
                    }
                    className={`
                      transition
                          ${
                              user._id === currentUser._id
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-blue-600 hover:text-blue-800"
                            }
                  ` }
                  >
                      <FaEdit />
                  </button>

{/* =========================
    ACTIVER
========================= */}

<button

    disabled={

        user.isActive ||

        user._id === currentUser._id

    }

    title={

        user._id === currentUser._id

        ?

        "Impossible de modifier votre statut."

        :

        "Activer"

    }

    onClick={() =>

        openStatusModal(

            user,

            true

        )

    }

    className={`
        transition

        ${

            user.isActive ||

            user._id === currentUser._id

            ?

            "text-gray-300 cursor-not-allowed"

            :

            "text-green-600 hover:text-green-800"

        }
    `}
>

    <FaCheckCircle />

</button>

{/* =========================
    DÉSACTIVER
========================= */}

<button
    disabled={
        !user.isActive ||
        user._id === currentUser._id
    }
    title={
        user._id === currentUser._id
        ?
        "Impossible de modifier votre statut."
        :
        "Désactiver"
    }
    onClick={() =>
        openStatusModal(
            user,
            false
        )
    }
    className={`
        transition
        ${
            !user.isActive ||
            user._id === currentUser._id
            ?
            "text-gray-300 cursor-not-allowed"
            :
            "text-orange-600 hover:text-orange-700"
        }
    `}
>
    <FaBan />

</button>

                    <button
                      onClick={() => openDeleteModal(user)}
                      disabled={user._id === currentUser._id}
                      title={
                        user._id === currentUser._id
                        ? "Impossible de supprimer votre propre compte."
                        : "Supprimer cet utilisateur"
                      }
                      className={`
                          transition
                          ${
                              user._id === currentUser._id
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800"
                          }
                      `}
                    >
                        <FaTrash />
                      </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <p className="text-gray-500 mt-6">
          Affichage de
            <span className="font-bold">
              {" "}
                {(page - 1) * limit + 1}
            </span>&nbsp;
          à&nbsp;
            <span className="font-bold">
              {" "}
                {
                  Math.min(
                    page * limit,
                    totalUsers
                          )
                }
            </span>&nbsp;
          sur
            <span className="font-bold">
              {" "}
              {totalUsers}
            </span>&nbsp;
          utilisateurs.
      </p>


        {/* =========================
                 PAGINATION
        ========================= */}

<div className="flex justify-between items-center mt-8">
    <div className="flex items-center gap-3">
        <span className="text-gray-500">
            Afficher
        </span>

        <select
            value={limit}
            onChange={(e) => {
                setLimit(
                    Number(e.target.value)
                )
                setPage(1)
            }}
            className="border rounded-xl px-3 py-2" >

            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={80}>80</option>
        </select>

        <span className="text-gray-500">
            utilisateurs
        </span>
    </div>

    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() =>
            setPage(page - 1)
        }

        className={`px-4 py-2 rounded-xl transition
            ${
                page === 1
                ?
                "bg-gray-200 text-gray-400 cursor-not-allowed"
                :
                "bg-purple-600 text-white hover:bg-purple-700"
            }
                `}
      >
        Précédent
      </button>

    {
Array.from(
    {
        length: totalPages
    }
).map((_, index) => (

<button
    key={index}
    onClick={() =>
        setPage(index + 1)
    }

    className={`
        w-10
        h-10
        rounded-xl

        ${
            page === index + 1

            ?

            "bg-purple-600 text-white"

            :

            "bg-gray-200 hover:bg-gray-300"

        }
    `}
>

    {index + 1}

</button>

))

}

<button

    disabled={page === totalPages}

    onClick={() =>

        setPage(page + 1)

    }

    className={`px-4 py-2 rounded-xl transition
        ${
            page === totalPages
            ?
            "bg-gray-200 text-gray-400 cursor-not-allowed"
            :
            "bg-purple-600 text-white hover:bg-purple-700"
        }
    `}
>
    Suivant
</button>
</div>
</div>

            <DeleteUserModal  
        isOpen={isDeleteOpen}
        user={selectedUser}
        isCurrentUser={
              selectedUser?._id === currentUser?._id
        }
        onClose={() => {
              setIsDeleteOpen(false)
              setSelectedUser(null)
        }}
        onConfirm={deleteUser}
            />

          <StatusUserModal
            isOpen={statusModalOpen}
            user={selectedStatusUser}
            activate={activateUser}
            onClose={() => {
               setStatusModalOpen(false)
               setSelectedStatusUser(null)
            }}
            onConfirm={changeStatus}
          />

          <ForbiddenActionModal
            isOpen={forbiddenOpen}
            title={forbiddenTitle}
            message={forbiddenMessage}
            onClose={() => {
                setForbiddenOpen(false)
            }}
          />

    </AdminLayout>
  )
}

export default Users