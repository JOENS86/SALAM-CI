import TeacherLayout from "../../layouts/TeacherLayout";
import { FaArrowLeft, FaBookOpen, FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

function CourseContent() {

    const { id } = useParams();

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

                {/* Etat vide */}

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

                    <button
                        className="
                            mt-10
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            flex
                            items-center
                            gap-3
                            mx-auto
                            transition
                        "
                    >

                        <FaPlus />

                        Ajouter un chapitre

                    </button>

                </div>

            </div>

        </TeacherLayout>

    );

}

export default CourseContent;