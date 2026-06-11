import { useState } from "react"

import {
  FaVideo,
  FaCalendarAlt,
  FaHistory,
  FaArrowLeft
} from "react-icons/fa"

import { useNavigate } from "react-router-dom"

function ConferenceRoom() {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] =
    useState("live")

  const conferencesLive = [
    {
      id: 1,
      title: "Mathématiques Appliquées"
    }
  ]

  const conferencesUpcoming = [
    {
      id: 2,
      title: "Introduction au Développement Web avec React"
    },
    {
      id: 3,
      title: "Design Thinking et Innovation"
    },
    {
      id: 4,
      title: "Sécurité Informatique et Cybersécurité"
    }
  ]

  const conferencesHistory = [
    {
      id: 5,
      title: "Base de Données et SQL Avancé"
    },
    {
      id: 6,
      title: "Intelligence Artificielle et Machine Learning"
    }
  ]

  const getConferenceImage = (title) => {

    if (title.toLowerCase().includes("math"))
      return "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800"
  
    if (title.toLowerCase().includes("react"))
      return "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
  
    if (title.toLowerCase().includes("design"))
      return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
  
    if (title.toLowerCase().includes("cyber"))
      return "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800"
  
    if (title.toLowerCase().includes("sql"))
      return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800"
  
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
  }

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-indigo-50
      to-purple-50
      p-8
      "
    >

      {/* RETOUR */}

      <button
        onClick={() => navigate("/", { replace: true })}
        className="
        flex
        items-center
        gap-3
        mb-8
        bg-white
        px-5
        py-3
        rounded-2xl
        shadow-md
        hover:shadow-lg
        transition
        "
      >

        <FaArrowLeft />

        Retour à l'accueil

      </button>

      {/* HERO */}

      <div
        className="
        bg-gradient-to-r
        from-indigo-700
        via-purple-700
        to-pink-600
        rounded-3xl
        p-10
        text-white
        shadow-2xl
        "
      >

        <h1 className="text-5xl font-bold flex items-center gap-4">

          <FaVideo />

          Conférences en Direct

        </h1>

        <p className="mt-4 text-lg text-white/90">
          Participez à des sessions interactives en temps réel
          avec les meilleurs enseignants.
        </p>

      </div>

      {/* STATISTIQUES / NAVIGATION */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <button
          onClick={() => setActiveTab("live")}
          className={`
            rounded-3xl
            p-6
            shadow-lg
            text-center
            transition-all
            hover:scale-105
            ${
              activeTab === "live"
                ? "bg-red-500 text-white"
                : "bg-white"
            }
          `}
        >

          <FaVideo className="mx-auto text-3xl" />

          <h2 className="text-4xl font-bold mt-3">
            1
          </h2>

          <p>
            En cours
          </p>

        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`
            rounded-3xl
            p-6
            shadow-lg
            text-center
            transition-all
            hover:scale-105
            ${
              activeTab === "upcoming"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }
          `}
        >

          <FaCalendarAlt className="mx-auto text-3xl" />

          <h2 className="text-4xl font-bold mt-3">
            3
          </h2>

          <p>
            À venir
          </p>

        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`
            rounded-3xl
            p-6
            shadow-lg
            text-center
            transition-all
            hover:scale-105
            ${
              activeTab === "history"
                ? "bg-green-500 text-white"
                : "bg-white"
            }
          `}
        >

          <FaHistory className="mx-auto text-3xl" />

          <h2 className="text-4xl font-bold mt-3">
            2
          </h2>

          <p>
            Historique
          </p>

        </button>

      </div>

      {/* RECHERCHE */}

      <div className="mt-10">

        <input
          type="text"
          placeholder="Rechercher une conférence..."
          className="
          w-full
          bg-white
          rounded-2xl
          border
          border-gray-200
          px-5
          py-4
          shadow-md
          outline-none
          focus:border-purple-500
          "
        />

      </div>

      {/* CONFERENCES */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

        {activeTab === "live" &&
          conferencesLive.map((conference) => (

            <div
              key={conference.id}
              className="
              bg-white
              rounded-3xl
              shadow-lg
              p-6
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              "
            >

              <h3 className="text-2xl font-bold">
                {conference.title}
              </h3>
        <br/>
              <img
                src={getConferenceImage(conference.title)}
                alt={conference.title}
                className="
                  w-full
                  h-52
                  object-cover
                  rounded-2xl
                  mb-4
                "
              />

              <p className="mt-3 text-red-500 font-semibold">
                🔴 En direct
              </p>

              <div className="mt-6 flex gap-3">

                <button className="flex-1 border rounded-xl py-3">
                  Détails
                </button>

                <button onClick={() => navigate("/conference-live") } className=" flex-1 bg-red-500 text-white rounded-xl py-3 hover:bg-red-600 transition " >
                  Rejoindre
                </button>

              </div>

            </div>

          ))}

        {activeTab === "upcoming" &&
          conferencesUpcoming.map((conference) => (

            <div
              key={conference.id}
              className="
              bg-white
              rounded-3xl
              shadow-lg
              p-6
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              "
            >

              <h3 className="text-2xl font-bold">
                {conference.title}
              </h3>
                  <br/>
              <img
                src={getConferenceImage(conference.title)}
                alt={conference.title}
                className="
                  w-full
                  h-52
                  object-cover
                  rounded-2xl
                  mb-4
                "
              />
              <p className="mt-3 text-blue-500 font-semibold">
                📅 À venir
              </p>

              <button className="mt-6 w-full border rounded-xl py-3" onClick={() => navigate(`/conference-details/${conference.id}`)} >
                Détails
              </button>

            </div>

          ))}

        {activeTab === "history" &&
          conferencesHistory.map((conference) => (

            <div
              key={conference.id}
              className="
              bg-white
              rounded-3xl
              shadow-lg
              p-6
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              "
            >

              <h3 className="text-2xl font-bold">
                {conference.title}
              </h3>
                  <br/>
              <img
                src={getConferenceImage(conference.title)}
                alt={conference.title}
                className="
                  w-full
                  h-52
                  object-cover
                  rounded-2xl
                  mb-4
                "
              />
              <p className="mt-3 text-green-500 font-semibold">
                ✔ Terminée
              </p>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 border rounded-xl py-3" onClick={() => navigate(`/conference-details/${conference.id}`)}>
                  Détails
                </button>

                <button   onClick={() => navigate(`/conference-replay/${conference.id}`)} className="flex-1 bg-green-500 text-white rounded-xl py-3">
                Voir le replay
              </button>
             </div>

            </div>

          ))}

      </div>

    </div>

  )

}

export default ConferenceRoom