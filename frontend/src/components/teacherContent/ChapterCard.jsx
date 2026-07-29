// ============================================================
// IMPORTS
// ============================================================
import {
    FaVideo,
    FaFilePdf,
    FaQuestionCircle,
    FaEdit,
    FaTrash,
    FaBookOpen
} from "react-icons/fa";

import { Link } from "react-router-dom";

// ============================================================
// COMPOSANT
// ============================================================
function ChapterCard({ chapter }) {

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-md
                hover:shadow-xl
                transition
                p-8
            "
        >

            {/* =====================================
                TITRE
            ===================================== */}

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-2xl font-bold">

                        {chapter.title}

                    </h2>

                    <p className="text-gray-500 mt-3">

                        {chapter.description}

                    </p>

                </div>

            </div>

            {/* =====================================
                STATISTIQUES
            ===================================== */}

            <div className="grid grid-cols-3 gap-4 mt-8">

                <div
                    className="
                        bg-purple-50
                        rounded-2xl
                        p-4
                        text-center
                    "
                >

                    <FaVideo
                        className="
                            mx-auto
                            text-purple-600
                            text-2xl
                        "
                    />

                    <p className="mt-3 font-bold">

                        0

                    </p>

                    <p className="text-sm text-gray-500">

                        Vidéos

                    </p>

                </div>

                <div
                    className="
                        bg-blue-50
                        rounded-2xl
                        p-4
                        text-center
                    "
                >

                    <FaFilePdf
                        className="
                            mx-auto
                            text-blue-600
                            text-2xl
                        "
                    />

                    <p className="mt-3 font-bold">

                        0

                    </p>

                    <p className="text-sm text-gray-500">

                        PDF

                    </p>

                </div>

                <div
                    className="
                        bg-green-50
                        rounded-2xl
                        p-4
                        text-center
                    "
                >

                    <FaQuestionCircle
                        className="
                            mx-auto
                            text-green-600
                            text-2xl
                        "
                    />

                    <p className="mt-3 font-bold">

                        0

                    </p>

                    <p className="text-sm text-gray-500">

                        Quiz

                    </p>

                </div>

            </div>

            {/* =====================================
                ACTIONS
            ===================================== */}

            <div className="grid grid-cols-2 gap-3 mt-8">

            <Link
              to={`/teacher-chapter-content/${chapter._id}`}
              className="
               bg-purple-600
               hover:bg-purple-700
               text-white
               py-3
               rounded-xl
               transition
               flex
               items-center
               justify-center
               gap-2 "
            >
              <FaBookOpen />
            Gérer le contenu
            </Link>

                <button
                    className="
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-3
                        rounded-xl
                        transition
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    <FaEdit />

                    Modifier

                </button>

                <button
                    className="
                        col-span-2
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        py-3
                        rounded-xl
                        transition
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    <FaTrash />

                    Supprimer

                </button>

            </div>

        </div>

    );

}

export default ChapterCard;