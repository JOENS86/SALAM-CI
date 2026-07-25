// ======================================
// ICÔNES
// ======================================
import {
    FaBookOpen,
    FaGraduationCap,
    FaUsers
} from "react-icons/fa";

function CatalogHero() {

    return (

        // ======================================
        // SECTION HERO
        // ======================================
        <section
            className="
                bg-gradient-to-r
                from-indigo-900
                via-purple-800
                to-indigo-700
                rounded-3xl
                p-10
                text-white
                shadow-xl
                mb-8
            "
        >

            {/* ==============================
                CONTENU PRINCIPAL
            ============================== */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                {/* ==============================
                    TEXTE
                ============================== */}

                <div>

                    <h1 className="text-5xl font-extrabold">

                        Catalogue des cours

                    </h1>

                    <p className="mt-4 text-lg text-indigo-100 max-w-2xl leading-relaxed">

                        Découvrez les meilleurs cours proposés par nos enseignants
                        et développez vos compétences grâce à une plateforme
                        d'apprentissage moderne.

                    </p>

                </div>

                {/* ==============================
                    PETITES STATISTIQUES
                    (Statiques pour le moment)
                ============================== */}

                <div className="grid grid-cols-3 gap-5">

                    {/* Cours */}

                    <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">

                        <FaBookOpen className="mx-auto text-3xl mb-3 text-yellow-300" />

                        <h2 className="text-3xl font-bold">

                            120

                        </h2>

                        <p className="text-sm text-indigo-100">

                            Cours

                        </p>

                    </div>

                    {/* Enseignants */}

                    <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">

                        <FaGraduationCap className="mx-auto text-3xl mb-3 text-green-300" />

                        <h2 className="text-3xl font-bold">

                            35

                        </h2>

                        <p className="text-sm text-indigo-100">

                            Enseignants

                        </p>

                    </div>

                    {/* Étudiants */}

                    <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">

                        <FaUsers className="mx-auto text-3xl mb-3 text-pink-300" />

                        <h2 className="text-3xl font-bold">

                            2 500+

                        </h2>

                        <p className="text-sm text-indigo-100">

                            Étudiants

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default CatalogHero;