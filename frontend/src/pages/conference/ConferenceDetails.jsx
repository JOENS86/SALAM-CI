import {
    FaArrowLeft,
    FaUserTie,
    FaCalendarAlt,
    FaClock,
    FaUsers
  } from "react-icons/fa"
  
  import {
    useNavigate,
    useParams
  } from "react-router-dom"
  
  function ConferenceDetails() {
  
    const navigate = useNavigate()
  
    const { id } = useParams()
  
    const conferences = {
      2: {
        title: "Introduction au Développement Web avec React",
        image:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200",
        teacher: "Professeur Aminata Diallo",
        date: "lundi 8 juin 2026",
        time: "14:00",
        duration: "120 min",
        participants: "45/100",
        status: "À venir",
        description:
          "Découvrez les fondamentaux de React et créez votre première application web moderne."
      },
  
      3: {
        title: "Design Thinking et Innovation",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
        teacher: "Professeur Fatou Sow",
        date: "mercredi 10 juin 2026",
        time: "16:00",
        duration: "90 min",
        participants: "32/50",
        status: "À venir",
        description:
          "Apprenez les méthodologies du design thinking pour résoudre des problèmes complexes."
      },
  
      4: {
        title: "Sécurité Informatique et Cybersécurité",
        image:
          "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200",
        teacher: "Professeur Moussa Traoré",
        date: "vendredi 12 juin 2026",
        time: "11:00",
        duration: "120 min",
        participants: "23/60",
        status: "À venir",
        description:
          "Découvrez les meilleures pratiques de cybersécurité et protection des données."
      },
  
      5: {
        title: "Base de Données et SQL Avancé",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
        teacher: "Professeur Ibrahima Koné",
        date: "vendredi 5 juin 2026",
        time: "15:00",
        duration: "120 min",
        participants: "58/70",
        status: "Terminée",
        description:
          "Maîtrisez les requêtes SQL complexes et l'optimisation des bases de données."
      },
  
      6: {
        title: "Intelligence Artificielle et Machine Learning",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
        teacher: "Professeur Aminata Diallo",
        date: "mercredi 3 juin 2026",
        time: "09:00",
        duration: "150 min",
        participants: "92/100",
        status: "Terminée",
        description:
          "Introduction aux concepts fondamentaux du Machine Learning et de l'IA."
      }
    }
  
    const conference = conferences[id]
  
    if (!conference) {
  
      return (
        <div className="min-h-screen flex items-center justify-center">
          Conférence introuvable
        </div>
      )
  
    }
  
    return (
  
      <div className="min-h-screen bg-[#f8fafc] py-10">
  
        <div className="max-w-7xl mx-auto px-6">
  
          <button
            onClick={() => navigate("/conference-room")}
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
            Retour
          </button>
  
          <div className="grid lg:grid-cols-3 gap-8">
  
            <div className="lg:col-span-2">
  
              <img
                src={conference.image}
                alt={conference.title}
                className="
                w-full
                h-[420px]
                object-cover
                rounded-3xl
                shadow-lg
                "
              />
  
              <div className="mt-8">
  
                <div className="flex justify-between items-center">
  
                  <h1 className="text-5xl font-bold">
                    {conference.title}
                  </h1>
  
                  <span
                    className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${
                      conference.status === "Terminée"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }
                    `}
                  >
                    {conference.status}
                  </span>
  
                </div>
  
                <p className="text-gray-500 text-lg mt-5">
                  {conference.description}
                </p>
  
              </div>
  
              <div className="mt-10 border-t pt-8">
  
                <h2 className="text-3xl font-bold mb-8">
                  À propos de cette conférence
                </h2>
  
                <div className="space-y-8">
  
                  <div className="flex gap-4">
  
                    <FaUserTie className="text-purple-600 text-xl mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Enseignant
                      </h3>
  
                      <p className="text-gray-500">
                        {conference.teacher}
                      </p>
  
                    </div>
  
                  </div>
  
                  <div className="flex gap-4">
  
                    <FaCalendarAlt className="text-purple-600 text-xl mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Date
                      </h3>
  
                      <p className="text-gray-500">
                        {conference.date}
                      </p>
  
                    </div>
  
                  </div>
  
                  <div className="flex gap-4">
  
                    <FaClock className="text-purple-600 text-xl mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Heure et durée
                      </h3>
  
                      <p className="text-gray-500">
                        {conference.time} • {conference.duration}
                      </p>
  
                    </div>
  
                  </div>
  
                  <div className="flex gap-4">
  
                    <FaUsers className="text-purple-600 text-xl mt-1" />
  
                    <div>
  
                      <h3 className="font-semibold">
                        Participants
                      </h3>
  
                      <p className="text-gray-500">
                        {conference.participants} participants
                      </p>
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
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
  
                <h2 className="font-bold text-xl mb-6">
                  Actions
                </h2>
  
                {conference.status === "À venir" ? (
  
                  <button
                    className="
                    w-full
                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600
                    text-white
                    py-4
                    rounded-2xl
                    font-semibold
                    "
                  >
                    S'inscrire à la conférence
                  </button>
  
                ) : (
  
                  <button onClick={() =>
                    navigate(`/conference-replay/${id}`)}
                    className="
                    w-full
                    bg-green-600
                    text-white
                    py-4
                    rounded-2xl
                    font-semibold
                    "
                  >
                    Voir le replay
                  </button>
  
                )}
  
                <div className="mt-8">
  
                  <div className="flex justify-between mb-3">
  
                    <span>
                      Places restantes
                    </span>
  
                    <span>
                      8
                    </span>
  
                  </div>
  
                  <div className="h-3 bg-gray-200 rounded-full">
  
                    <div
                      className="
                      h-3
                      w-[80%]
                      bg-gradient-to-r
                      from-indigo-600
                      to-purple-600
                      rounded-full
                      "
                    />
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default ConferenceDetails