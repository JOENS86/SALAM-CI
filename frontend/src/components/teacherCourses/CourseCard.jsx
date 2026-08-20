// ======================================
// ICÔNES
// ======================================

import {
    FaUsers,
    FaVideo,
    FaFilePdf,
    FaBookOpen,
    FaEye,
    FaEdit,
    FaChartLine,
    FaStar
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function CourseCard({ course }) {

    console.log("Course :", course);
    console.log("Thumbnail :", course.thumbnail);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
            "
        >

            {/* ======================================
                IMAGE
            ====================================== */}

            <div className="relative">

            <img
              className="
                w-full
                h-56
                object-cover
              "
              src={
                course.thumbnail
                ? course.thumbnail.startsWith("http")
                ? course.thumbnail
                : `https://salam-ci-backend.onrender.com/${course.thumbnail}`
                : "/images/course-placeholder.jpg"
              }
              alt={course.title || "Image du cours"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/course-placeholder.jpg";
              }}
           />

                {/* Badge statut */}

                <span
                  className={`
                    absolute
                    top-4
                    left-4
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    text-white

                    ${
                       course.status==="Publié"
                       ? "bg-green-600"
                       : course.status==="Suspendu"
                       ? "bg-red-600"
                       : "bg-orange-500"
                    }
`                 }
                >

                    {course.status}

                </span>

            </div>

            {/* ======================================
                CONTENU
            ====================================== */}

            <div className="p-6">

                {/* Catégorie */}

                <p className="text-purple-600 font-semibold">

                    {course.category}

                </p>

                {/* Titre */}

                <h2 className="text-2xl font-bold mt-2">

                    {course.title}

                </h2>

                {/* Note */}

                <div className="flex items-center gap-2 mt-3">

                <FaStar className="text-yellow-400" />

                  <span className="font-semibold">

                    {course.status}

                  </span>

                </div>

{/* ======================================
    STATISTIQUES DU COURS
====================================== */}

<div className="space-y-4 mt-6 text-gray-700">

    <div className="flex items-center gap-3">

        <FaUsers className="text-blue-600" />

        <span>

            <strong>{course.studentsCount}</strong> étudiants

        </span>

    </div>

    <div className="flex items-center gap-3">

        <FaEye className="text-purple-600" />

        <span>

            <strong>{course.views}</strong> vues

        </span>

    </div>

    <div className="flex items-center gap-3">

        <FaFilePdf className="text-red-600" />

        <span>

            <strong>{course.downloads}</strong> téléchargements

        </span>

    </div>

    <div className="flex items-center gap-3">

        📅

        <span>

            {
                course.publishedAt
                    ? new Date(course.publishedAt).toLocaleDateString("fr-FR")
                    : "Non publié"
            }

        </span>

    </div>

</div>

                {/* ======================================
                    ACTIONS
                ====================================== */}

                <div className="grid grid-cols-2 gap-3 mt-8">

                    <Link
                        to={`/teacher-course-preview/${course._id}`}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            hover:scale-105
                        "
                    >

                        <FaEye />

                        Voir

                    </Link>

                    <Link
                        onClick={() =>
                                toast.info(
                                    "🚧 Cette fonctionnalité sera disponible prochainement."
                                )
                        }
                        className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            py-3
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            hover:scale-105
                        "
                    >

                        <FaEdit />

                        Modifier

                    </Link>

                    <Link
                        to={`/teacher-course-content/${course._id}`}
                        className="
                            col-span-2
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            py-3
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            hover:scale-105
                        "
                    >

                        <FaBookOpen />

                        Gérer le contenu

                    </Link>

                    <Link
                        to={`/teacher-course-statistics/${course._id}`}
                        className="
                            col-span-2
                            border
                            border-gray-300
                            hover:bg-gray-100
                            py-3
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            hover:scale-105
                        "
                    >

                        <FaChartLine />

                        Statistiques

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default CourseCard;