// ============================================================
// IMPORTS
// ============================================================
import TeacherLayout from "../../layouts/TeacherLayout";

import { useParams, Link } from "react-router-dom";

import {

    FaArrowLeft,
    FaBookOpen

} from "react-icons/fa";

// ============================================================
// COMPONENTS
// ============================================================

import VideoSection from "../../components/chapterTeacher/VideoSection";
import PdfSection from "../../components/chapterTeacher/PdfSection";
import QuizSection from "../../components/chapterTeacher/QuizSection";
import ExerciseSection from "../../components/chapterTeacher/ExerciseSection";

// ============================================================
// PAGE
// ============================================================

function ChapterContent() {

    // ========================================================
    // ID DU CHAPITRE
    // ========================================================

    const { chapterId } = useParams();

    return (

        <TeacherLayout>

            <div className="max-w-7xl mx-auto">

                {/* ========================================= */}

                <Link

                    to={-1}

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
                    "

                >

                    <FaArrowLeft />

                    Retour

                </Link>

                {/* ========================================= */}

                <div

                    className="
                        mt-8
                        bg-gradient-to-r
                        from-purple-700
                        via-indigo-700
                        to-purple-600
                        rounded-3xl
                        p-10
                        text-white
                    "

                >

                    <h1 className="text-5xl font-bold">

                        Contenu du chapitre

                    </h1>

                    <p className="mt-4 text-purple-100">

                        Gérez les vidéos, PDF, quiz et exercices
                        de ce chapitre.

                    </p>

                </div>

                {/* ========================================= */}

                <VideoSection

                    chapterId={chapterId}

                />

                {/* ========================================= */}

                <PdfSection

                    chapterId={chapterId}

                />

                {/* ========================================= */}

                <QuizSection

                    chapterId={chapterId}

                />

                {/* ========================================= */}

                <ExerciseSection

                    chapterId={chapterId}

                />

            </div>

        </TeacherLayout>

    );

}

export default ChapterContent;