import AdminLayout from "../../layouts/AdminLayout"
import { useNavigate } from "react-router-dom"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolder
} from "react-icons/fa"
import { toast } from "react-toastify";

import { useEffect, useState } from "react"
import API from "../../services/api"
import { FaSearch } from "react-icons/fa"

function Categories() {
// =========================
// NAVIGATION
// =========================

const navigate = useNavigate()

// =========================
// DONNEES
// =========================
const [categories, setCategories] = useState([])

// =========================
// STATISTIQUES
// =========================
const [stats, setStats] = useState({})

// =========================
// RECHERCHE
// =========================
const [search, setSearch] = useState("")

// =========================
// PAGINATION
// =========================
const [page, setPage] = useState(1)
const [limit] = useState(9)
const [totalPages, setTotalPages] = useState(1)
const [totalCategories, setTotalCategories] = useState(0)

// =========================
// LOADER
// =========================
const [loading, setLoading] = useState(true)

// =========================
// MODAL MODIFICATION
// =========================

const [showEditModal, setShowEditModal] = useState(false)
const [editCategory, setEditCategory] = useState({
    _id: "",
    name: "",
    description: "",
    color: "#7C3AED"
})

// =========================
// SUPPRESSION
// =========================
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [selectedCategory, setSelectedCategory] = useState(null)

// =========================
// RECUPERER LES CATEGORIES
// =========================
const getCategories = async () => {

  try {

      setLoading(true)

      const res = await API.get(

          `/categories?page=${page}&limit=${limit}&search=${search}`

      )

      setCategories(res.data.categories)

      setTotalPages(res.data.totalPages)

      setTotalCategories(res.data.totalCategories)

  }

  catch(error){

      console.log(error)

  }

  finally{

      setLoading(false)

  }

}


// =========================
// STATISTIQUES
// =========================
const getStats = async () => {

  try {

      const res = await API.get("/categories/stats")

      setStats(res.data)

  }

  catch(error){

      console.log(error)

  }

}

useEffect(()=>{
  getCategories()
  getStats()
},[page,search])


// =========================
// SUPPRIMER UNE CATEGORIE
// =========================
const deleteCategory = async () => {

  try {

      await API.delete(

          `/categories/${selectedCategory._id}`

      )

      toast.success("Catégorie supprimée avec succès.")

      setShowDeleteModal(false)

      setSelectedCategory(null)

      getCategories()

      getStats()

  }

  catch(error){

      console.log(error)

      toast.error("Erreur lors de la suppression.")

  }

}


// =========================
// MODAL AJOUT
// =========================
const [showAddModal, setShowAddModal] = useState(false)
const [newCategory, setNewCategory] = useState({

    name: "",
    description: "",
    color: "#7C3AED"

})


// =========================
// AJOUTER UNE CATEGORIE
// =========================
const createCategory = async () => {

  try {

      await API.post("/categories", newCategory)

      toast.success("Catégorie ajoutée avec succès.")

      setShowAddModal(false)

      setNewCategory({

          name: "",
          description: "",
          color: "#7C3AED"

      })

      getCategories()

      getStats()

  }

  catch (error) {

      toast.error(

          error.response?.data?.message ||

          "Erreur lors de l'ajout."

      )

  }

}


// =========================
// MODIFIER UNE CATEGORIE
// =========================

const updateCategory = async () => {
  try{
      await API.put(
          `/categories/${editCategory._id}`,
          editCategory
      )

      toast.success(
          "Catégorie modifiée avec succès."
      )

      setShowEditModal(false)
      setEditCategory({
        _id: "",
        name: "",  
        description: "",    
        color: "#7C3AED"
    })
      getCategories()
      getStats()
  }

  catch(error){
      console.log(error)
      toast.error(
          "Erreur lors de la modification."
      )
  }
}

console.log(categories)
  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Gestion des Catégories
          </h1>

          <p className="text-gray-500 mt-2">
            Organisez les cours par catégorie
          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="
          bg-gradient-to-r
          from-purple-600
          to-indigo-600
          text-white
          px-6
          py-4
          rounded-2xl
          flex
          items-center
          gap-3
          shadow-lg
          hover:shadow-1xl
          hover:-translate-y-1
          hover:scale-105
          transition-all
          duration-300
          "
        >

          <FaPlus />

          Ajouter une catégorie

        </button>

      </div>


{/* STATS */}

    <div className="grid md:grid-cols-3 gap-6 mb-8">

    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" >

        <div className="flex justify-between items-center">

            <div>

                <p className="text-gray-500">
                    Catégories
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.totalCategories || 0}
                </h2>

            </div>

            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">

                <FaFolder />

            </div>

        </div>

    </div>

    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" >

        <div className="flex justify-between items-center">

            <div>

                <p className="text-gray-500">
                    Total cours
                </p>

                <h2 className="text-4xl font-bold mt-2">

                {0}

                </h2>

            </div>

            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">

                📚

            </div>
        </div>
    </div>

    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" >

        <div className="flex justify-between items-center">

            <div>

                <p className="text-gray-500">
                    Plus utilisée
                </p>

                <h2 className="text-xl font-bold mt-2">

                {categories.length > 0 ? categories[0].name : "-"}

                </h2>

            </div>

            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">

                ⭐

            </div>

        </div>

    </div>

    </div>

    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center mb-8">
      <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        type="text"
        placeholder="Rechercher une catégorie..."
        className="w-full outline-none"
      />
    </div>


      {/* CARTES */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {loading ? (
            [...Array(6)].map((_, index) => (

              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse" >
                <div className="w-14 h-14 rounded-2xl bg-gray-200 mb-5"></div>
                <div className="w-40 h-6 bg-gray-200 rounded mb-4"></div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-3"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>

            ))
          ) : (
 
            
          categories.map((category, index) => (

            <div key={index}
                 onClick={() => navigate(`/admin/categories/${category._id}`)}
                 className="
                  bg-white
                  rounded-3xl
                  p-6
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  cursor-pointer
                  transition "
            >

            <div className="flex justify-between items-center">
              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-purple-100
                text-purple-600
                flex
                items-center
                justify-center
                text-xl
              ">
                 <FaFolder />
              </div>

              <div className="flex gap-3">
                <button
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditCategory({
                        _id: category._id,
                        name: category.name,          
                        description: category.description,           
                        color: category.color       
                    })
                      setShowEditModal(true)
                    }}
                >
                  <FaEdit />
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCategory(category)
                    setShowDeleteModal(true)
                  }}
                >
                  <FaTrash />
                </button>
              </div>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {category.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {category.totalCourses === 0
                ? "Aucun cours"
                : `${category.totalCourses} cours disponible${category.totalCourses > 1 ? "s" : ""}`}
            </p>

            <p className="text-gray-400 text-sm mt-4">
               Créée le {new Date(category.createdAt).toLocaleDateString("fr-FR")}
            </p>

          </div>
          ))
          )}

{/* =========================
    MODAL AJOUT
========================= */}

{showAddModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ajouter une catégorie
        </h2>

        {/* Nom */}

        <div className="mb-4">
            <label className="block mb-2 font-medium">
                Nom
            </label>

            <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                    setNewCategory({
                        ...newCategory,
                        name: e.target.value,
                    })
                }

                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>

        {/* Description */}

        <div className="mb-4">
            <label className="block mb-2 font-medium">
                Description
            </label>

            <textarea
                rows="4"
                value={newCategory.description}
                onChange={(e) =>
                    setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                    })
                }

                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>

        {/* Couleur */}

        <div className="mb-6">
            <label className="block mb-2 font-medium">
                Couleur
            </label>

            <input
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                    setNewCategory({
                        ...newCategory,
                        color: e.target.value,
                    })
                }
                className="w-20 h-12 border rounded-lg cursor-pointer"
            />

        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-4">
            <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
                Annuler
            </button>

            <button
                onClick={createCategory}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl transition"
            >
                Enregistrer
            </button>

        </div>
    </div>
</div>

)}


{/* =========================
    MODAL MODIFICATION
========================= */}
{showEditModal && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Modifier la catégorie
        </h2>


        {/* =========================
            NOM
        ========================= */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                Nom
            </label>

            <input
                type="text"
                value={editCategory.name}
                onChange={(e)=>
                    setEditCategory({
                        ...editCategory,
                        name:e.target.value
                    })
                }
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>


        {/* =========================
            DESCRIPTION
        ========================= */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                Description
            </label>

            <textarea
                rows="4"
                value={editCategory.description}
                onChange={(e)=>
                    setEditCategory({
                        ...editCategory,
                        description:e.target.value
                    })
                }
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>


        {/* =========================
            COULEUR
        ========================= */}
        <div className="mb-6">
            <label className="block mb-2 font-medium">
                Couleur
            </label>

            <input
                type="color"
                value={editCategory.color}
                onChange={(e)=>
                    setEditCategory({
                        ...editCategory,
                        color:e.target.value
                    })
                }
                className="w-20 h-12 border rounded-lg cursor-pointer"
            />
        </div>


        {/* =========================
            BOUTONS
        ========================= */}
        <div className="flex justify-end gap-4">
            <button
                onClick={()=>setShowEditModal(false)}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
                Annuler
            </button>


            <button
                onClick={updateCategory}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl transition"
            >
                Enregistrer les modifications
            </button>

        </div>
    </div>
</div>

)}


{/* =========================
    MODAL SUPPRESSION
========================= */}

{showDeleteModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">

            Supprimer la catégorie

        </h2>

        <p className="text-gray-600 mb-8">

            Voulez-vous vraiment supprimer

            <span className="font-bold">

                {" "}
                {selectedCategory?.name}

            </span>

            ?

        </p>

        <div className="flex justify-end gap-4">

            <button

                onClick={() => {

                    setShowDeleteModal(false)

                    setSelectedCategory(null)

                }}

                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"

            >

                Annuler

            </button>

            <button

                onClick={deleteCategory}

                className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"

            >

                Supprimer

            </button>

        </div>

    </div>

</div>

)}

      </div>

    {/* =========================
            PAGINATION
    ========================= */}

    {!loading && totalPages > 1 && (
      <div className="flex justify-center items-center gap-3 mt-10">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-xl transition ${
            page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          Précédent
        </button>

    <span className="font-semibold text-gray-700">
        Page {page} sur {totalPages}
    </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-xl transition ${
            page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          Suivant
        </button>

      </div>

  )}  

    </AdminLayout>

  )

}

export default Categories