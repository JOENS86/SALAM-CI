// ============================================================
// IMPORTS
// ============================================================
import { Link, useParams } from "react-router-dom";
import TeacherLayout from "../../layouts/TeacherLayout";
import {
    FaArrowLeft,
    FaBookOpen,
    FaLayerGroup
} from "react-icons/fa";

import { useEffect, useState } from "react";
import API from "../../services/api";

function CoursePreview() {

    const { id } = useParams();

// ============================================================
// ETATS
// ============================================================

const [course, setCourse] = useState(null);
const [loading, setLoading] = useState(true);

// ============================================================
// CHAPITRES
// ============================================================

const [chapters, setChapters] = useState([]);

// ============================================================
// CHARGER LE COURS
// ============================================================

const loadCourse = async () => {

    try {

        const { data } = await API.get(

            `/courses/${id}`

        );

        setCourse(data);

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

// ============================================================
// CHARGER LES CHAPITRES
// ============================================================

const loadChapters = async () => {

    try {

        const { data } = await API.get(

            `/chapters/course/${id}`

        );

        setChapters(data);

    }

    catch (error) {

        console.log(error);

    }

};

useEffect(() => {

    loadCourse();

    loadChapters();

}, [id]);


if (loading) {

    return (

        <TeacherLayout>

            <div className="text-center py-20">

                Chargement...

            </div>

        </TeacherLayout>

    );

}

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

                        Aperçu du cours

                    </h1>

                    <p className="mt-4 text-lg text-blue-100">

                        Visualisez votre cours exactement comme il sera présenté
                        avant sa publication.

                    </p>

                </div>

                {/* ==========================================
                    INFORMATIONS
                ========================================== */}

                <div
                    className="
                        mt-10
                        bg-white
                        rounded-3xl
                        shadow-md
                        p-10
                    "
                >

                    <div className="flex items-center gap-3">

                        <FaBookOpen className="text-3xl text-purple-600" />

                        <h2 className="text-3xl font-bold">

                            Informations du cours

                        </h2>

                    </div>

                    <div className="mt-10">

                        <div className="h-72 rounded-3xl bg-gray-100 flex items-center justify-center">

                        <img
                          src={
                            course.thumbnail
                            ? `https://salam-ci-backend.onrender.com/${course.thumbnail}`
                            : "/images/course-placeholder.jpg"
                            }
                            alt={course.title}
                            className="
                              w-full
                              h-72
                              object-cover
                              rounded-3xl
                            "
                        />

                        </div>

                        <h2 className="text-4xl font-bold mt-8">

                        {course.title}

                        </h2>

                        <p className="text-gray-500 mt-4 leading-8">

                        {course.description}

                        </p>

                    </div>

                </div>



<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

    <div className="bg-purple-50 rounded-2xl p-5">

        <p className="text-gray-500">

            Catégorie

        </p>

        <h3 className="font-bold mt-2">

            {course.category}

        </h3>

    </div>

    <div className="bg-blue-50 rounded-2xl p-5">

        <p className="text-gray-500">

            Statut

        </p>

        <h3 className="font-bold mt-2">

            {course.status}

        </h3>

    </div>

    <div className="bg-green-50 rounded-2xl p-5">

        <p className="text-gray-500">

            Étudiants

        </p>

        <h3 className="font-bold mt-2">

            {course.studentsCount}

        </h3>

    </div>

    <div className="bg-orange-50 rounded-2xl p-5">

        <p className="text-gray-500">

            Vues

        </p>

        <h3 className="font-bold mt-2">

            {course.views}

        </h3>

    </div>

</div>

{/* ==========================================
    PROGRAMME + STATISTIQUES
========================================== */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

    {/* ==========================================
        PROGRAMME
    ========================================== */}

    <div
        className="
            lg:col-span-2
            bg-white
            rounded-3xl
            shadow-md
            p-10
        "
    >

        <div className="flex items-center gap-3 mb-8">

            <FaLayerGroup className="text-3xl text-purple-600" />

            <h2 className="text-3xl font-bold">

                Programme du cours

            </h2>

        </div>

        <div className="space-y-6">

            {

            chapters.length === 0 ?

            (

                <div
                    className="
                        border-2
                        border-dashed
                        border-gray-300
                        rounded-2xl
                        p-16
                        text-center
                        text-gray-500
                    "
                >

                    Aucun chapitre.

                </div>

            )

            :

            chapters.map((chapter) => (

                <div
                    key={chapter._id}
                    className="
                        border
                        rounded-3xl
                        p-6
                        hover:shadow-lg
                        transition
                    "
                >

                    <div className="flex justify-between items-center">

                        <div>

                            <h2 className="text-2xl font-bold">

                                {chapter.title}

                            </h2>

                            <p className="text-gray-500 mt-2">

                                {chapter.description}

                            </p>

                        </div>

                        <span
                            className="
                                bg-purple-100
                                text-purple-700
                                px-5
                                py-2
                                rounded-full
                                font-semibold
                            "
                        >

                            Chapitre {chapter.order}

                        </span>

                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

                        <div className="bg-purple-50 rounded-2xl p-4 text-center">

                            🎥

                            <h3 className="text-2xl font-bold mt-2">

                                {chapter.videoCount}

                            </h3>

                            <p>Vidéos</p>

                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 text-center">

                            📄

                            <h3 className="text-2xl font-bold mt-2">

                                {chapter.pdfCount}

                            </h3>

                            <p>PDF</p>

                        </div>

                        <div className="bg-green-50 rounded-2xl p-4 text-center">

                            ❓

                            <h3 className="text-2xl font-bold mt-2">

                                {chapter.quizCount}

                            </h3>

                            <p>Quiz</p>

                        </div>

                        <div className="bg-orange-50 rounded-2xl p-4 text-center">

                            📝

                            <h3 className="text-2xl font-bold mt-2">

                                {chapter.exerciseCount}

                            </h3>

                            <p>Exercices</p>

                        </div>

                    </div>

                </div>

            ))

            }

        </div>

    </div>

    {/* ==========================================
        STATISTIQUES
    ========================================== */}

    <div
        className="
            bg-white
            rounded-3xl
            shadow-md
            p-8
            h-fit
            sticky
            top-8
        "
    >

        <h2 className="text-2xl font-bold mb-8">

            Statistiques

        </h2>

        <div className="space-y-6">

            <div className="flex justify-between">

                <span>📘 Chapitres</span>

                <strong>{chapters.length}</strong>

            </div>

            <div className="flex justify-between">

                <span>🎥 Vidéos</span>

                <strong>

                    {chapters.reduce(
                        (total, chapter) => total + chapter.videoCount,
                        0
                    )}

                </strong>

            </div>

            <div className="flex justify-between">

                <span>📄 PDF</span>

                <strong>

                    {chapters.reduce(
                        (total, chapter) => total + chapter.pdfCount,
                        0
                    )}

                </strong>

            </div>

            <div className="flex justify-between">

                <span>❓ Quiz</span>

                <strong>

                    {chapters.reduce(
                        (total, chapter) => total + chapter.quizCount,
                        0
                    )}

                </strong>

            </div>

            <div className="flex justify-between">

                <span>📝 Exercices</span>

                <strong>

                    {chapters.reduce(
                        (total, chapter) => total + chapter.exerciseCount,
                        0
                    )}

                </strong>

            </div>

            <hr />

            <div className="flex justify-between">

                <span>👨‍🎓 Étudiants</span>

                <strong>{course.studentsCount}</strong>

            </div>

            <div className="flex justify-between">

                <span>👁️ Vues</span>

                <strong>{course.views}</strong>

            </div>

            <div className="flex justify-between">

                <span>📥 Téléchargements</span>

                <strong>{course.downloads}</strong>

            </div>

        </div>

    </div>

</div>

            </div>

        </TeacherLayout>

    );

}

export default CoursePreview;