import {
  FaArrowLeft,
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaVideo
} from "react-icons/fa";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import axios from "axios";


function ConferenceDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [conference, setConference] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [startingConference, setStartingConference] = useState(false);

  // =====================================================
  // RECUPERER LA CONFERENCE
  // =====================================================

  useEffect(() => {

      const fetchConference = async () => {

          try {

              setLoading(true);

              setError("");


              const token =
                  localStorage.getItem("token");


              const response = await axios.get(

                  `http://localhost:5000/api/conferences/${id}`,

                  {
                      headers: token
                          ? {
                              Authorization: `Bearer ${token}`
                          }
                          : {}
                  }

              );


              console.log(
                  "✅ Conférence récupérée :",
                  response.data
              );


              setConference(
                  response.data.conference
              );


          }

          catch (error) {

              console.error(
                  "❌ Erreur récupération conférence :",
                  error.response?.data || error
              );


              setError(
                  error.response?.data?.message ||
                  "Impossible de récupérer la conférence."
              );

          }

          finally {

              setLoading(false);

          }

      };


      if (id) {

          fetchConference();

      }

  }, [id]);

// =====================================================
// VERIFIER AUTOMATIQUEMENT L'HEURE
// =====================================================
useEffect(() => {

  const interval = setInterval(() => {

      setCurrentTime(new Date());

  }, 1000);

  return () => clearInterval(interval);

}, []);

  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {

      return (

          <div
              className="
              min-h-screen
              flex
              items-center
              justify-center
              bg-[#f8fafc]
              "
          >

              <div className="text-center">

                  <div
                      className="
                      w-12
                      h-12
                      border-4
                      border-purple-200
                      border-t-purple-600
                      rounded-full
                      animate-spin
                      mx-auto
                      mb-4
                      "
                  />

                  <p className="text-gray-500">
                      Chargement de la conférence...
                  </p>

              </div>

          </div>

      );

  }


  // =====================================================
  // ERREUR
  // =====================================================

  if (error || !conference) {

      return (

          <div
              className="
              min-h-screen
              flex
              flex-col
              items-center
              justify-center
              bg-[#f8fafc]
              "
          >

              <div className="text-center">

                  <FaVideo
                      className="
                      text-purple-500
                      text-5xl
                      mx-auto
                      mb-5
                      "
                  />

                  <h1 className="text-2xl font-bold mb-2">
                      Conférence introuvable
                  </h1>

                  <p className="text-gray-500 mb-6">
                      {error ||
                          "Cette conférence n'existe plus."}
                  </p>

                  <button
                      onClick={() =>
                          navigate("/admin-conferences/list")
                      }
                      className="
                      bg-purple-600
                      hover:bg-purple-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-semibold
                      transition
                      "
                  >
                      Retour aux conférences
                  </button>

              </div>

          </div>

      );

  }


  // =====================================================
  // DONNEES
  // =====================================================

  const teacherName =
      conference.teacher?.name ||
      "Administration";


  const courseName =
      conference.course?.title ||
      "Conférence générale";


  const currentParticipants =
      conference.currentParticipants || 0;


  const maxParticipants =
      conference.maxParticipants || 0;


  const duration =
      conference.duration || 60;

// =====================================================
// VERIFIER SI L'HEURE DE LA CONFERENCE EST ARRIVEE
// =====================================================
let conferenceStartTime = null;

if (conference.scheduledAt) {

    conferenceStartTime = new Date(
        conference.scheduledAt
    );

}
else if (conference.date && conference.time) {

    conferenceStartTime = new Date(
        `${new Date(conference.date)
            .toISOString()
            .split("T")[0]}T${conference.time}`
    );

}

const isStartTimeReached =
    conferenceStartTime &&
    Date.now() >= conferenceStartTime.getTime();

    console.log("===== VERIFICATION HEURE =====");
console.log("Heure actuelle :", new Date());
console.log("scheduledAt :", conference.scheduledAt);
console.log("date :", conference.date);
console.log("time :", conference.time);
console.log("conferenceStartTime :", conferenceStartTime);
console.log(
    "isStartTimeReached :",
    isStartTimeReached
);
console.log("==============================");


  // =====================================================
  // DATE
  // =====================================================

  const formattedDate = conference.date
      ? new Date(conference.date).toLocaleDateString(
          "fr-FR",
          {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
          }
      )
      : "Date non définie";


  // =====================================================
  // STATUT
  // =====================================================

  let statusLabel = "À venir";

  let statusClass =
      "bg-blue-100 text-blue-700";


  if (conference.status === "live") {

      statusLabel = "En direct";

      statusClass =
          "bg-red-100 text-red-700";

  }

  else if (
      conference.status === "completed"
  ) {

      statusLabel = "Terminée";

      statusClass =
          "bg-green-100 text-green-700";

  }

  else if (
      conference.status === "cancelled"
  ) {

      statusLabel = "Annulée";

      statusClass =
          "bg-red-100 text-red-700";

  }


  // =====================================================
  // POURCENTAGE PARTICIPATION
  // =====================================================

  const participationPercentage =
      maxParticipants > 0
          ? Math.min(
              100,
              Math.round(
                  (currentParticipants /
                      maxParticipants) *
                  100
              )
          )
          : 0;

// =====================================================
// LANCER LA CONFERENCE
// =====================================================
const handleStartConference = async () => {

  try {

      setStartingConference(true);

      const token =
          localStorage.getItem("token");

      const response = await axios.put(

          `http://localhost:5000/api/conferences/${conference._id}/start`,

          {},

          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          }

      );

      console.log(
          "✅ Conférence démarrée :",
          response.data
      );

      // Mettre immédiatement l'état à jour
      setConference(
          response.data.conference
      );

      // Aller dans la salle
      navigate(
          `/conference-live/${conference._id}`
      );

  }

  catch (error) {

      console.error(
          "❌ Erreur lancement conférence :",
          error.response?.data || error
      );

      alert(
          error.response?.data?.message ||
          "Impossible de lancer la conférence."
      );

  }

  finally {

      setStartingConference(false);

  }

};


  return (

      <div
          className="
          min-h-screen
          bg-[#f8fafc]
          py-10
          "
      >

          <div
              className="
              max-w-7xl
              mx-auto
              px-6
              "
          >


              {/* =========================================
                  RETOUR
              ========================================== */}

              <button
                  onClick={() =>
                      navigate("/admin-conferences/list")
                  }
                  className="
                  flex
                  items-center
                  gap-3
                  mb-8
                  font-medium
                  hover:text-purple-600
                  transition
                  "
              >

                  <FaArrowLeft />

                  Retour aux conférences

              </button>


              {/* =========================================
                  CONTENU
              ========================================== */}

              <div
                  className="
                  grid
                  lg:grid-cols-3
                  gap-8
                  "
              >


                  {/* =====================================
                      PARTIE PRINCIPALE
                  ====================================== */}

                  <div
                      className="
                      lg:col-span-2
                      "
                  >


                      {/* IMAGE */}

                      <div
                          className="
                          w-full
                          h-[420px]
                          rounded-3xl
                          overflow-hidden
                          shadow-lg
                          bg-gradient-to-br
                          from-purple-600
                          to-indigo-700
                          flex
                          items-center
                          justify-center
                          "
                      >

                          {conference.image ? (

                              <img
                                  src={conference.image}
                                  alt={conference.title}
                                  className="
                                  w-full
                                  h-full
                                  object-cover
                                  "
                              />

                          ) : (

                              <FaVideo
                                  className="
                                  text-white
                                  text-7xl
                                  opacity-80
                                  "
                              />

                          )}

                      </div>


                      {/* TITRE */}

                      <div className="mt-8">

                          <div
                              className="
                              flex
                              justify-between
                              items-start
                              gap-5
                              "
                          >

                              <div>

                                  <h1
                                      className="
                                      text-4xl
                                      font-bold
                                      text-gray-900
                                      "
                                  >
                                      {conference.title}
                                  </h1>

                                  <p
                                      className="
                                      text-gray-500
                                      text-lg
                                      mt-3
                                      "
                                  >
                                      {conference.description ||
                                          "Aucune description disponible."}
                                  </p>

                              </div>


                              <span
                                  className={`
                                  shrink-0
                                  px-4
                                  py-2
                                  rounded-full
                                  text-sm
                                  font-semibold
                                  ${statusClass}
                                  `}
                              >

                                  {statusLabel}

                              </span>

                          </div>

                      </div>


                      {/* =================================
                          A PROPOS
                      ================================== */}

                      <div
                          className="
                          mt-10
                          border-t
                          pt-8
                          "
                      >

                          <h2
                              className="
                              text-3xl
                              font-bold
                              mb-8
                              "
                          >
                              À propos de cette conférence
                          </h2>


                          <div className="space-y-8">


                              {/* CREATEUR / ENSEIGNANT */}

                              <div className="flex gap-4">

                                  <FaUserTie
                                      className="
                                      text-purple-600
                                      text-xl
                                      mt-1
                                      "
                                  />

                                  <div>

                                      <h3 className="font-semibold">
                                          Organisateur
                                      </h3>

                                      <p className="text-gray-500">
                                          {teacherName}
                                      </p>

                                  </div>

                              </div>


                              {/* COURS */}

                              <div className="flex gap-4">

                                  <FaVideo
                                      className="
                                      text-purple-600
                                      text-xl
                                      mt-1
                                      "
                                  />

                                  <div>

                                      <h3 className="font-semibold">
                                          Cours
                                      </h3>

                                      <p className="text-gray-500">
                                          {courseName}
                                      </p>

                                  </div>

                              </div>


                              {/* DATE */}

                              <div className="flex gap-4">

                                  <FaCalendarAlt
                                      className="
                                      text-purple-600
                                      text-xl
                                      mt-1
                                      "
                                  />

                                  <div>

                                      <h3 className="font-semibold">
                                          Date
                                      </h3>

                                      <p className="text-gray-500 capitalize">
                                          {formattedDate}
                                      </p>

                                  </div>

                              </div>


                              {/* HEURE / DUREE */}

                              <div className="flex gap-4">

                                  <FaClock
                                      className="
                                      text-purple-600
                                      text-xl
                                      mt-1
                                      "
                                  />

                                  <div>

                                      <h3 className="font-semibold">
                                          Heure et durée
                                      </h3>

                                      <p className="text-gray-500">
                                          {conference.time ||
                                              "--:--"}{" "}
                                          •{" "}
                                          {duration} min
                                      </p>

                                  </div>

                              </div>


                              {/* PARTICIPANTS */}

                              <div className="flex gap-4">

                                  <FaUsers
                                      className="
                                      text-purple-600
                                      text-xl
                                      mt-1
                                      "
                                  />

                                  <div>

                                      <h3 className="font-semibold">
                                          Participants
                                      </h3>

                                      <p className="text-gray-500">

                                          {currentParticipants}
                                          /
                                          {maxParticipants}

                                          {" "}participants

                                      </p>

                                  </div>

                              </div>


                          </div>

                      </div>


                  </div>


                  {/* =====================================
                      COLONNE DROITE
                  ====================================== */}

                  <div>

                      <div
                          className="
                          bg-white
                          rounded-3xl
                          p-8
                          shadow-lg
                          sticky
                          top-8
                          "
                      >

                          <h2
                              className="
                              font-bold
                              text-xl
                              mb-6
                              "
                          >
                              Informations
                          </h2>


                          {/* PARTICIPANTS */}

                          <div className="mb-8">

                              <div
                                  className="
                                  flex
                                  justify-between
                                  mb-3
                                  "
                              >

                                  <span>
                                      Participants
                                  </span>

                                  <span className="font-semibold">

                                      {currentParticipants}/
                                      {maxParticipants}

                                  </span>

                              </div>


                              <div
                                  className="
                                  h-3
                                  bg-gray-200
                                  rounded-full
                                  overflow-hidden
                                  "
                              >

                                  <div
                                      className="
                                      h-3
                                      bg-gradient-to-r
                                      from-indigo-600
                                      to-purple-600
                                      rounded-full
                                      "
                                      style={{
                                          width:
                                              `${participationPercentage}%`
                                      }}
                                  />

                              </div>

                          </div>


                          {/* TYPE */}

                          <div
                              className="
                              p-4
                              bg-purple-50
                              rounded-2xl
                              mb-6
                              "
                          >

                              <p
                                  className="
                                  text-sm
                                  text-gray-500
                                  "
                              >
                                  Type de conférence
                              </p>

                              <p
                                  className="
                                  font-semibold
                                  text-purple-700
                                  mt-1
                                  "
                              >

                                  {conference.createdBy
                                      ? "Créée par l'administration"
                                      : conference.teacher
                                          ? "Conférence enseignante"
                                          : "Conférence générale"}

                              </p>

                          </div>


{/* =====================================
    ACTION
====================================== */}

{conference.status === "live" ? (

<button
    onClick={() =>
        navigate(
            `/conference-live/${conference._id}`
        )
    }
    className="
    w-full
    bg-red-600
    hover:bg-red-700
    text-white
    py-4
    rounded-2xl
    font-semibold
    transition
    "
>

    🎥 Rejoindre la conférence

</button>

) : conference.status === "completed" ? (

<button
    onClick={() =>
        navigate(
            `/conference-replay/${conference._id}`
        )
    }
    className="
    w-full
    bg-green-600
    hover:bg-green-700
    text-white
    py-4
    rounded-2xl
    font-semibold
    transition
    "
>

    Voir le replay

</button>

) : conference.status === "scheduled" &&
conference.createdBy &&
isStartTimeReached ? (

<button
    onClick={handleStartConference}
    disabled={startingConference}
    className="
    w-full
    bg-gradient-to-r
    from-indigo-600
    to-purple-600
    hover:from-indigo-700
    hover:to-purple-700
    text-white
    py-4
    rounded-2xl
    font-semibold
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
    "
>

    {startingConference
        ? "Lancement..."
        : "🎥 Lancer la conférence"}

</button>

) : (

<div
    className="
    w-full
    bg-gray-100
    text-gray-600
    py-4
    rounded-2xl
    font-semibold
    text-center
    "
>

    Conférence programmée

</div>

)}

                      </div>

                  </div>

              </div>

          </div>

      </div>

  );

}


export default ConferenceDetails;