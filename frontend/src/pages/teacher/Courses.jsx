import { useEffect, useState } from "react";
import API from "../../services/api";
import CourseCard from "../../components/teacherCourses/CourseCard";
import TeacherLayout from "../../layouts/TeacherLayout";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaBookOpen,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaSearch
} from "react-icons/fa"

function Courses() {

// ==========================================
// UTILISATEUR CONNECTÉ
// ==========================================

const user = JSON.parse(
  localStorage.getItem("user")
);

// ==========================================
// LISTE DES COURS
// ==========================================

const [courses, setCourses] = useState([]);

// ==========================================
// CHARGEMENT
// ==========================================

const [loading, setLoading] = useState(true);


// ==========================================
// CHARGER LES COURS
// ==========================================

const loadCourses = async () => {

  try {

    console.log("Utilisateur connecté :", user);
    console.log("Teacher ID envoyé :", user._id);
      const res = await API.get(

          `/courses/teacher/${user._id}`

      );

      console.log(res.data);

      setCourses(res.data);

  }

  catch (error) {

      console.log(error);

  }

  finally {

      setLoading(false);

  }

};

useEffect(() => {
  loadCourses();
}, []);


  return (

    <TeacherLayout>

      {/* HEADER */}

<div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 rounded-3xl p-8 shadow-xl mb-10">
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

        {/* ===========================
            TITRE
        ============================ */}

        <div>

            <h1 className="text-5xl font-bold text-white">
                📚 Mes cours
            </h1>

            <p className="text-purple-100 text-lg mt-4 max-w-2xl">

                Gérez les cours que vous avez créés, suivez leur évolution
                et enrichissez leur contenu pour offrir une meilleure
                expérience d'apprentissage à vos étudiants.

            </p>

        </div>

        {/* ===========================
            BOUTON AJOUTER
        ============================ */}

        <Link
            to="/teacher-add-course"
            className="
                bg-white
                text-purple-700
                font-semibold
                px-8
                py-4
                rounded-2xl
                shadow-lg
                hover:scale-105
                transition-all
                flex
                items-center
                gap-3
                w-fit
            "
        >

            <FaPlus />

            Ajouter un cours

        </Link>

    </div>

</div>

           {/* STATISTIQUES */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
  {/* Mes cours */}

  <div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

      <p className="text-gray-500 text-sm">
        Mes cours
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {courses.length}
      </h2>

    </div>

    <div className="bg-purple-100 p-4 rounded-2xl">

      <FaBookOpen className="text-3xl text-purple-600" />

    </div>

  </div>

  {/* Étudiants */}

  <div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

      <p className="text-gray-500 text-sm">
        Étudiants
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {
          courses.reduce(
            (total, course) =>
            total + (course.studentsCount || 0),
            0
          )
        }
      </h2>

    </div>

    <div className="bg-blue-100 p-4 rounded-2xl">

      <FaUsers className="text-3xl text-blue-600" />

    </div>

  </div>

  {/* Publiés */}

  <div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

      <p className="text-gray-500 text-sm">
        Publiés
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {
          courses.filter(
          course => course.status === "Publié"
          ).length
        }
      </h2>

    </div>

    <div className="bg-green-100 p-4 rounded-2xl">

      <FaCheckCircle className="text-3xl text-green-600" />

    </div>

  </div>

  {/* Brouillons */}

  <div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

      <p className="text-gray-500 text-sm">
        Brouillons
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {
          courses.filter(
          course => course.status === "En attente"
          ).length
        }
      </h2>

    </div>

    <div className="bg-orange-100 p-4 rounded-2xl">

      <FaClock className="text-3xl text-orange-500" />

    </div>

  </div>

</div>

       {/* RECHERCHE + FILTRES */}

<div className="bg-white rounded-3xl shadow-md p-6 mb-10">

    {/* ==========================
        RECHERCHE
    =========================== */}

    <div className="relative mb-6">

        <FaSearch
            className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
            "
        />

        <input

            type="text"

            placeholder="Rechercher un cours..."

            className="
                w-full
                pl-14
                pr-5
                py-4
                border
                border-gray-300
                rounded-2xl
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
            "

        />

    </div>

    {/* ==========================
        FILTRES
    =========================== */}

    <div className="flex flex-wrap gap-4">

        <button
            className="
                bg-purple-600
                text-white
                px-6
                py-3
                rounded-full
                font-medium
            "
        >
            Tous
        </button>

        <button
            className="
                bg-gray-100
                hover:bg-green-600
                hover:text-white
                transition
                px-6
                py-3
                rounded-full
                font-medium
            "
        >
            Publiés
        </button>

        <button
            className="
                bg-gray-100
                hover:bg-orange-500
                hover:text-white
                transition
                px-6
                py-3
                rounded-full
                font-medium
            "
        >
            Brouillons
        </button>

        <button
            className="
                bg-gray-100
                hover:bg-red-500
                hover:text-white
                transition
                px-6
                py-3
                rounded-full
                font-medium
            "
        >
            Suspendus
        </button>

    </div>

</div>


      {/* LISTE DES COURS */}

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

{

courses.map(course => (

    <CourseCard
        key={course.id}
        course={course}
    />

))

}

</div>

    </TeacherLayout>

  )

}

export default Courses