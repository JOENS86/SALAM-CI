import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import conferenceService from "../../services/conferenceService";
import {
    FaVideo,
    FaUsers,
    FaCalendarAlt,
    FaClock
} from "react-icons/fa";

import {
    errorToast
} from "../../utils/toast";
import StudentConferenceCard from "../../components/conference/StudentConferenceCard";
import socket from "../../socket/socket";

function Conferences() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  
    const [liveConferences, setLiveConferences] = useState([]);
    const [upcomingConferences, setUpcomingConferences] = useState([]);
    const [historyConferences, setHistoryConferences] = useState([]);
  
    const [search, setSearch] = useState("");
    const loadConferences = async () => {

      try {
  
          setLoading(true);
  
          const [
  
              live,
  
              upcoming,
  
              history
  
          ] = await Promise.all([
  
              conferenceService.getLiveConferences(),
  
              conferenceService.getUpcomingConferences(),
  
              conferenceService.getHistoryConferences()
  
          ]);
  
          setLiveConferences(
  
              live.conferences || []
  
          );
  
          setUpcomingConferences(
  
              upcoming.conferences || []
  
          );
  
          setHistoryConferences(
  
              history.conferences || []
  
          );
  
      }
  
      catch (error) {
  
          console.error(error);
  
          errorToast(
  
              "Erreur",
  
              "Impossible de charger les conférences."
  
          );
      }
  
      finally {
  
          setLoading(false);
  
      }
  };
  
  useEffect(() => {
    loadConferences();

    const handleParticipantsUpdated = ({
        roomId,
        count
    }) => {

        console.log(
            "👥 Mise à jour participants :",
            roomId,
            count
        );

        const updateConferenceCount = (list) => {

            return list.map(conference => {

                if (conference._id === roomId) {

                    return {
                        ...conference,
                        currentParticipants: count
                    };

                }

                return conference;

            });

        };

        setLiveConferences(prev =>
            updateConferenceCount(prev)
        );

        setUpcomingConferences(prev =>
            updateConferenceCount(prev)
        );

        setHistoryConferences(prev =>
            updateConferenceCount(prev)
        );

    };

    socket.on(
        "conference:participantsUpdated",
        handleParticipantsUpdated
    );

    return () => {

        socket.off(
            "conference:participantsUpdated",
            handleParticipantsUpdated
        );

    };
}, []);


  useEffect(() => {
    // =====================================================
    // CONFERENCE DEMARREE
    // =====================================================
    socket.on(

        "conference:started",

        () => {

            loadConferences();

        }

    );

    // =====================================================
    // CONFERENCE TERMINEE
    // =====================================================
    socket.on(

        "conference:ended",

        () => {

            loadConferences();

        }

    );

    return () => {

        socket.off("conference:started");

        socket.off("conference:ended");

    };
}, []);


// =====================================================
// TOUTES LES CONFERENCES
// =====================================================
const conferences = [

  ...liveConferences,

  ...upcomingConferences,

  ...historyConferences

];


// =====================================================
// FILTRAGE
// =====================================================
const filterConferences = (list) => {

  return list.filter(conference =>

      conference.title
          .toLowerCase()
          .includes(search.toLowerCase())

  );

};

const live = filterConferences(liveConferences);
const upcoming = filterConferences(upcomingConferences);
const history = filterConferences(historyConferences);

const renderSection = (title, list) => (

  <div className="space-y-6">

      <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold">

              {title}

          </h2>

          <span className="text-gray-500">

              {list.length} conférence(s)

          </span>

      </div>

      {

          list.length === 0

          ?

          (

              <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow">

                  Aucune conférence.

              </div>

          )

          :

          (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                  {

                      list.map(conference => (

                          <StudentConferenceCard

                              key={conference._id}

                              conference={conference}

                              onJoin={() =>

                                  navigate(

                                      `/conference-live/${conference._id}`

                                  )

                              }

                          />

                      ))

                  }

              </div>

          )

      }

  </div>

);


return (

    <DashboardLayout>

        <div className="space-y-8">

            {/* HERO */}

            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-3xl p-10 text-white shadow-2xl">

                <h1 className="text-5xl font-bold flex items-center gap-4">

                    <FaVideo />

                    Conférences

                </h1>

                <p className="mt-4 text-lg text-white/90">

                    Participez aux conférences organisées par vos enseignants.

                </p>

            </div>

            {/* STATISTIQUES */}

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-red-500 text-white rounded-3xl p-6 text-center shadow-lg">

                    <FaVideo className="mx-auto text-3xl" />

                    <h2 className="text-4xl font-bold mt-3">

                        {live.length}

                    </h2>

                    <p>En direct</p>

                </div>

                <div className="bg-blue-500 text-white rounded-3xl p-6 text-center shadow-lg">

                    <FaCalendarAlt className="mx-auto text-3xl" />

                    <h2 className="text-4xl font-bold mt-3">

                        {upcoming.length}

                    </h2>

                    <p>À venir</p>

                </div>

                <div className="bg-green-500 text-white rounded-3xl p-6 text-center shadow-lg">

                    <FaClock className="mx-auto text-3xl" />

                    <h2 className="text-4xl font-bold mt-3">

                        {history.length}

                    </h2>

                    <p>Historique</p>

                </div>

            </div>

            {/* RECHERCHE */}

            <input

                type="text"

                placeholder="Rechercher une conférence..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                className="w-full bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-md outline-none focus:border-purple-500"

            />

            {

                loading

                ?

                (

                    <div className="text-center py-20 text-xl">

                        Chargement des conférences...

                    </div>

                )

                :

                (

                    <div className="space-y-16">

                        {renderSection(

                            "🔴 Conférences en direct",

                            live

                        )}

                        {renderSection(

                            "📅 Conférences à venir",

                            upcoming

                        )}

                        {renderSection(

                            "✔ Historique",

                            history

                        )}

                    </div>

                )

            }

        </div>

    </DashboardLayout>

);

}

export default Conferences