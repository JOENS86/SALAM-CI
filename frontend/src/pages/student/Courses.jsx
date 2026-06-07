import DashboardLayout from "../../layouts/DashboardLayout"
import { FaSearch, FaPlay } from "react-icons/fa"
import reactImg from "../../assets/images/react-course.jpg"
import nodeImg from "../../assets/images/node-course.jpg"
import mongoImg from "../../assets/images/mongodb-course.jpg"

function Courses() {

    const courses = [
        {
          id: 1,
          title: "Introduction à React",
          teacher: "M. Kouassi",
          progress: 75,
          image: reactImg
        },
        {
          id: 2,
          title: "Node.js Avancé",
          teacher: "Mme Yao",
          progress: 45,
          image: nodeImg
        },
        {
          id: 3,
          title: "MongoDB Essentials",
          teacher: "M. Konan",
          progress: 90,
          image: mongoImg
        }
      ]

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>

          <h1 className="text-5xl font-bold text-gray-900">
            Mes Cours
          </h1>

          <p className="text-gray-500 mt-2">
            Continuez votre apprentissage
          </p>

        </div>

      </div>

      {/* RECHERCHE */}

      <div className="bg-white rounded-2xl shadow p-5 mt-8">

        <div className="flex items-center gap-4">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Rechercher un cours..."
            className="w-full outline-none"
          />

        </div>

      </div>

      {/* FILTRES */}

      <div className="flex gap-3 mt-6 flex-wrap">

        <button className="bg-purple-600 text-white px-5 py-2 rounded-full">
          Tous
        </button>

        <button className="bg-white shadow px-5 py-2 rounded-full">
          Développement Web
        </button>

        <button className="bg-white shadow px-5 py-2 rounded-full">
          Réseaux
        </button>

        <button className="bg-white shadow px-5 py-2 rounded-full">
          Base de données
        </button>

      </div>

      {/* LISTE DES COURS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

        {courses.map((course) => (

          <div
            key={course.id}
            className="bg-white rounded-3xl shadow overflow-hidden"
          >

            {/* IMAGE */}

            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            {/* CONTENU */}

            <div className="p-6">

              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {course.teacher}
              </p>

              {/* PROGRESSION */}

              <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">

                  <span>Progression</span>

                  <span>
                    {course.progress}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">

                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{
                      width: `${course.progress}%`
                    }}
                  ></div>

                </div>

              </div>

              {/* BOUTON */}

              <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl flex items-center justify-center gap-3">

                <FaPlay />

                Continuer le cours

              </button>

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Courses