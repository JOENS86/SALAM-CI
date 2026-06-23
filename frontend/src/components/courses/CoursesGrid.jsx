import CourseCard from "./CourseCard"

import reactImg from "../../assets/images/react-course.jpg"
import nodeImg from "../../assets/images/node-course.jpg"
import mongoImg from "../../assets/images/mongodb-course.jpg"

function CoursesGrid() {

  const courses = [

    {
      id: 1,
      title: "Développement Web avec React",
      category: "Développement Web",
      description:
        "Apprenez React et créez des applications modernes.",
      teacher: "Dr. Kouamé André",
      level: "Intermédiaire",
      duration: "40 h",
      rating: "4.8",
      image: reactImg
    },

    {
      id: 2,
      title: "Administration Réseaux",
      category: "Réseau",
      description:
        "Administration des systèmes et réseaux.",
      teacher: "Ing. Yao Marie",
      level: "Avancé",
      duration: "50 h",
      rating: "4.9",
      image: nodeImg
    },

    {
      id: 3,
      title: "Base de Données SQL",
      category: "Informatique",
      description:
        "Concevez et gérez efficacement vos bases.",
      teacher: "Prof. Diallo Ibrahim",
      level: "Débutant",
      duration: "35 h",
      rating: "4.7",
      image: mongoImg
    },

    {
      id: 4,
      title: "Cybersécurité",
      category: "Cybersécurité",
      description:
        "Protégez vos systèmes contre les attaques.",
      teacher: "Dr. Touré Fatou",
      level: "Avancé",
      duration: "60 h",
      rating: "4.9",
      image: reactImg
    },

    {
      id: 5,
      title: "Marketing Digital",
      category: "Marketing",
      description:
        "Développez votre présence en ligne.",
      teacher: "Mme Bamba Aya",
      level: "Débutant",
      duration: "20 h",
      rating: "4.6",
      image: nodeImg
    },

    {
      id: 6,
      title: "Bureautique",
      category: "Bureautique",
      description:
        "Maîtrisez Word, Excel et PowerPoint.",
      teacher: "M. Koffi Amadou",
      level: "Débutant",
      duration: "15 h",
      rating: "4.5",
      image: mongoImg
    }

  ]

  return (

    <>

      <p className="text-gray-500 mb-6">

        {courses.length} cours disponibles

      </p>

      <div
        className="
        grid
        md:grid-cols-2
        xl:grid-cols-3
        gap-8
        "
      >

        {courses.map((course) => (

          <CourseCard
            key={course.id}
            course={course}
          />

        ))}

      </div>

      {/* PAGINATION */}

      <div
        className="
        flex
        justify-center
        gap-3
        mt-12
        "
      >

        <button className="w-10 h-10 border rounded-xl">
          1
        </button>

        <button className="w-10 h-10 border rounded-xl">
          2
        </button>

        <button className="w-10 h-10 border rounded-xl">
          3
        </button>

      </div>

      {/* SUGGESTION */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        mt-12
        p-8
        flex
        flex-col
        md:flex-row
        justify-between
        items-center
        gap-6
        "
      >

        <div>

          <h3 className="text-2xl font-bold">

            Vous ne trouvez pas ce que vous cherchez ?

          </h3>

          <p className="text-gray-500 mt-2">

            Faites-nous part de vos besoins,
            nous ajouterons de nouveaux cours.

          </p>

        </div>

        <button
          className="
          bg-purple-600
          text-white
          px-6
          py-3
          rounded-xl
          "
        >
          Faire une suggestion
        </button>

      </div>

    </>

  )

}

export default CoursesGrid