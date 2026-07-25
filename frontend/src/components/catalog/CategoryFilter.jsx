// ======================================
// CATÉGORIES (STATIQUES POUR LE MOMENT)
// ======================================
const categories = [

    "Toutes",

    "Développement Web",

    "Intelligence Artificielle",

    "Cybersécurité",

    "Design",

    "Marketing",

    "Bureautique"

];

function CategoryFilter() {

    return (

        // ======================================
        // FILTRE DES CATÉGORIES
        // ======================================
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

            {/* ==============================
                TITRE
            ============================== */}

            <h2 className="text-xl font-bold text-gray-800 mb-5">

                Catégories

            </h2>

            {/* ==============================
                LISTE DES CATÉGORIES
            ============================== */}

            <div className="flex flex-wrap gap-4">

                {

                    categories.map((category, index) => (

                        <button

                            key={index}

                            className="

                                px-6
                                py-3

                                rounded-full

                                bg-gray-100

                                hover:bg-gradient-to-r
                                hover:from-purple-600
                                hover:to-indigo-600

                                hover:text-white

                                transition-all
                                duration-300

                                font-medium

                            "

                        >

                            {category}

                        </button>

                    ))

                }

            </div>

        </div>

    );

}

export default CategoryFilter;