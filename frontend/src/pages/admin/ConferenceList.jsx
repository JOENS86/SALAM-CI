import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import {
  FaArrowLeft,
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaEye,
  FaTrash
} from "react-icons/fa";

function ConferenceList() {

  const navigate = useNavigate();

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conferenceToDelete, setConferenceToDelete] = useState(null);

  // =====================================================
  // RECUPERER LES CONFERENCES
  // =====================================================

  const getConferences = async () => {

    try {

      setLoading(true);

      const res = await API.get("/conferences");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.conferences || [];

      setConferences(data);

    }

    catch (error) {

      console.error(
        "❌ Erreur récupération conférences :",
        error.response?.data || error
      );

      setConferences([]);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    getConferences();

  }, []);


  // =====================================================
  // SUPPRIMER UNE CONFERENCE
  // =====================================================
  const deleteConference = async () => {

    if (!conferenceToDelete) return;
  
    try {
  
      await API.delete(
        `/conferences/${conferenceToDelete._id}`
      );
  
      setConferenceToDelete(null);
  
      await getConferences();
  
    }
  
    catch (error) {
  
      console.error(
        "❌ Erreur suppression :",
        error.response?.data || error
      );
  
      alert(
        error.response?.data?.message ||
        "Impossible de supprimer la conférence."
      );
  
    }
  
  };


  // =====================================================
  // STATUT
  // =====================================================

  const getStatus = (conference) => {

    if (conference.status === "completed") {
      return {
        label: "Terminée",
        className: "bg-gray-100 text-gray-600"
      };
    }

    if (conference.status === "live") {
      return {
        label: "En direct",
        className: "bg-red-100 text-red-600"
      };
    }

    if (conference.status === "cancelled") {
      return {
        label: "Annulée",
        className: "bg-red-100 text-red-600"
      };
    }

    return {
      label: "À venir",
      className: "bg-green-100 text-green-600"
    };

  };


  return (

    <AdminLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <button
          onClick={() => navigate("/admin-conferences")}
          className="
            flex
            items-center
            gap-2
            text-gray-600
            hover:text-purple-600
            transition
            mb-5
          "
        >
          <FaArrowLeft />
          Retour aux demandes
        </button>


        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Mes conférences
            </h1>

            <p className="text-gray-500 mt-2">
              Consultez les conférences créées par l'administration.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <div className="
        bg-white
        rounded-3xl
        shadow-sm
        overflow-hidden
      ">

        {loading ? (

          <div className="
            py-24
            flex
            flex-col
            items-center
          ">

            <div className="
              w-14
              h-14
              border-4
              border-purple-600
              border-t-transparent
              rounded-full
              animate-spin
            "></div>

            <p className="mt-5 text-gray-500">
              Chargement des conférences...
            </p>

          </div>

        ) : conferences.length === 0 ? (

          <div className="
            py-24
            text-center
          ">

            <div className="
              w-20
              h-20
              mx-auto
              rounded-full
              bg-purple-100
              text-purple-600
              flex
              items-center
              justify-center
              text-3xl
              mb-5
            ">

              <FaVideo />

            </div>

            <h2 className="text-2xl font-bold">
              Aucune conférence
            </h2>

            <p className="text-gray-500 mt-2">
              Aucune conférence n'a encore été créée.
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-5">
                  Conférence
                </th>

                <th className="text-left">
                  Date
                </th>

                <th className="text-left">
                  Heure
                </th>

                <th className="text-left">
                  Durée
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

              {conferences.map((conference) => {

                const status = getStatus(conference);

                return (

                  <tr
                    key={conference._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* CONFERENCE */}

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="
                          w-10
                          h-10
                          rounded-xl
                          bg-purple-100
                          text-purple-600
                          flex
                          items-center
                          justify-center
                        ">

                          <FaVideo />

                        </div>

                        <div>

                          <p className="font-semibold">
                            {conference.title}
                          </p>

                          {conference.description && (

                            <p className="
                              text-sm
                              text-gray-400
                              max-w-xs
                              truncate
                            ">
                              {conference.description}
                            </p>

                          )}

                        </div>

                      </div>

                    </td>


                    {/* DATE */}

                    <td>

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <FaCalendarAlt className="text-purple-600" />

                        {conference.date
                          ? new Date(
                              conference.date
                            ).toLocaleDateString("fr-FR")
                          : "-"
                        }

                      </div>

                    </td>


                    {/* HEURE */}

                    <td>

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <FaClock className="text-purple-600" />

                        {conference.time || "-"}

                      </div>

                    </td>


                    {/* DUREE */}

                    <td>

                      {conference.duration || 0} min

                    </td>


                    {/* PARTICIPANTS */}

                    <td>

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <FaUsers className="text-purple-600" />

                        0/{conference.maxParticipants || 0}

                      </div>

                    </td>


                    {/* STATUT */}

                    <td>

                      <span className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${status.className}
                      `}>

                        {status.label}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="
                        flex
                        items-center
                        gap-4
                        text-lg
                      ">

                        <button
                          onClick={() =>
                            navigate(
                              `/conference-details/${conference._id}`
                            )
                          }
                          className="
                          w-9
                          h-9
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          hover:bg-blue-600
                          hover:text-white
                          transition
                          "
                          title="Voir la conférence"
                        >

                          <FaEye />

                        </button>


                        <button
                          onClick={() =>
                           setConferenceToDelete(conference)
                          }
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-red-50
                            text-red-600
                            flex
                            items-center
                            justify-center
                            hover:bg-red-600
                            hover:text-white
                            transition
                          "
                           title="Supprimer la conférence"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </div>

{/* =====================================================
    MODALE CONFIRMATION SUPPRESSION
===================================================== */}
{conferenceToDelete && (

<div className="
  fixed
  inset-0
  z-50
  flex
  items-center
  justify-center
  bg-black/50
  backdrop-blur-sm
">

  <div className="
    w-full
    max-w-md
    bg-white
    rounded-3xl
    shadow-2xl
    p-8
    text-center
  ">

    {/* ICONE */}

    <div className="
      w-16
      h-16
      mx-auto
      mb-5
      flex
      items-center
      justify-center
      rounded-full
      bg-gray-100
      text-gray-400
      text-3xl
    ">

      <FaTrash />

    </div>


    {/* TITRE */}

    <h2 className="
      text-2xl
      font-bold
      text-gray-900
    ">
      {conferenceToDelete.status === "scheduled"
      ? "Annuler la conférence"
      : "Supprimer la conférence"
      }
    </h2>


    {/* MESSAGE */}

    <p className="
      text-gray-600
      mt-4
      leading-relaxed
    ">

{conferenceToDelete.status === "scheduled"
  ? "Voulez-vous vraiment annuler cette conférence ?"
  : "Voulez-vous vraiment supprimer cette conférence ?"
}
    </p>


    {/* NOM */}

    <p className="
      text-xl
      font-bold
      text-gray-900
      mt-2
    ">

      {conferenceToDelete.title}

    </p>


    {/* AVERTISSEMENT */}

    <p className="
      text-red-500
      mt-5
      text-sm
    ">

      Cette action est irréversible.

    </p>


    {/* BOUTONS */}

    <div className="
      flex
      justify-center
      gap-3
      mt-7
    ">

      {/* ANNULER et SUPPRIMER */}

      <button
        onClick={deleteConference}
        className="
          px-5
          py-2.5
          rounded-xl
          bg-red-600
          text-white
          hover:bg-red-700
          transition
          font-medium
        "
      >
        {conferenceToDelete.status === "scheduled"
          ? "Annuler"
          : "Supprimer"
        }
      </button>

    </div>

  </div>

</div>

)}

    </AdminLayout>

  );

}

export default ConferenceList;