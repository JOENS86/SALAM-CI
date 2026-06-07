import TeacherLayout from "../../layouts/TeacherLayout"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

function Courses() {

  const courses = [
    {
      id: 1,
      title: "Développement React",
      category: "Frontend",
      students: 120,
      image: "https://picsum.photos/400/200?1"
    },
    {
      id: 2,
      title: "Node.js Avancé",
      category: "Backend",
      students: 85,
      image: "https://picsum.photos/400/200?2"
    },
    {
      id: 3,
      title: "MongoDB Essentials",
      category: "Base de données",
      students: 63,
      image: "https://picsum.photos/400/200?3"
    }
  ]

  return (

    <TeacherLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>

          <h1 className="text-5xl font-bold">
            Mes Cours
          </h1>

          <p className="text-gray-500 mt-3">
            Gérez vos cours et contenus pédagogiques
          </p>

        </div>

        <Link
          to="/teacher-add-course"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3"
        >

          <FaPlus />

          Ajouter un cours

        </Link>

      </div>

      {/* LISTE */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

        {courses.map((course) => (

          <div
            key={course.id}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition"
          >

            <img
              src={course.image}
              alt={course.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-6">

              <p className="text-purple-600 font-medium">
                {course.category}
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {course.title}
              </h2>

              <p className="text-gray-500 mt-3">
                {course.students} étudiants inscrits
              </p>

              <div className="flex gap-3 mt-6">

                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
                  Voir
                </button>

                <button className="flex-1 bg-green-600 text-white py-3 rounded-xl">
                  Modifier
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </TeacherLayout>

  )

}

export default Courses