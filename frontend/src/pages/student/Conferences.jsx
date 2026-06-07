import DashboardLayout from "../../layouts/DashboardLayout"
import {
  FaVideo,
  FaUsers,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa"

function Conferences() {

  const conferences = [
    {
      id: 1,
      title: "Architecture Microservices",
      teacher: "M. Kouassi",
      date: "12 Juin 2026",
      time: "14:00",
      participants: 45,
      status: "En cours"
    },
    {
      id: 2,
      title: "Cybersécurité Moderne",
      teacher: "Mme Yao",
      date: "15 Juin 2026",
      time: "10:00",
      participants: 28,
      status: "À venir"
    },
    {
      id: 3,
      title: "Développement React Avancé",
      teacher: "M. Konan",
      date: "18 Juin 2026",
      time: "16:00",
      participants: 52,
      status: "À venir"
    }
  ]

  return (

    <DashboardLayout>

      <h1 className="text-5xl font-bold text-gray-900">
        Conférences
      </h1>

      <p className="text-gray-500 mt-3">
        Participez aux conférences en direct
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        {conferences.map((conference) => (

          <div
            key={conference.id}
            className="bg-white rounded-3xl shadow p-6"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                {conference.title}
              </h2>

              <FaVideo className="text-purple-600 text-3xl" />

            </div>

            <p className="text-gray-500 mt-3">
              {conference.teacher}
            </p>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3">
                <FaCalendarAlt />
                <span>{conference.date}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaClock />
                <span>{conference.time}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaUsers />
                <span>
                  {conference.participants} participants
                </span>
              </div>

            </div>

            <div className="mt-6 flex justify-between items-center">

              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  conference.status === "En cours"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {conference.status}
              </span>

              <button className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-3 rounded-xl">

                Rejoindre

              </button>

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Conferences