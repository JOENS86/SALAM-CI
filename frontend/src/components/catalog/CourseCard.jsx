// ======================================
// ICÔNES
// ======================================
import {
    FaStar,
    FaUsers,
    FaClock,
    FaSignal
} from "react-icons/fa";

function CourseCard({ course }) {

    return (

        // ======================================
        // CARTE DU COURS
        // ======================================
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
                IMAGE DU COURS
            ====================================== */}

            <img

                src={course.image}

                alt={course.title}

                className="
                    w-full
                    h-52
                    object-cover
                "

            />

            {/* ======================================
                CONTENU
            ====================================== */}

            <div className="p-6">

                {/* ==============================
                    CATÉGORIE
                ============================== */}

                <span
                    className="
                        inline-block
                        bg-purple-100
                        text-purple-700
                        text-xs
                        font-semibold
                        px-3
                        py-1
                        rounded-full
                        mb-4
                    "
                >

                    {course.category}

                </span>

                {/* ==============================
                    TITRE
                ============================== */}

                <h2
                    className="
                        text-xl
                        font-bold
                        text-gray-800
                        mb-3
                        line-clamp-2
                    "
                >

                    {course.title}

                </h2>

                {/* ==============================
                    ENSEIGNANT
                ============================== */}

                <p className="text-gray-500 mb-5">

                    {course.teacher}

                </p>

                {/* ==============================
                    NOTE
                ============================== */}

                <div className="flex items-center gap-2 mb-4">

                    <FaStar className="text-yellow-400" />

                    <span className="font-semibold">

                        {course.rating}

                    </span>

                </div>

                {/* ==============================
                    INFORMATIONS
                ============================== */}

                <div
                    className="
                        flex
                        justify-between
                        text-sm
                        text-gray-500
                        mb-6
                    "
                >

                    <div className="flex items-center gap-2">

                        <FaUsers />

                        {course.students}

                    </div>

                    <div className="flex items-center gap-2">

                        <FaClock />

                        {course.duration}

                    </div>

                    <div className="flex items-center gap-2">

                        <FaSignal />

                        {course.level}

                    </div>

                </div>

                {/* ==============================
                    BOUTON
                ============================== */}

                <button
                    className="
                        w-full
                        bg-gradient-to-r
                        from-purple-600
                        to-indigo-600
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        hover:scale-105
                        transition-all
                    "
                >

                    Voir le cours

                </button>

            </div>

        </div>

    );

}

export default CourseCard;