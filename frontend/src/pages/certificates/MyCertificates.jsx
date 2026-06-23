// =========================
// IMPORTS
// =========================

import {
    FaSearch,
    FaAward,
    FaEye,
    FaDownload
  } from "react-icons/fa"
  
  import CertificateHero from "../../components/certificates/CertificateHero"
  import { useNavigate } from "react-router-dom"

  // =========================
  // DONNEES TEST
  // =========================
  
  const certificates = [
    {
      id: 1,
      title: "Développement Web Full Stack",
      teacher: "M. Konan",
      date: "15 Mars 2026",
      status: "Validé"
    },
    {
      id: 2,
      title: "React JS Avancé",
      teacher: "Mme Kouassi",
      date: "10 Février 2026",
      status: "Validé"
    },
    {
      id: 3,
      title: "Node.js Professionnel",
      teacher: "Dr. Yao",
      date: "22 Janvier 2026",
      status: "Validé"
    },
    {
      id: 4,
      title: "Intelligence Artificielle",
      teacher: "M. Diallo",
      date: "En attente",
      status: "En attente"
    }
  ]
  
  // =========================
  // COMPONENT
  // =========================
  
  function MyCertificates() {
   
    const navigate = useNavigate()

    return (
  
      <div className="bg-[#f5f7fb] min-h-screen">
  
        {/* HERO SALAM CI */}
  
        <CertificateHero />
  
        {/* CONTENU */}
  
        <div className="max-w-7xl mx-auto px-6 py-12">
  
          {/* FIL D'ARIANE */}
  
        <div className="text-sm mb-4 flex items-center">

          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-purple-600 transition">
             Accueil
          </button>

          <span className="mx-2 text-gray-400">
               ›
          </span>

          <span className="text-purple-600 font-medium">
             Mes Certificats
          </span>

</div>
  
          {/* TITRE */}
  
          <h1 className="text-5xl font-bold text-[#0b1736]">
  
            Mes Certificats
  
          </h1>
  
          <p className="text-gray-500 mt-3">
  
            4 certificats obtenus
  
          </p>
  
          {/* RECHERCHE */}
  
          <div className="flex gap-4 mt-10 flex-wrap">
  
            <div className="flex-1 relative min-w-[300px]">
  
              <FaSearch
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />
  
              <input
                type="text"
                placeholder="Rechercher un certificat..."
                className="
                w-full
                bg-white
                border
                rounded-xl
                pl-12
                pr-4
                py-4
                outline-none
                "
              />
  
            </div>
  
            <select
              className="
              bg-white
              border
              rounded-xl
              px-5
              py-4
              "
            >
              <option>Tous les statuts</option>
              <option>Validé</option>
              <option>En attente</option>
            </select>
  
          </div>
  
          {/* BADGES */}
  
          <div className="flex gap-4 mt-6 flex-wrap">
  
            <div
              className="
              bg-green-100
              text-green-700
              px-5
              py-3
              rounded-full
              font-semibold
              "
            >
              3 Validés
            </div>
  
            <div
              className="
              bg-yellow-100
              text-yellow-700
              px-5
              py-3
              rounded-full
              font-semibold
              "
            >
              1 En attente
            </div>
  
          </div>
  
          {/* LISTE CERTIFICATS */}
  
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
  
            {certificates.map((certificate) => (
  
              <div
                key={certificate.id}
                className="
                bg-white
                rounded-3xl
                shadow-md
                hover:shadow-xl
                transition-all
                p-6
                "
              >
  
                {/* HAUT */}
  
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
                    text-2xl
                    "
                  >
                    <FaAward />
                  </div>
  
                  <span
                    className={
                      certificate.status === "Validé"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {certificate.status}
                  </span>
  
                </div>
  
                {/* INFOS */}
  
                <h2 className="text-xl font-bold mt-6">
  
                  {certificate.title}
  
                </h2>
  
                <p className="text-gray-500 mt-3">
  
                  Formateur : {certificate.teacher}
  
                </p>
  
                <p className="text-gray-500">
  
                  Date : {certificate.date}
  
                </p>
  
                {/* ACTIONS */}
  
                <div className="grid grid-cols-2 gap-3 mt-8">
  
                <button onClick={() => navigate("/certificate-details/1")} className="bg-gradient-to-r from-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition">
                    <FaEye />
                    Voir
                  </button>
  
                  <button
                    className="
                    border-2
                    border-purple-600
                    text-purple-600
                    py-3
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                  >
                    <FaDownload />
                    PDF
                  </button>
  
                </div>
  
              </div>
  
            ))}
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default MyCertificates