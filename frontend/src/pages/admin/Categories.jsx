import AdminLayout from "../../layouts/AdminLayout"

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolder
} from "react-icons/fa"

function Categories() {

  const categories = [

    {
      name: "Développement Web",
      courses: 45
    },

    {
      name: "Intelligence Artificielle",
      courses: 28
    },

    {
      name: "Cybersécurité",
      courses: 17
    },

    {
      name: "Data Science",
      courses: 23
    },

    {
      name: "Cloud Computing",
      courses: 12
    }

  ]

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
          onClick={() =>
            alert(
              "Ajout de catégorie bientôt disponible 🚀"
            )
          }
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
          "
        >

          <FaPlus />

          Ajouter une catégorie

        </button>

      </div>

      {/* CARTES */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {categories.map((category, index) => (

          <div
            key={index}
            className="
            bg-white
            rounded-3xl
            p-6
            shadow-sm
            hover:shadow-xl
            transition
            "
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
                "
              >

                <FaFolder />

              </div>

              <div className="flex gap-3">

                <button className="text-blue-600">

                  <FaEdit />

                </button>

                <button className="text-red-600">

                  <FaTrash />

                </button>

              </div>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {category.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {category.courses} cours
            </p>

          </div>

        ))}

      </div>

    </AdminLayout>

  )

}

export default Categories