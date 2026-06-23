import { FaSearch } from "react-icons/fa"

function CoursesFilters() {

  return (

    <div
      className="
      bg-white
      rounded-3xl
      shadow-xl
      p-8
      "
    >

      <div className="relative">

        <FaSearch
          className="
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Rechercher un cours..."
          className="
          w-full
          border
          rounded-2xl
          py-4
          pl-14
          pr-4
          "
        />

      </div>

      <div className="flex gap-3 flex-wrap mt-8">

        <button className="bg-purple-600 text-white px-5 py-2 rounded-xl">
          Toutes
        </button>

        <button className="border px-5 py-2 rounded-xl">
          Informatique
        </button>

        <button className="border px-5 py-2 rounded-xl">
          Réseau
        </button>

        <button className="border px-5 py-2 rounded-xl">
          Développement Web
        </button>

        <button className="border px-5 py-2 rounded-xl">
          Cybersécurité
        </button>

      </div>

    </div>

  )

}

export default CoursesFilters