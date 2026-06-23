// =========================
// IMPORTS
// =========================

import { Link } from "react-router-dom"

// =========================
// COMPONENT
// =========================

function CertificateCTA() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <section className="pb-24">

      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          rounded-3xl
          p-12
          text-white
          flex
          flex-col
          lg:flex-row
          items-center
          justify-between
          gap-8
          "
        >

          {/* TEXTE */}

          <div>

            <h2 className="text-4xl font-bold">

              Prêt à valoriser vos compétences ?

            </h2>

            <p className="mt-4 text-lg text-gray-100">

              Retrouvez et téléchargez tous vos certificats obtenus sur SALAM CI.

            </p>

          </div>

          {/* BOUTON */}

          {user ? (

            <Link to="/student-certificates">

              <button
                className="
                bg-white
                text-purple-700
                px-8
                py-4
                rounded-xl
                font-bold
                hover:scale-105
                transition
                "
              >
                Voir mes certificats
              </button>

            </Link>

          ) : (

            <Link to="/login">

              <button
                className="
                bg-white
                text-purple-700
                px-8
                py-4
                rounded-xl
                font-bold
                hover:scale-105
                transition
                "
              >
                Se connecter
              </button>

            </Link>

          )}

        </div>

      </div>

    </section>

  )

}

export default CertificateCTA