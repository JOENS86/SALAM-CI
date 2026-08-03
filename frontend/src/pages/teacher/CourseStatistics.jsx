import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TeacherLayout from "../../layouts/TeacherLayout";
import API from "../../services/api";

import {
    FaArrowLeft,
    FaUsers,
    FaEye,
    FaDownload,
    FaBookOpen,
    FaVideo,
    FaFilePdf,
    FaQuestionCircle,
    FaClipboardCheck
} from "react-icons/fa";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

function CourseStatistics() {

    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
    
        try {
    
            const courseRes = await API.get(
    
                `/courses/${id}`
    
            );
    
            setCourse(courseRes.data);
    
            const chapterRes = await API.get(
    
                `/chapters/course/${id}`
    
            );
    
            setChapters(chapterRes.data);
    
        }
    
        catch (error) {
    
            console.log(error);
    
        }
    
    };

    if (!course) return null;
    
// ==========================================
// DONNÉES DU BAR CHART
// ==========================================

const chapterData = chapters.map((chapter) => ({

    name: `Ch ${chapter.order}`,

    total:
        chapter.videoCount +
        chapter.pdfCount +
        chapter.quizCount +
        chapter.exerciseCount

}));

// ==========================================
// DONNÉES DU PIE CHART
// ==========================================

const contentData = [

    {

        name: "Vidéos",

        value: chapters.reduce(
            (t, c) => t + c.videoCount,
            0
        )

    },

    {

        name: "PDF",

        value: chapters.reduce(
            (t, c) => t + c.pdfCount,
            0
        )

    },

    {

        name: "Quiz",

        value: chapters.reduce(
            (t, c) => t + c.quizCount,
            0
        )

    },

    {

        name: "Exercices",

        value: chapters.reduce(
            (t, c) => t + c.exerciseCount,
            0
        )

    }

];

const COLORS = [

    "#7c3aed",
    "#2563eb",
    "#16a34a",
    "#ea580c"

];

    return (

        <TeacherLayout>
    
    <div className="max-w-7xl mx-auto">
    
                {/* ==========================================
                    RETOUR
                ========================================== */}
    
                <Link
                    to="/teacher-courses"
                    className="
                        inline-flex
                        items-center
                        gap-3
                        bg-white
                        px-5
                        py-3
                        rounded-2xl
                        shadow
                        hover:shadow-lg
                        transition
                    "
                >
                    <FaArrowLeft />
    
                    Retour aux cours
    
                </Link>
    
                {/* ==========================================
                    HERO
                ========================================== */}
    
                <div
                    className="
                        mt-8
                        rounded-3xl
                        bg-gradient-to-r
                        from-blue-700
                        via-indigo-700
                        to-purple-700
                        text-white
                        p-10
                        shadow-xl
                    "
                >
    
                    <h1 className="text-5xl font-bold">
    
                        Statistiques du cours
    
                    </h1>
    
                    <p className="mt-4 text-blue-100 text-lg">
    
                        Analyse complète des performances de votre cours.
    
                    </p>
    
                </div>
    
{/* ==========================================
    STATISTIQUES
========================================== */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 items-stretch">

{/* Etudiants */}

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaUsers className="text-4xl text-blue-600 mb-5"/>

    <p className="text-gray-500">

        Étudiants

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {course.studentsCount}

    </h2>

</div>

{/* Vues */}

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaEye className="text-4xl text-purple-600 mb-5"/>

    <p className="text-gray-500">

        Vues

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {course.views}

    </h2>

</div>

{/* Téléchargements */}

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaDownload className="text-4xl text-red-600 mb-5"/>

    <p className="text-gray-500">

        Téléchargements

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {course.downloads}

    </h2>

</div>

{/* Chapitres */}

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaBookOpen className="text-4xl text-orange-600 mb-5"/>

    <p className="text-gray-500">

        Chapitres

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {chapters.length}

    </h2>

</div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6 items-stretch">

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaVideo className="text-4xl text-purple-600 mb-5"/>

    <p className="text-gray-500">

        Vidéos

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {chapters.reduce((t,c)=>t+c.videoCount,0)}

    </h2>

</div>

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaFilePdf className="text-4xl text-blue-600 mb-5"/>

    <p className="text-gray-500">

        PDF

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {chapters.reduce((t,c)=>t+c.pdfCount,0)}

    </h2>

</div>

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaQuestionCircle className="text-4xl text-green-600 mb-5"/>

    <p className="text-gray-500">

        Quiz

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {chapters.reduce((t,c)=>t+c.quizCount,0)}

    </h2>

</div>

<div className="bg-white rounded-3xl shadow-md p-6">

    <FaClipboardCheck className="text-4xl text-orange-600 mb-5"/>

    <p className="text-gray-500">

        Exercices

    </p>

    <h2 className="text-4xl font-bold mt-2">

        {chapters.reduce((t,c)=>t+c.exerciseCount,0)}

    </h2>

      </div>

</div>

</div> 

{/* ==========================================
    ANALYSE DU CONTENU
========================================== */}

<div className="grid lg:grid-cols-2 gap-8 mt-8 items-stretch">

    {/* BAR CHART */}

    <div className="bg-white rounded-3xl p-6 shadow-md">

        <h2 className="text-2xl font-bold mb-6">

            Contenu par chapitre

        </h2>

        <ResponsiveContainer
            width="100%"
            height={240}
        >

            <BarChart data={chapterData}>

                <XAxis dataKey="name"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                    dataKey="total"
                    fill="#7c3aed"
                />

            </BarChart>

        </ResponsiveContainer>

    </div>

    {/* PIE CHART */}

    <div className="bg-white rounded-3xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-6">

            Répartition du contenu

        </h2>

        <ResponsiveContainer
            width="100%"
            height={240}
        >

            <PieChart>

                <Pie
                    data={contentData}
                    dataKey="value"
                    outerRadius={110}
                    label
                >

                    {

                        contentData.map((entry,index)=>(

                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />

                        ))

                    }

                </Pie>

                <Tooltip/>

            </PieChart>

        </ResponsiveContainer>

    </div>

</div>
     
     {/* ==========================================
           DÉTAIL PAR CHAPITRE
     ========================================== */}

<div className="bg-white rounded-3xl p-6 shadow-md mt-8">

<h2 className="text-2xl font-bold mb-6">

    Répartition du contenu par chapitre

</h2>

<ResponsiveContainer
    width="100%"
    height={280}
>

    <BarChart data={chapters}>

        <XAxis dataKey="title" />

        <YAxis />

        <Tooltip />

        <Bar
            dataKey="videoCount"
            fill="#7c3aed"
            name="Vidéos"
        />

        <Bar
            dataKey="pdfCount"
            fill="#2563eb"
            name="PDF"
        />

        <Bar
            dataKey="quizCount"
            fill="#16a34a"
            name="Quiz"
        />

        <Bar
            dataKey="exerciseCount"
            fill="#ea580c"
            name="Exercices"
        />

    </BarChart>

</ResponsiveContainer>

</div>

    {/* ==========================================
    TABLEAU RÉCAPITULATIF
========================================== */}

<div className="bg-white rounded-3xl shadow-md p-6 mt-8">

<h2 className="text-2xl font-bold mb-8">

    Détail des chapitres

</h2>

<div className="overflow-x-auto">

    <table className="w-full">

        <thead>

            <tr className="border-b">

                <th className="text-left py-4">Chapitre</th>

                <th className="text-center">Vidéos</th>

                <th className="text-center">PDF</th>

                <th className="text-center">Quiz</th>

                <th className="text-center">Exercices</th>

                <th className="text-center">Total</th>

            </tr>

        </thead>

        <tbody>

            {

                chapters.map((chapter) => (

                    <tr
                        key={chapter._id}
                        className="border-b hover:bg-gray-50"
                    >

                        <td className="py-5">

                            <div>

                                <h3 className="font-semibold">

                                    {chapter.title}

                                </h3>

                                <p className="text-gray-500 text-sm">

                                    Chapitre {chapter.order}

                                </p>

                            </div>

                        </td>

                        <td className="text-center">

                            {chapter.videoCount}

                        </td>

                        <td className="text-center">

                            {chapter.pdfCount}

                        </td>

                        <td className="text-center">

                            {chapter.quizCount}

                        </td>

                        <td className="text-center">

                            {chapter.exerciseCount}

                        </td>

                        <td className="text-center font-bold text-purple-600">

                            {

                                chapter.videoCount +

                                chapter.pdfCount +

                                chapter.quizCount +

                                chapter.exerciseCount

                            }

                        </td>

                    </tr>

                ))

            }

        </tbody>

    </table>

</div>

</div>

     </TeacherLayout>
    
    )

}

export default CourseStatistics;