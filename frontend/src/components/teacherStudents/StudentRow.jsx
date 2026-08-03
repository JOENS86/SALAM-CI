// ============================================================
// IMPORTS
// ============================================================

import { Link } from "react-router-dom";

// ============================================================
// COMPOSANT
// ============================================================

function StudentRow({ student }) {

    return (

        <tr className="border-t hover:bg-gray-50 transition">

            {/* =====================================
                ETUDIANT
            ===================================== */}

            <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            w-12
                            h-12
                            rounded-full
                            bg-purple-100
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-purple-700
                        "
                    >

                        {
                            student.name
                                ? student.name.charAt(0).toUpperCase()
                                : "?"
                        }

                    </div>

                    <div>

                        <h3 className="font-semibold">

                            {student.name || "-"}

                        </h3>

                        <p className="text-gray-500 text-sm">

                            {student.email || "-"}

                        </p>

                    </div>

                </div>

            </td>

            {/* =====================================
                COURS
            ===================================== */}

            <td className="px-6 py-5">

                {student.course || "-"}

            </td>

            {/* =====================================
                PROGRESSION
            ===================================== */}

            <td className="px-6 py-5">

                <div className="w-44 bg-gray-200 rounded-full h-3">

                    <div

                        className="bg-purple-600 h-3 rounded-full"

                        style={{

                            width: `${student.progress ?? 0}%`

                        }}

                    />

                </div>

                <p className="mt-2 text-sm">

                    {student.progress ?? 0}%

                </p>

            </td>

            {/* =====================================
                DERNIER ACCÈS
            ===================================== */}

            <td className="px-6 py-5">

                {
                    student.lastAccess
                        ? new Date(student.lastAccess).toLocaleDateString("fr-FR")
                        : "-"
                }

            </td>

            {/* =====================================
                STATUT
            ===================================== */}

            <td className="px-6 py-5">

                <span

                    className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-medium

                        ${
                            student.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                        }
                    `}

                >

                    {
                        student.status === "completed"
                            ? "Terminé"
                            : "En progression"
                    }

                </span>

            </td>

            {/* =====================================
                ACTION
            ===================================== */}

            <td className="px-6 py-5 text-center">

                <Link

                    to={`/teacher-student/${student.id}`}

                    className="
                        bg-purple-600
                        hover:bg-purple-700
                        text-white
                        px-5
                        py-2
                        rounded-xl
                    "

                >

                    Voir

                </Link>

            </td>

        </tr>

    );

}

export default StudentRow;