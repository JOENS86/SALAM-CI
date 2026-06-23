import { FaBookOpen, FaHome } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function CoursesHero() {

  // =========================
  // NAVIGATION
  // =========================

  const navigate = useNavigate()

  return (

    <div
      className="
      bg-gradient-to-r
      from-[#0b1736]
      via-[#101d4d]
      to-[#1a237e]
      text-white
      pt-20
      pb-32
      "
    >

      <div className="max-w-7xl mx-auto px-6">

        {/* =========================
            BARRE SUPERIEURE
        ========================= */}

        <div className="flex justify-between items-center mb-10">

          {/* BADGE */}

          <div
            className="
            inline-flex
            items-center
            gap-2
            bg-purple-600
            px-4
            py-2
            rounded-full
            text-sm
            font-medium
            "
          >

            <FaBookOpen />

            Catalogue de cours

          </div>

          {/* BOUTON RETOUR */}

          <button
            onClick={() => navigate("/")}
            className="
            flex
            items-center
            gap-2
            bg-white/10
            hover:bg-white/20
            px-4
            py-2
            rounded-xl
            transition-all
            duration-300
            "
          >

            <FaHome />

            Retour au menu

          </button>

        </div>

        {/* =========================
            TITRE
        ========================= */}

        <h1 className="text-6xl font-bold">

          Cours Variés

        </h1>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <p className="mt-6 text-xl text-gray-300 max-w-3xl">

          Découvrez notre catalogue de formations
          et développez vos compétences avec
          des cours dispensés par des experts.

        </p>

      </div>

    </div>

  )

}

export default CoursesHero