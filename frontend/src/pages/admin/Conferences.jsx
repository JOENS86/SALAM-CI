import AdminLayout from "../../layouts/AdminLayout"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../services/api"
import {
  FaSearch,
  FaEye,
  FaBan,
  FaTrash,
  FaVideo,
  FaCalendarAlt,
  FaCheckCircle,
  FaPlus
} from "react-icons/fa"

// =========================
// COMPOSANT
// =========================
function Conferences() {

  const navigate = useNavigate()

    // =========================
    // DONNEES
    // =========================
    const [conferences, setConferences] = useState([])

    // =========================
    // STATISTIQUES
    // =========================
    const [stats, setStats] = useState({

      total: 0,
  
      pending: 0,
  
      approved: 0,
  
      rejected: 0
  
  });

    // =========================
    // RECHERCHE
    // =========================
    const [search, setSearch] = useState("")

    // =========================
    // FILTRE
    // =========================
    const [statusFilter, setStatusFilter] = useState("Tout")

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
// CREATION CONFERENCE
// =========================
const [showCreateModal, setShowCreateModal] = useState(false)
const [creatingConference, setCreatingConference] = useState(false)
const [newConference, setNewConference] = useState({
    title: "",
    date: "",
    time: "",
    duration: 60,
    maxParticipants: 50,
    description: ""
})

    // =====================================================
    // RECUPERER LES DEMANDES EN ATTENTE
    // =====================================================
    const getConferences = async () => {

        try {

            setLoading(true)

            const res = await API.get(

                "/conference-requests/pending"

            )

        const requests = Array.isArray(res.data.requests)
            ? res.data.requests
            : [];
        
        setConferences(requests);
        setTotalConferences(requests.length);       
        setTotalPages(1);
        setStats({
        
            total: requests.length,
            pending: requests.filter(
                request => request.status === "pending"
            ).length,
            approved: requests.filter(
                request => request.status === "approved"
            ).length,
            rejected: requests.filter(
                request => request.status === "rejected"
            ).length
        
        });

        }

        catch (error) {

          console.error("Erreur getConferences :", error);
          setConferences([]);
          setStats({
      
              total: 0,
              pending: 0,
              approved: 0,
              rejected: 0
      
          });
      
      }

        finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        getConferences()

    }, [])

    // =====================================================
    // DETAILS
    // =====================================================
    const handleViewConference = (conference) => {

        setSelectedConference(conference)

        setShowModal(true)

    }

// =====================================================
// REFUSER UNE DEMANDE
// =====================================================
const rejectConference = async (id) => {

  try {

      const res = await API.put(

          `/conference-requests/${id}/reject`,

          {

              adminComment: ""

          }

      );

      console.log(res.data);

      await getConferences();

  }

  catch (error) {

      console.error(error.response?.data || error);

  }

};

// =====================================================
// APPROUVER UNE DEMANDE (PUBLIER)
// =====================================================
const approveConference = async (id) => {

  try {

      const res = await API.put(

          `/conference-requests/${id}/approve`

      );

      console.log(res.data);

      await getConferences();

  }

  catch (error) {

      console.error(error.response?.data || error);

  }

};

// ====================================================
// SUPPRIMER UNE DEMANDE
// ====================================================
const deleteConference = async () => {

  try {

      await API.delete(

          `/conference-requests/${conferenceToDelete._id}`

      );

      setShowDeleteModal(false);

      setConferenceToDelete(null);

      await getConferences();

  }

  catch (error) {

      console.error(error.response?.data || error);

  }

}

// =====================================================
// CREER UNE CONFERENCE
// =====================================================
const createConference = async (e) => {

  e.preventDefault()

  const today = new Date().toISOString().split("T")[0];

if (newConference.date < today) {

    alert(
        "La date de la conférence ne peut pas être antérieure à aujourd'hui."
    );

    return;
} 

  try {

      setCreatingConference(true)

      const res = await API.post(
          "/conferences",
          newConference
      )

      console.log(
          "✅ Conférence créée :",
          res.data
      )

      // Fermer la modal
      setShowCreateModal(false)

      // Réinitialiser le formulaire
      setNewConference({
          title: "",
          date: "",
          time: "",
          duration: 60,
          maxParticipants: 50,
          description: ""
      })

      // Actualiser les données
      await getConferences()

  }

  catch (error) {

    console.error("❌ ERREUR COMPLETE :", error);
    console.error("❌ RESPONSE :", error.response);
    console.error("❌ DATA :", error.response?.data);

    alert(
        JSON.stringify(
            error.response?.data || error.message,
            null,
            2
        )
    );

}

  finally {

      setCreatingConference(false)

  }

}

    // =====================================================
    // FILTRE
    // =====================================================

    const statusMap = {

      Tout: "all",
  
      "En attente": "pending",
  
      Acceptée: "approved",
  
      Refusée: "rejected"
  
  };

    const filteredConferences = conferences.filter(

        (conference) => {

          const matchesSearch =

          conference.title
              ?.toLowerCase()
              .includes(search.toLowerCase())
      
          ||
      
          conference.teacher?.name
              ?.toLowerCase()
              .includes(search.toLowerCase())
      
          ||
      
          conference.course?.title
              ?.toLowerCase()
              .includes(search.toLowerCase());

              const matchesStatus =

              statusFilter === "Tout"
          
              ||
          
              conference.status === statusMap[statusFilter];

            return (

                matchesSearch && matchesStatus

            )

        }

    )

    return (

    <AdminLayout>

{/* HEADER */}

<div className="mb-10 flex items-start justify-between">

  <div>

    <h1 className="text-4xl font-bold">
      Demandes de conférences
    </h1>

    <p className="text-gray-500 mt-2">
      Gérez les demandes envoyées par les enseignants.
    </p>

  </div>

  {/* BOUTON CREER */}

  <div className="flex items-center gap-3">

{/* VOIR LES CONFERENCES */}

<button
  onClick={() => navigate("/admin-conferences/list")}
  className="
    bg-indigo-600
    hover:bg-indigo-700
    text-white
    px-6
    py-3
    rounded-xl
    flex
    items-center
    gap-2
    font-semibold
    shadow-md
    hover:shadow-lg
    transition
  "
>
  <FaVideo />
  Voir les conférences
</button>


{/* CREER UNE CONFERENCE */}

<button
  onClick={() => setShowCreateModal(true)}
  className="
    bg-purple-600
    hover:bg-purple-700
    text-white
    px-6
    py-3
    rounded-xl
    flex
    items-center
    gap-2
    font-semibold
    shadow-md
    hover:shadow-lg
    transition
  "
>
  <FaPlus />
  Créer une conférence
</button>

</div>

</div>


      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
         Total demandes
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
         En attente
      </p>

      <h2 className="text-4xl font-bold mt-2 text-blue-600">
      {stats.pending || 0}
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
        Approuvées
      </p>

      <h2 className="text-4xl font-bold mt-2 text-green-600">
      {stats.approved || 0}
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
          placeholder="Rechercher une demande..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="flex-1 outline-none"
        />
        
        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
            <option>Tout</option>
            <option>En attente</option>
            <option>Acceptée</option>
            <option>Refusée</option>
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
                {conference.teacher?.name || "Inconnu"}
                  </td>

                <td>
                {conference.date
                  ? new Date(conference.date).toLocaleDateString("fr-FR")
                  : "-"}                
                </td>

                <td>
                {conference.maxParticipants}
                </td>

                <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm
                    ${
                        conference.status === "approved"
                        ? "bg-green-100 text-green-600"

                        : conference.status === "rejected"
                        ? "bg-red-100 text-red-600"

                        : "bg-orange-100 text-orange-600"
                      }
                          `}
                >

                  {
                    conference.status === "pending"
                    ? "En attente"

                    : conference.status === "approved"
                    ? "Acceptée"

                    : "Refusée"
                  }

                </span>

                </td>

                <td>

                  <div className="flex gap-4 text-lg">

                    <button
                      onClick={() => handleViewConference(conference)}
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <FaEye />
                    </button>

                    {
                      conference.status === "pending" && (
                        <button
                          onClick={() => rejectConference(conference._id)}
                          className="text-orange-500 hover:scale-110 transition"
                        >
                          <FaBan />
                        </button>
                      )
                    }

                    {
                      conference.status === "pending" && (
                        <button
                          onClick={() => approveConference(conference._id)}
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
              Aucune demande trouvée
              </h2>
            
              <p className="text-gray-500 mt-2">
              Aucune demande ne correspond à votre recherche.              </p>         
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
                  <strong>Cours :</strong>{" "}
                      {selectedConference.course?.title}
                    </p>

                    <p>
                 <strong>Heure :</strong>{" "}
                      {selectedConference.time}
                    </p>

                    <p>
                 <strong>Durée :</strong>{" "}
                    {selectedConference.duration} min
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
                        selectedConference.date
                      ).toLocaleDateString("fr-FR")}
                    </p>

                    <p>
                  <strong>Participants :</strong>
                      {selectedConference.maxParticipants}
                    </p>

                    <p>
                  <strong>Statut :</strong>
                    {
              selectedConference.status === "pending"
                ? "En attente"
                : selectedConference.status === "approved"
                ? "Acceptée"
                : "Refusée"
                    } 
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
                  Supprimer la demande
                  </h2>

                  <p className="mt-4 text-gray-600">
                  Voulez-vous vraiment supprimer cette demande de conférence ?
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

{/* =====================================================
    MODAL CREATION CONFERENCE
===================================================== */}
{
    showCreateModal && (

        <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
        ">

            <div className="
                bg-white
                rounded-3xl
                p-8
                w-full
                max-w-2xl
                shadow-2xl
            ">

                {/* TITRE */}

                <div className="flex items-center gap-3 mb-6">

                    <div className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-purple-100
                        text-purple-600
                        flex
                        items-center
                        justify-center
                    ">

                        <FaVideo />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            Créer une conférence
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Créez directement une nouvelle conférence.
                        </p>

                    </div>

                </div>


                {/* FORMULAIRE */}

                <form
                    onSubmit={createConference}
                    className="space-y-5"
                >

                    {/* TITRE */}

                    <div>

                        <label className="
                            block
                            font-semibold
                            mb-2
                        ">
                            Titre de la conférence
                        </label>

                        <input
                            type="text"
                            required
                            value={newConference.title}
                            onChange={(e) =>
                                setNewConference({
                                    ...newConference,
                                    title: e.target.value
                                })
                            }
                            placeholder="Ex : Introduction à l'intelligence artificielle"
                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:ring-2
                                focus:ring-purple-500
                            "
                        />

                    </div>


                    {/* DATE + HEURE */}

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">
                                Date
                            </label>

                            <input
                              type="date"
                              required
                              min={new Date().toISOString().split("T")[0]}
                              value={newConference.date}
                              onChange={(e) =>
                                setNewConference({
                                  ...newConference,
                                  date: e.target.value
                                })
                              }
                              className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:ring-2
                                focus:ring-purple-500
                              "
                            />

                        </div>


                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">
                                Heure
                            </label>

                            <input
                                type="time"
                                required
                                value={newConference.time}
                                onChange={(e) =>
                                    setNewConference({
                                        ...newConference,
                                        time: e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                "
                            />

                        </div>

                    </div>


                    {/* DUREE + PARTICIPANTS */}

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">
                                Durée (minutes)
                            </label>

                            <input
                                type="number"
                                min="1"
                                required
                                value={newConference.duration}
                                onChange={(e) =>
                                    setNewConference({
                                        ...newConference,
                                        duration: Number(e.target.value)
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                "
                            />

                        </div>


                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">
                                Nombre maximum de participants
                            </label>

                            <input
                                type="number"
                                min="1"
                                required
                                value={newConference.maxParticipants}
                                onChange={(e) =>
                                    setNewConference({
                                        ...newConference,
                                        maxParticipants: Number(e.target.value)
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                "
                            />

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label className="
                            block
                            font-semibold
                            mb-2
                        ">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            value={newConference.description}
                            onChange={(e) =>
                                setNewConference({
                                    ...newConference,
                                    description: e.target.value
                                })
                            }
                            placeholder="Décrivez brièvement la conférence..."
                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                resize-none
                                focus:ring-2
                                focus:ring-purple-500
                            "
                        />

                    </div>


                    {/* BOUTONS */}

                    <div className="
                        flex
                        justify-end
                        gap-4
                        pt-4
                    ">

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                text-gray-700
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            disabled={creatingConference}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-purple-600
                                text-white
                                font-semibold
                                hover:bg-purple-700
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <FaPlus />

                            {
                                creatingConference
                                    ? "Création..."
                                    : "Créer la conférence"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )
}

    </AdminLayout>

  )
}

export default Conferences