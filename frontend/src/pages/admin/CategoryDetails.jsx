import { useEffect, useState } from "react"
import {
    useNavigate,
    useParams
} from "react-router-dom"

import API from "../../services/api"
import { FaArrowLeft } from "react-icons/fa"

const CategoryDetails = () => {

// =========================
// NAVIGATION
// =========================

const navigate = useNavigate()

// =========================
// ID DE LA CATEGORIE
// =========================

const { id } = useParams()

// =========================
// DONNEES
// =========================

const [category, setCategory] = useState(null)
const [loading, setLoading] = useState(true)

// =========================
// COURS
// =========================

const [courses, setCourses] = useState([])

// =========================
// RECHERCHE
// =========================

const [search,setSearch]=useState("")

const filteredCourses = courses.filter(course =>

    course.title
    .toLowerCase()
    .includes(search.toLowerCase())
    
    )

// =========================
// RECUPERER UNE CATEGORIE
// =========================
const getCategory = async () => {
    try{
        setLoading(true)
        const res = await API.get(
            `/categories/${id}`
        )
        setCategory(res.data)
    }

    catch(error){
        console.log(error)
    }

    finally{
        setLoading(false)
    }
}

useEffect(()=>{
    getCategory()
},[])

useEffect(() => {
    if (category?.name) {
        getCourses(category.name)
    }

}, [category])

console.log("courses =", courses)
if(loading){
    return(
        <div className="p-10">
            Chargement...
        </div>
    )
}

// =========================
// RECUPERER LES COURS
// =========================

const getCourses = async (categoryName) => {
    try {

        console.log("Recherche des cours de :", categoryName)

        const res = await API.get(`/courses/category/${categoryName}`)

        console.log("Réponse API :", res.data)

        setCourses(res.data)

    } catch (error) {
        console.log(error)
    }
}


  return (
     <div className="p-8">

          {/* =========================
                BOUTON RETOUR
          ========================= */}

          <button
            onClick={() => navigate("/admin-categories")}
            className="
              inline-flex
              items-center
              gap-3
              bg-white
              px-5
              py-3
              rounded-2xl
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
              text-gray-700
              font-semibold "
          >

        <span className="text-xl">
            <FaArrowLeft className="text-purple-600" />
        </span>
             Retour aux catégories
          </button>

                  <br/><br/>
            {/* =========================
                TITRE
            ========================= */}

            <h1 className="text-4xl font-bold text-gray-800">
                {category?.name}
            </h1>


            {/* =========================
                DESCRIPTION
            ========================= */}

            <p className="text-gray-500 mt-2">
               {category?.description}
            </p>


            {/* =========================
                ESPACE
            ========================= */}

            <div className="h-8"></div>


            {/* =========================
                STATISTIQUES
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {/* Total cours */}

                <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Total cours
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                      {courses.length}
                    </h2>

                </div>


                {/* Enseignants */}

                <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Enseignants
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                       0
                    </h2>

                </div>


                {/* Etudiants */}

                <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <p className="text-gray-500">
                        Etudiants
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        0
                    </h2>

                </div>

            </div>



            {/* =========================
                RECHERCHE
            ========================= */}

            <div className="bg-white rounded-3xl p-5 shadow-sm mt-8">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un cours..."
                className="w-full outline-none"
              />

            </div>



            {/* =========================
                ESPACE LISTE COURS
            ========================= */}

            <div className="mt-8">


                {/* Etat vide */}

            {courses.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
                    <div className="text-6xl">
                        📚
                    </div>

                    <h2 className="text-3xl font-bold mt-6">
                        Aucun cours
                    </h2>

                      <p className="text-gray-500 mt-3">
                        Cette catégorie ne contient encore aucun cours.
                      </p>
                </div>   

                    ) : (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course._id} className=" bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 ">

                        {/* Catégorie */}
                <p className="text-sm text-purple-600 font-semibold">
                   {course.category}
                </p>

                        {/* Titre */}
                <h3 className="text-2xl font-bold mt-2">
                   {course.title}
                </h3>

                        {/* Description */}
                <p className="text-gray-500 mt-3 line-clamp-3">
                    {course.description}
                </p>

                        {/* Informations */}
                <div className="flex justify-between items-center mt-6">

        <span className={` px-3 py-1 rounded-full text-sm font-semibold
                ${
                    course.status === "Publié"
                        ? "bg-green-100 text-green-700"
                        : course.status === "Suspendu"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                }
            `}
        >
                   {course.status}
        </span>

        <button
            onClick={() => navigate(`/admin/courses/${course._id}`)}
            className=" bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition ">
               Voir
        </button>
               
               </div>

                         </div>
                       ))}

                      </div>
                    )}

                </div>

            </div>

    )

}

export default CategoryDetails