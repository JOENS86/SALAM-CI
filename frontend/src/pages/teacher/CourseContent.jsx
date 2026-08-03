import TeacherLayout from "../../layouts/TeacherLayout";
import { FaArrowLeft, FaBookOpen, FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import AddChapterModal from "../../components/teacherContent/AddChapterModal";
import ChapterCard from "../../components/teacherContent/ChapterCard";
import DeleteChapterModal from "../../components/teacherContent/DeleteChapterModal";

function CourseContent() {

    const { id } = useParams();

    // ============================================================
    // ETAT D'OUVERTURE DE LA MODAL
    // ============================================================
    const [showAddModal, setShowAddModal] = useState(false);

    // ============================================================
    // LISTE DES CHAPITRES
    // ============================================================
    const [chapters, setChapters] = useState([]);

    // ============================================================
    // CHARGEMENT
    // ============================================================
    const [loading, setLoading] = useState(true);


    // ============================================================
    // RECUPERATION DES CHAPITRES
    // ============================================================
const loadChapters = async () => {

    try {

        const { data } = await API.get(

            `/chapters/course/${id}`

        );

        setChapters(data);

    }

    catch (error) {

        console.error(error);

    }

    finally {

        setLoading(false);

    }

};

// ============================================================
// CHARGEMENT INITIAL
// ============================================================
useEffect(() => {

    loadChapters();

}, [id]);

    return (

        <TeacherLayout>

            <div className="max-w-7xl mx-auto">

                {/* Retour */}

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

                {/* Hero */}

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
                        shadow-xl
                    "
                >

                    <h1 className="text-5xl font-bold">

                        Gestion du contenu

                    </h1>

                    <p className="mt-4 text-purple-100 text-lg">

                        Ici vous pourrez créer les chapitres,
                        ajouter les vidéos, les documents PDF,
                        les quiz et les exercices de votre cours.

                    </p>

                </div>

{/* ============================================================
    BARRE D'ACTIONS
============================================================ */}

<div
    className="
        mt-10
        flex
        items-center
        justify-between
    "
>

    <div>

        <h2 className="text-3xl font-bold">

            Chapitres du cours

        </h2>

        <p className="text-gray-500 mt-2">

            Organisez votre formation en plusieurs chapitres.

        </p>

    </div>

    <button

        onClick={() => setShowAddModal(true)}

        className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-6
            py-3
            rounded-2xl
            flex
            items-center
            gap-3
            transition
        "

    >

        <FaPlus />

        Ajouter un chapitre

    </button>

</div>


{/* ============================================================
    AFFICHAGE DES CHAPITRES
============================================================ */}

{

loading ?

(

    <div
        className="
            mt-10
            bg-white
            rounded-3xl
            shadow-md
            p-16
            text-center
        "
    >

        <h2 className="text-2xl font-bold">

            Chargement...

        </h2>

    </div>

)

:

chapters.length === 0 ?

(

    <div
        className="
            mt-10
            bg-white
            rounded-3xl
            shadow-md
            p-16
            text-center
        "
    >

        <FaBookOpen
            className="
                text-7xl
                text-purple-600
                mx-auto
            "
        />

        <h2 className="text-3xl font-bold mt-8">

            Aucun chapitre

        </h2>

        <p
            className="
                text-gray-500
                mt-4
                max-w-2xl
                mx-auto
                leading-8
            "
        >

            Votre cours est créé avec succès.

            <br /><br />

            Commencez maintenant par créer
            votre premier chapitre.

        </p>

        <p
    className="
        mt-10
        text-lg
        text-purple-600
        font-semibold
    "
>

    Cliquez sur "Ajouter un chapitre"
    pour commencer.

</p>

    </div>

)

:

(

    <div
        className="
            mt-10
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
        "
    >

        {

        chapters.map((chapter) => (
          <ChapterCard
            key={chapter._id}
            chapter={chapter}
            onChapterUpdated={loadChapters}
          />
        ))

        }

    </div>

)

}

            </div>

{/* ============================================================
    MODAL AJOUT CHAPITRE
============================================================ */}

<AddChapterModal
    isOpen={showAddModal}
    onClose={() => setShowAddModal(false)}
    courseId={id}
    onChapterCreated={loadChapters}
/>


        </TeacherLayout>

    );

}

export default CourseContent;