import TeacherLayout from "../../layouts/TeacherLayout"
import { FaPlus } from "react-icons/fa"

function Conferences() {

  const upcoming = [
    {
      id: 1,
      title: "Session Q&A - Machine Learning",
      date: "10 Juin 2026",
      time: "14h00",
      participants: 28
    },
    {
      id: 2,
      title: "Atelier React Hooks",
      date: "15 Juin 2026",
      time: "16h00",
      participants: 19
    }
  ]

  const past = [
    {
      id: 3,
      title: "Introduction à l'IA",
      date: "01 Juin 2026",
      participants: 45
    }
  ]

  return (

    <TeacherLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold">
            Conférences
          </h1>

          <p className="text-gray-500 mt-3">
            Gérez vos conférences en direct
          </p>

        </div>

        <button onClick={() =>
          alert("Module de création de conférence en cours de développement 🚀")
            } className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3"
          >
             <FaPlus />
            Créer une conférence
        </button>

      </div>

      {/* A VENIR */}

      <h2 className="text-3xl font-bold mt-12 mb-6">
        À venir
      </h2>

      <div className="space-y-6">

        {upcoming.map((conf) => (

          <div
            key={conf.id}
            className="bg-white rounded-3xl shadow-md p-8"
          >

            <h3 className="text-2xl font-bold">
              {conf.title}
            </h3>

            <div className="flex gap-8 text-gray-500 mt-4">

              <span>{conf.date}</span>

              <span>{conf.time}</span>

              <span>
                {conf.participants} participants
              </span>

            </div>

            <div className="flex gap-4 mt-6">

              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">

                Rejoindre

              </button>

              <button className="bg-green-600 text-white px-6 py-3 rounded-xl">

                Modifier

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* PASSEES */}

      <h2 className="text-3xl font-bold mt-12 mb-6">
        Passées
      </h2>

      <div className="space-y-6">

        {past.map((conf) => (

          <div
            key={conf.id}
            className="bg-white rounded-3xl shadow-md p-8"
          >

            <h3 className="text-2xl font-bold">
              {conf.title}
            </h3>

            <div className="flex gap-8 text-gray-500 mt-4">

              <span>{conf.date}</span>

              <span>
                {conf.participants} participants
              </span>

            </div>

            <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl">

              Voir le replay

            </button>

          </div>

        ))}

      </div>

    </TeacherLayout>

  )

}

export default Conferences