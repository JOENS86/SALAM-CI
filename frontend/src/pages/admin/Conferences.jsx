import AdminLayout from "../../layouts/AdminLayout"
import { useEffect, useState } from "react"
import API from "../../services/api"
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

// =========================
// DONNEES
// =========================
const [conferences, setConferences] = useState([])

// =========================
// STATISTIQUES
// =========================
const [stats, setStats] = useState({})

// =========================
// RECHERCHE
// =========================
const [search, setSearch] = useState("")

// =========================
// FILTRE
// =========================
const [statusFilter, setStatusFilter] = useState("Tous")

// =========================
// PAGINATION
// =========================
const [page, setPage] = useState(1)
const [limit] = useState(10)
const [totalPages, setTotalPages] = useState(1)
const [totalConferences, setTotalConferences] = useState(0)

// =========================
// LOADER
// =========================
const [loading, setLoading] = useState(true)

// =========================
// DETAILS
// =========================
const [selectedConference, setSelectedConference] = useState(null)
const [showModal, setShowModal] = useState(false)

// =========================
// SUPPRESSION
// =========================
const [conferenceToDelete, setConferenceToDelete] = useState(null)
const [showDeleteModal, setShowDeleteModal] = useState(false)


// =========================
// RECUPERER LES CONFERENCES
// =========================
const getConferences = async () => {

  try {

      setLoading(true)

      const res = await API.get(
          `/conferences?page=${page}&limit=${limit}`
      )

      setConferences(res.data.conferences)

      setTotalPages(res.data.totalPages)

      setTotalConferences(res.data.totalConferences)

  }

  catch(error){

      console.log(error)

  }

  finally{

      setLoading(false)

  }

}


// =========================
// STATISTIQUES
// =========================
const getStats = async () => {

  try {

      const res = await API.get("/conferences/stats")

      setStats(res.data)

  }

  catch (error) {

      console.log(error)

  }

}

useEffect(() => {
  getConferences()
  getStats()
}, [page, limit])


// =========================
// DETAILS
// =========================
const handleViewConference = async (id) => {

  try {

      const res = await API.get(`/conferences/${id}`)

      setSelectedConference(res.data)

      setShowModal(true)

  }

  catch (error) {

      console.log(error)

  }

}


// =========================
// SUSPENDRE UNE CONFERENCE
// =========================
const suspendConference = async (id) => {

  try {

      await API.patch(`/conferences/${id}/suspend`)

      getConferences()

      getStats()

  }

  catch (error) {

      console.log(error)

  }

}

// =========================
// PUBLIER UNE CONFERENCE
// =========================
const publishConference = async (id) => {

  try {

      await API.patch(`/conferences/${id}/publish`)

      getConferences()

      getStats()

  }

  catch (error) {

      console.log(error)

  }

}

// =========================
// SUPPRIMER UNE CONFERENCE
// =========================
const deleteConference = async () => {

  try {

      await API.delete(

          `/conferences/${conferenceToDelete._id}`

      )

      setShowDeleteModal(false)

      setConferenceToDelete(null)

      getConferences()

      getStats()

  }

  catch(error){

      console.log(error)

  }

}


// =========================
// Filtrage
// =========================
const filteredConferences = conferences.filter((conference) => {

  const matchesSearch =

      conference.title
          ?.toLowerCase()
          .includes(search.toLowerCase())

      ||

      conference.teacher?.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

  const matchesStatus =

      statusFilter === "Tous"

      ||

      conference.status === statusFilter

  return matchesSearch && matchesStatus

})


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
      {stats.total || 0}
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
      {stats.published || 0}
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
      {stats.finished || 0}
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
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="flex-1 outline-none"
        />
        
        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
            <option>Tous</option>
            <option>En attente</option>
            <option>Publié</option>
            <option>Suspendu</option>
            <option>Terminée</option>
        </select>


      </div>

      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {
          loading ?
          (
            <div className="py-24 flex flex-col items-center">
              <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-5 text-gray-500">
                Chargement des conférences...
              </p>
            </div>
          )
            :
          (
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

            {
              filteredConferences.length > 0 ?
              (
                filteredConferences.map((conference)=>(

              <tr
                key={conference._id}
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
                <td>
                  {conference.teacher?.name}
                </td>
                </td>

                <td>
                  {new Date(conference.conferenceDate).toLocaleDateString("fr-FR")}
                </td>

                <td>
                  {conference.participantsCount}
                </td>

                <td>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm

                    ${
                      conference.status === "Publié"
                      ? "bg-green-100 text-green-600"
                      : conference.status === "Suspendu"
                      ? "bg-red-100 text-red-600"
                      : conference.status === "Terminée"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-orange-100 text-orange-600"
                     }
`                   }
                  >
                    {conference.status}
                  </span>

                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button
                      onClick={() => handleViewConference(conference._id)}
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <FaEye />
                    </button>

                    {
                      conference.status !== "Suspendu" && (
                        <button
                          onClick={() => suspendConference(conference._id)}
                          className="text-orange-500 hover:scale-110 transition"
                        >
                          <FaBan />
                        </button>
                      )
                    }

                    {
                      conference.status !== "Publié" && (
                        <button
                          onClick={() => publishConference(conference._id)}
                          className="text-green-600 hover:scale-110 transition"
                        >
                          <FaCheckCircle />
                        </button>
                      )
                    }

                    <button
                      onClick={()=>{
                        setConferenceToDelete(conference)
                        setShowDeleteModal(true)
                      }}
                      className="text-red-600 hover:scale-110 transition"
                    >
                      <FaTrash/>
                    </button>

                  </div>

                </td>

              </tr>

                ))
              )
            :
              (
            <tr>
              <td
                colSpan="6"
                className="py-16 text-center"
              >
            
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-4">
                🎥
              </div>
            
              <h2 className="text-2xl font-bold">
                Aucune conférence trouvée
              </h2>
            
              <p className="text-gray-500 mt-2">
                Aucune conférence ne correspond à votre recherche.
              </p>         
            </div>
            
              </td>
            </tr>
              )
            }

          </tbody>

          </table>
        )
      }
      </div>

        {/* PAGINATION */}

    <div className="flex justify-between items-center mt-8">
      <p className="text-gray-500">
        Total :
          <span className="font-semibold ml-2">
            {totalConferences}
          </span>
      </p>

      <div className="flex items-center gap-3">
        <button
          disabled={page===1}
          onClick={()=>setPage(page-1)}
          className={`
            px-5 py-2 rounded-xl
              ${
                page===1
                ?
                "bg-gray-200 text-gray-400"
                :
                "bg-indigo-600 text-white hover:bg-indigo-700"

              }
          `}
        >
          Précédent
        </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page===totalPages}
            onClick={()=>setPage(page+1)}
            className={`
              px-5 py-2 rounded-xl
              ${
                page===totalPages
                ?
                "bg-gray-200 text-gray-400"
                :
                "bg-indigo-600 text-white hover:bg-indigo-700"
              }
            `}
          >
            Suivant
          </button>
      </div>
    </div>

      {
        showModal && selectedConference && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 w-[600px]">
                    <h2 className="text-3xl font-bold mb-6">
                  Détails de la conférence
                    </h2>

              <div className="space-y-4">
                    <p>
                  <strong>Titre :</strong>
                      {selectedConference.title}
                    </p>

                    <p>
                  <strong>Description :</strong>
                      {selectedConference.description}
                  </p>

                    <p>
                  <strong>Enseignant :</strong>
                      {selectedConference.teacher?.name}
                    </p>

                    <p>
                  <strong>Email :</strong>
                      {selectedConference.teacher?.email}
                    </p>

                    <p>
                  <strong>Date :</strong>
                      {new Date(
                        selectedConference.conferenceDate
                      ).toLocaleDateString("fr-FR")}
                    </p>

                    <p>
                  <strong>Participants :</strong>
                      {selectedConference.participantsCount}
                    </p>

                    <p>
                  <strong>Statut :</strong>
                      {selectedConference.status}
                    </p>

                    <p>
                  <strong>Lien :</strong>
                      <a href={selectedConference.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline" >
                        Rejoindre la conférence
                      </a>
                    </p>

              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
                >
                  Fermer
                </button>
              </div>

              </div>
            </div>
          )
        }

        {
          showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 w-[500px]">
                
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    🗑️
                  </div>

                  <h2 className="text-3xl font-bold">
                    Supprimer la conférence
                  </h2>

                  <p className="mt-4 text-gray-600">
                    Voulez-vous vraiment supprimer
                  </p>

                  <p className="font-bold text-xl mt-2">
                    {conferenceToDelete?.title}
                  </p>

                  <p className="text-red-500 mt-4">
                    Cette action est irréversible.
                  </p>
                </div>

              <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={()=>{
                      setShowDeleteModal(false)
                      setConferenceToDelete(null)
                    }}
                    className="px-6 py-2 rounded-xl border"
                  >
                    Annuler
                  </button>

                  <button
                    onClick={deleteConference}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>

              </div>
            </div>
          )
        }

    </AdminLayout>

  )
}

export default Conferences