// =========================
// IMPORTS
// =========================
import {
    FaAward,
    FaBell,
    FaHome
  } from "react-icons/fa" 
import { useNavigate } from "react-router-dom"

// =========================
// COMPONENT
// =========================

function CertificateHero() {

    const navigate = useNavigate()
    const user = JSON.parse(
      localStorage.getItem("user")
    )

  return (

    <section
      className="
      bg-gradient-to-r
      from-[#0b1736]
      via-[#101d4d]
      to-[#1a237e]
      text-white
      py-12
      "
    >

      <div className="max-w-7xl mx-auto px-6 text-center">


{/* BARRE SUPERIEURE */}

<div className="grid grid-cols-3 items-center mb-12">

  {/* GAUCHE : HOME */}

  <div className="flex justify-start">

    <button
      onClick={() => navigate("/")}
      className="
      w-10
      h-10
      rounded-xl
      bg-purple-600
      hover:bg-purple-700
      flex
      items-center
      justify-center
      transition
      "
    >
      <FaHome />
    </button>

  </div>

  {/* CENTRE : TITRE CERTIFICATS */}

  <div className="flex justify-center">

    <div
      className="
      inline-flex
      items-center
      gap-2
      bg-purple-600
      px-5
      py-3
      rounded-full
      "
    >
      <FaAward />

      Certificats SALAM CI

    </div>

  </div>

  {/* DROITE : UTILISATEUR */}

  <div className="flex justify-end">

    {user && (

      <div className="flex items-center gap-4">

        {/* CLOCHE */}

        <div className="relative">

          <FaBell className="text-2xl" />

          <span
            className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            w-5
            h-5
            rounded-full
            flex
            items-center
            justify-center
            "
          >
            2
          </span>

        </div>

        {/* AVATAR */}

        <div
          className="
          w-12
          h-12
          rounded-full
          bg-blue-500
          flex
          items-center
          justify-center
          font-bold
          "
        >
          {user?.name?.charAt(0)}
        </div>

        {/* NOM */}

        <span className="font-medium">
          {user?.name}
        </span>

      </div>

    )}

  </div>

</div>

        {/* TITRE */}

        <h1 className="text-6xl font-bold mt-8">

          Valorisez vos compétences

        </h1>

        {/* DESCRIPTION */}

        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">

          Accédez à vos certificats numériques,
          téléchargez-les et partagez-les
          facilement.

        </p>

      </div>

    </section>

  )

}

export default CertificateHero