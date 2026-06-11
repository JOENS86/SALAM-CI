import {
    FaArrowLeft,
    FaPlayCircle,
    FaUserTie,
    FaClock,
    FaCalendarAlt
  } from "react-icons/fa"
  
  import {
    useNavigate,
    useParams
  } from "react-router-dom"
  
  function ConferenceReplay() {
  
    const navigate = useNavigate()
  
    const { id } = useParams()
  
    const replays = {
  
      5: {
        title: "Base de Données et SQL Avancé",
        teacher: "Professeur Ibrahima Koné",
        date: "5 juin 2026",
        duration: "120 min",
        video:
          "https://www.youtube.com/embed/HXV3zeQKqGY",
        description:
          "Maîtrisez les requêtes SQL complexes, les jointures avancées et l'optimisation des bases de données."
      },
  
      6: {
        title: "Intelligence Artificielle et Machine Learning",
        teacher: "Professeur Aminata Diallo",
        date: "3 juin 2026",
        duration: "150 min",
        video:
          "https://www.youtube.com/embed/aircAruvnKk",
        description:
          "Découvrez les fondamentaux du Machine Learning, des réseaux de neurones et de l'intelligence artificielle."
      }
  
    }
  
    const replay = replays[id]
  
    if (!replay) {
  
      return (
  
        <div className="min-h-screen flex items-center justify-center">
  
          <h1 className="text-3xl font-bold">
            Replay introuvable
          </h1>
  
        </div>
  
      )
  
    }
  
    return (
  
      <div className="min-h-screen bg-slate-100">
  
        <div className="max-w-7xl mx-auto p-8">
  
          {/* RETOUR */}
  
          <button
            onClick={() => navigate("/conference-room")}
            className="
            flex
            items-center
            gap-3
            mb-8
            hover:text-purple-600
            transition
            "
          >
  
            <FaArrowLeft />
  
            Retour aux conférences
  
          </button>
  
          {/* TITRE */}
  
          <div
            className="
            bg-white
            rounded-3xl
            p-8
            shadow-lg
            "
          >
  
            <div className="flex items-center gap-4">
  
              <FaPlayCircle
                className="
                text-purple-600
                text-4xl
                "
              />
  
              <div>
  
                <h1 className="text-4xl font-bold">
                  {replay.title}
                </h1>
  
                <p className="text-gray-500 mt-2">
                  Replay disponible
                </p>
  
              </div>
  
            </div>
  
          </div>
  
          {/* VIDEO */}
  
          <div
            className="
            mt-8
            bg-black
            rounded-3xl
            overflow-hidden
            shadow-2xl
            "
          >
  
            <iframe
              className="w-full h-[650px]"
              src={replay.video}
              title="Replay"
              allowFullScreen
            />
  
          </div>
  
          {/* INFOS */}
  
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
  
            <div className="lg:col-span-2">
  
              <div
                className="
                bg-white
                rounded-3xl
                p-8
                shadow-lg
                "
              >
  
                <h2 className="text-2xl font-bold mb-5">
                  Description
                </h2>
  
                <p className="text-gray-600 leading-8">
                  {replay.description}
                </p>
  
              </div>
  
            </div>
  
            <div>
  
              <div
                className="
                bg-white
                rounded-3xl
                p-8
                shadow-lg
                "
              >
  
                <h2 className="text-2xl font-bold mb-6">
                  Informations
                </h2>
  
                <div className="space-y-6">
  
                  <div className="flex gap-4">
  
                    <FaUserTie className="text-purple-600 mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Enseignant
                      </h3>
  
                      <p className="text-gray-500">
                        {replay.teacher}
                      </p>
  
                    </div>
  
                  </div>
  
                  <div className="flex gap-4">
  
                    <FaCalendarAlt className="text-purple-600 mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Date
                      </h3>
  
                      <p className="text-gray-500">
                        {replay.date}
                      </p>
  
                    </div>
  
                  </div>
  
                  <div className="flex gap-4">
  
                    <FaClock className="text-purple-600 mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Durée
                      </h3>
  
                      <p className="text-gray-500">
                        {replay.duration}
                      </p>
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default ConferenceReplay