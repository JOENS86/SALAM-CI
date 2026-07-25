// ======================================
// COMPOSANT CARTE DE COURS
// ======================================
import CourseCard from "./CourseCard";

// ======================================
// IMAGES (TEMPORAIRES)
// Plus tard elles viendront de MongoDB
// ou d'un stockage comme Cloudinary.
// ======================================
const courses = [

    {
        id: 1,
        title: "Développement Web avec React",
        teacher: "Pierre Lobognon",
        category: "Développement Web",
        rating: 4.8,
        students: 245,
        duration: "18 h",
        level: "Débutant",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },

    {
        id: 2,
        title: "Maîtriser Node.js et Express",
        teacher: "Axel Emmanuel",
        category: "Développement Web",
        rating: 4.9,
        students: 310,
        duration: "20 h",
        level: "Intermédiaire",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
    },

    {
        id: 3,
        title: "Introduction à l'Intelligence Artificielle",
        teacher: "Marie Kouassi",
        category: "Intelligence Artificielle",
        rating: 4.7,
        students: 198,
        duration: "15 h",
        level: "Débutant",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
    },

    {
        id: 4,
        title: "Cybersécurité pour Débutants",
        teacher: "Jean Koffi",
        category: "Cybersécurité",
        rating: 4.8,
        students: 176,
        duration: "14 h",
        level: "Débutant",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3"
    },

    {
        id: 5,
        title: "Adobe Photoshop de A à Z",
        teacher: "Fatou Traoré",
        category: "Design",
        rating: 4.6,
        students: 221,
        duration: "17 h",
        level: "Intermédiaire",
        image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea"
    },

    {
        id: 6,
        title: "Marketing Digital Complet",
        teacher: "Ali Koné",
        category: "Marketing",
        rating: 4.9,
        students: 390,
        duration: "22 h",
        level: "Avancé",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    }

];

function CourseGrid() {

    return (

        <>
            {/* ======================================
                TITRE DE LA SECTION
            ====================================== */}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">

                Tous les cours

            </h2>

            {/* ======================================
                GRILLE RESPONSIVE
            ====================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-8
                "
            >

                {/* ======================================
                    BOUCLE SUR LES COURS
                ====================================== */}

                {

                    courses.map((course) => (

                        <CourseCard

                            key={course.id}

                            course={course}

                        />

                    ))

                }

            </div>

        </>

    );

}

export default CourseGrid;