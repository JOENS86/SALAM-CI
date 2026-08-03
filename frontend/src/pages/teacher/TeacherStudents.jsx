// ============================================================
// IMPORTS
// ============================================================

import TeacherLayout from "../../layouts/TeacherLayout";
import StudentRow from "../../components/teacherStudents/StudentRow";

import { useState, useEffect } from "react";

import exportStudentPDF from "../../utils/exportStudentPDF";
import exportStudentExcel from "../../utils/exportStudentExcel";

import API from "../../services/api";

import {

    FaFileExport,

    FaUserGraduate,

    FaBookOpen,

    FaChartLine,

    FaAward

} from "react-icons/fa";

// ============================================================
// COMPOSANT
// ============================================================

function TeacherStudents() {

    // =========================================================
    // ETUDIANTS
    // =========================================================

    const [students, setStudents] = useState([]);

    // =========================================================
    // MENU EXPORT
    // =========================================================

    const [showExportMenu, setShowExportMenu] = useState(false);

    // =========================================================
    // RECHERCHE
    // =========================================================

    const [search, setSearch] = useState("");

    // =========================================================
    // FILTRE
    // =========================================================

    const [filter, setFilter] = useState("Tout");

    // =========================================================
    // PAGINATION
    // =========================================================

    const studentsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // CHARGEMENT
    // =========================================================

    const loadStudents = async () => {

        try {

            const res = await API.get(

                "/enrollments/teacher/students"

            );

            console.log(res.data.students);

            setStudents(

                res.data.students || []

            );

        }

        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadStudents();

    }, []);

    // =========================================================
    // NORMALISATION
    // =========================================================

    const normalizedStudents = students.map(item => ({

        id: item._id,

        name: item.student?.name || "",

        email: item.student?.email || "",

        course: item.course?.title || "",

        progress: item.progress || 0,

        status: item.status || "active",

        completed: item.completed,

        lastAccess: item.lastAccess,

        raw: item

    }));

    // =========================================================
    // RECHERCHE
    // =========================================================

    const filteredStudents = normalizedStudents.filter(student => {

        const matchesSearch =

            student.name

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

            ||

            student.email

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

            ||

            student.course

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                );

        let matchesFilter = true;

        switch (filter) {

            case "Actifs":

                matchesFilter =

                    student.status === "active";

                break;

            case "En progression":

                matchesFilter =

                    student.progress > 0

                    &&

                    student.progress < 100;

                break;

            case "Terminés":

                matchesFilter =

                    student.progress === 100;

                break;

            default:

                matchesFilter = true;

        }

        return (

            matchesSearch && matchesFilter

        );

    });

    // =========================================================
    // PAGINATION
    // =========================================================

    const indexOfLastStudent =

        currentPage * studentsPerPage;

    const indexOfFirstStudent =

        indexOfLastStudent - studentsPerPage;

    const currentStudents =

        filteredStudents.slice(

            indexOfFirstStudent,

            indexOfLastStudent

        );

    const totalPages = Math.ceil(

        filteredStudents.length /

        studentsPerPage

    );

    // =========================================================
    // STATISTIQUES
    // =========================================================

    const totalStudents =

        normalizedStudents.length;

    const totalCourses =

        new Set(

            normalizedStudents.map(

                s => s.course

            )

        ).size;

    const averageProgress =

        totalStudents

            ?

            Math.round(

                normalizedStudents.reduce(

                    (

                        total,

                        s

                    ) =>

                        total +

                        s.progress,

                    0

                )

                /

                totalStudents

            )

            :

            0;

    const certificates =

        normalizedStudents.filter(

            s => s.progress === 100

        ).length;

    return (

        <TeacherLayout>

            <div className="max-w-7xl mx-auto">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div
                    className="
                        bg-gradient-to-r
                        from-purple-700
                        via-indigo-700
                        to-purple-600
                        rounded-3xl
                        p-8
                        shadow-xl
                        mb-10
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:justify-between
                            lg:items-center
                            gap-8
                        "
                    >

                        {/* ==========================================
                            TITRE
                        ========================================== */}

                        <div>

                            <div className="flex items-center gap-4">

                                <FaUserGraduate className="text-5xl text-white" />

                                <h1 className="text-5xl font-bold text-white">

                                    Mes étudiants

                                </h1>

                            </div>

                            <p className="text-purple-100 text-lg mt-5 max-w-2xl">

                                Consultez tous les étudiants inscrits à vos
                                formations, suivez leur progression et analysez
                                leurs performances tout au long de leur
                                apprentissage.

                            </p>

                        </div>

{/* ==========================================
    EXPORTER
========================================== */}

<div className="relative">

    <button

        onClick={() =>

            setShowExportMenu(

                !showExportMenu

            )

        }

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

        <FaFileExport />

        Exporter

    </button>

    {

        showExportMenu && (

            <div
                className="
                    absolute
                    right-0
                    mt-3
                    w-60
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                    z-50
                "
            >

                <button
                  onClick={async () => {
                    await exportStudentPDF(
                      students,
                      user
                    );
                    setShowExportMenu(false);
                  }}
                  disabled={students.length === 0}
                  className={`
                  w-full
                  px-6
                  py-4
                  text-left
                  transition
              
                  ${
                      students.length === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                  }
              `}
                >

                    📄 Exporter en PDF

                </button>

                <button
                    onClick={() => {
                      exportStudentExcel(
                        students
                      );
                     setShowExportMenu(false);
                    }}
                    disabled={students.length === 0}
                    className={`
                    w-full
                    px-6
                    py-4
                    text-left
                    transition
                
                    ${
                        students.length === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                    }
                `}
                >

                    📊 Exporter en Excel

                </button>

            </div>

        )

    }

</div>

                    </div>

                </div>

            </div>

{/* ==========================================
    STATISTIQUES
========================================== */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

{/* ==========================================
    TOTAL ETUDIANTS
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

        <p className="text-gray-500 text-sm">

            Total étudiants

        </p>

        <h2 className="text-4xl font-bold mt-2">

        {students.length}

        </h2>

    </div>

    <div className="bg-blue-100 p-4 rounded-2xl">

        <FaUserGraduate className="text-3xl text-blue-600" />

    </div>

</div>

{/* ==========================================
    COURS SUIVIS
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

        <p className="text-gray-500 text-sm">

            Cours suivis

        </p>

        <h2 className="text-4xl font-bold mt-2">

        {totalCourses}

        </h2>

    </div>

    <div className="bg-purple-100 p-4 rounded-2xl">

        <FaBookOpen className="text-3xl text-purple-600" />

    </div>

</div>

{/* ==========================================
    PROGRESSION
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

        <p className="text-gray-500 text-sm">

            Progression moyenne

        </p>

        <h2 className="text-4xl font-bold mt-2">

        {averageProgress}%

        </h2>

    </div>

    <div className="bg-green-100 p-4 rounded-2xl">

        <FaChartLine className="text-3xl text-green-600" />

    </div>

</div>

{/* ==========================================
    CERTIFICATS
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition">

    <div>

        <p className="text-gray-500 text-sm">

            Certificats obtenus

        </p>

        <h2 className="text-4xl font-bold mt-2">

        {certificates}

        </h2>

    </div>

    <div className="bg-orange-100 p-4 rounded-2xl">

        <FaAward className="text-3xl text-orange-600" />

    </div>

</div>

</div>


{/* ==========================================
    RECHERCHE + FILTRES
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 mb-10">

    {/* ==========================================
        RECHERCHE
    ========================================== */}

    <div className="relative mb-6">

        <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="
                w-full
                border
                border-gray-300
                rounded-2xl
                px-6
                py-4
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
            "

        />

    </div>

    {/* ==========================================
        FILTRES
    ========================================== */}

    <div className="flex flex-wrap gap-4">

        <button
          onClick={() => setFilter("Tout")}
          className={`
            px-6
            py-3
            rounded-full
            font-medium
            transition
            ${
               filter === "Tout"
               ? "bg-purple-600 text-white"
               : "bg-gray-100"
            }
         `}
        >
           Tout
        </button>

        <button
          onClick={() => setFilter("Actifs")}
          className={`
            px-6
            py-3
            rounded-full
            font-medium
            transition
            ${
               filter === "Actifs"
               ? "bg-green-600 text-white"
               : "bg-gray-100"
            }
       `}
       >
         Actifs
        </button>

        <button
          onClick={() => setFilter("En progression")}
          className={`
            px-6
            py-3
            rounded-full
            font-medium
            transition
    ${
        filter === "En progression"
        ? "bg-blue-600 text-white"
        : "bg-gray-100"
    }
         `}
        >
          En progression
       </button>

       <button
          onClick={() => setFilter("Terminés")}
          className={`
            px-6
            py-3
            rounded-full
            font-medium
            transition
            ${
        filter === "Terminés"
        ? "bg-orange-500 text-white"
        : "bg-gray-100"
           }
        `}
        >
          Terminés
      </button>

    </div>

</div>


{/* ==========================================
    TABLEAU DES ETUDIANTS
========================================== */}
<div className="bg-white rounded-3xl shadow-md overflow-hidden">

    <div className="overflow-x-auto">

        <table className="w-full">

            {/* ==========================================
                EN-TETE
            ========================================== */}

            <thead className="bg-gray-100">

                <tr>

                    <th className="text-left px-6 py-5">
                        Étudiant
                    </th>

                    <th className="text-left px-6 py-5">
                        Cours
                    </th>

                    <th className="text-left px-6 py-5">
                        Progression
                    </th>

                    <th className="text-left px-6 py-5">
                        Dernière connexion
                    </th>

                    <th className="text-left px-6 py-5">
                        Statut
                    </th>

                    <th className="text-center px-6 py-5">
                        Action
                    </th>

                </tr>

            </thead>

            {/* ==========================================
                CORPS
            ========================================== */}

              <tbody>
                {
                currentStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
               />
                  ))
                }
             </tbody>

        </table>

    </div>
</div>

{/* ==========================================
    PAGINATION
========================================== */}
<div
    className="
        flex
        justify-between
        items-center
        mt-8
    "
>

    {/* INFORMATIONS */}

    <p className="text-gray-500">

{

    filteredStudents.length === 0

    ?

    "Aucun étudiant"

    :

    <>

        Affichage de{" "}

        <strong>

            {indexOfFirstStudent + 1}

        </strong>

        {" "}à{" "}

        <strong>

            {Math.min(

                indexOfLastStudent,

                filteredStudents.length

            )}

        </strong>

        {" "}sur{" "}

        <strong>

            {filteredStudents.length}

        </strong>

        {" "}étudiants

    </>

}

</p>

    {/* BOUTONS */}

    <div className="flex gap-2">

        <button

            disabled={currentPage === 1}

            onClick={() =>

                setCurrentPage(

                    currentPage - 1

                )

            }

            className="
                px-4
                py-2
                rounded-xl
                bg-gray-200
                disabled:opacity-40
            "

        >

            ←

        </button>

        {

            [...Array(totalPages)].map((_, index) => (

                <button

                    key={index}

                    onClick={() =>

                        setCurrentPage(index + 1)

                    }

                    className={`
                        px-4
                        py-2
                        rounded-xl

                        ${

                            currentPage === index + 1

                            ?

                            "bg-purple-600 text-white"

                            :

                            "bg-gray-200"

                        }
                    `}

                >

                    {index + 1}

                </button>

            ))

        }

        <button

            disabled={currentPage === totalPages}

            onClick={() =>

                setCurrentPage(

                    currentPage + 1

                )

            }

            className="
                px-4
                py-2
                rounded-xl
                bg-gray-200
                disabled:opacity-40
            "

        >

            →

        </button>

    </div>

</div>

    </TeacherLayout>

    );

}

export default TeacherStudents;