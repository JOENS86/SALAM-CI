// =========================
// IMPORTS
// =========================

import {
    FaArrowLeft,
    FaDownload,
    FaPrint,
    FaCheckCircle
  } from "react-icons/fa"
  
  import { useNavigate } from "react-router-dom"
  
  // =========================
  // COMPONENT
  // =========================
  
  function CertificateDetails() {
  
    const navigate = useNavigate()
  
    return (
  
      <div className="min-h-screen bg-[#f5f7fb]">
  
        {/* ========================= */}
        {/* BARRE SUPERIEURE */}
        {/* ========================= */}
  
        <div
          className="
          bg-white
          border-b
          px-8
          py-4
          flex
          justify-between
          items-center
          "
        >
  
          {/* RETOUR */}
  
          <button
            onClick={() => navigate("/my-certificates")}
            className="
            flex
            items-center
            gap-2
            text-purple-600
            font-semibold
            hover:text-purple-800
            "
          >
            <FaArrowLeft />
  
            Retour aux certificats
  
          </button>
  
          {/* ACTIONS */}
  
          <div className="flex gap-3">
  
            <button
              className="
              border
              border-purple-300
              px-5
              py-2
              rounded-xl
              flex
              items-center
              gap-2
              hover:bg-purple-50
              "
            >
              <FaPrint />
  
              Imprimer
  
            </button>
  
            <button
              className="
              bg-gradient-to-r
              from-purple-600
              to-purple-500
              text-white
              px-5
              py-2
              rounded-xl
              flex
              items-center
              gap-2
              "
            >
              <FaDownload />
  
              Télécharger PDF
  
            </button>
  
          </div>
  
        </div>
  
        {/* ========================= */}
        {/* CERTIFICAT */}
        {/* ========================= */}
  
        <div className="max-w-4xl mx-auto py-12 px-6">
  
          <div
            className="
            bg-white
            rounded-3xl
            shadow-xl
            border-t-8
            border-purple-600
            p-10
            "
          >
  
            {/* LOGO */}
  
            <div className="text-center">
  
              <h2
                className="
                text-4xl
                font-bold
                text-purple-700
                "
              >
                SALAM CI
              </h2>
  
              <p className="text-gray-500 mt-2">
  
                Plateforme d'apprentissage numérique
  
              </p>
  
            </div>
  
            {/* TITRE */}
  
            <div className="text-center mt-10">
  
              <p
                className="
                uppercase
                tracking-[8px]
                text-gray-400
                "
              >
                Certifie que
              </p>
  
            </div>
  
            {/* NOM ETUDIANT */}
  
            <h1
              className="
              text-center
              text-5xl
              font-bold
              text-[#0b1736]
              mt-8
              "
            >
              Koukougnon Tagbo Axel Emmanuel
            </h1>
  
            {/* TEXTE */}
  
            <p
              className="
              text-center
              text-gray-600
              mt-8
              "
            >
              a suivi avec succès et satisfait
              aux exigences requises pour la formation
            </p>
  
            {/* FORMATION */}
  
            <h3
              className="
              text-center
              text-3xl
              font-bold
              text-purple-600
              mt-6
              "
            >
              Développement Web Full Stack React & Node.js
            </h3>
  
            <p
              className="
              text-center
              text-gray-500
              mt-4
              "
            >
              dispensée sur la plateforme SALAM CI
            </p>
  
            {/* INFOS */}
  
            <div
              className="
              grid
              md:grid-cols-3
              gap-8
              mt-14
              border-t
              border-b
              py-8
              "
            >
  
              <div>
  
                <p className="text-gray-400 text-sm">
  
                  FORMATEUR
  
                </p>
  
                <h4
                  className="
                  font-bold
                  text-[#0b1736]
                  mt-2
                  "
                >
                  M. Kouassi
                </h4>
  
              </div>
  
              <div>
  
                <p className="text-gray-400 text-sm">
  
                  DATE D'ÉMISSION
  
                </p>
  
                <h4
                  className="
                  font-bold
                  text-[#0b1736]
                  mt-2
                  "
                >
                  23 Juin 2026
                </h4>
  
              </div>
  
              <div>
  
                <p className="text-gray-400 text-sm">
  
                  N° CERTIFICAT
  
                </p>
  
                <h4
                  className="
                  font-bold
                  text-[#0b1736]
                  mt-2
                  "
                >
                  SALAM-2026-CRT-001
                </h4>
  
              </div>
  
            </div>
  
            {/* SIGNATURES */}
  
            <div
              className="
              grid
              md:grid-cols-3
              gap-10
              mt-12
              text-center
              "
            >
  
              {/* FORMATEUR */}
  
              <div>
  
                <h3
                  className="
                  text-2xl
                  italic
                  text-[#0b1736]
                  "
                >
                  M. Kouassi
                </h3>
  
                <div
                  className="
                  border-t
                  border-purple-300
                  mt-3
                  pt-2
                  "
                >
                  Formateur
                </div>
  
              </div>
  
              {/* QR CODE */}
  
              <div>
  
                <div
                  className="
                  w-24
                  h-24
                  bg-purple-100
                  mx-auto
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-purple-600
                  "
                >
                  QR
                </div>
  
                <p
                  className="
                  text-xs
                  text-gray-500
                  mt-3
                  "
                >
                  Scanner pour vérifier
                </p>
  
              </div>
  
              {/* DIRECTION */}
  
              <div>
  
                <h3
                  className="
                  text-2xl
                  italic
                  text-[#0b1736]
                  "
                >
                  Direction SALAM CI
                </h3>
  
                <div
                  className="
                  border-t
                  border-purple-300
                  mt-3
                  pt-2
                  "
                >
                  Direction pédagogique
                </div>
  
              </div>
  
            </div>
  
          </div>
  
          {/* ========================= */}
          {/* VALIDATION */}
          {/* ========================= */}
  
          <div
            className="
            mt-8
            bg-green-50
            border
            border-green-200
            rounded-2xl
            p-6
            "
          >
  
            <div
              className="
              flex
              items-center
              gap-3
              text-green-700
              font-bold
              "
            >
  
              <FaCheckCircle />
  
              Certificat authentique et valide
  
            </div>
  
            <p className="mt-3 text-gray-600">
  
              Lien de vérification :
  
              <span className="ml-2 text-purple-600">
  
                https://salam-ci.com/verify/SALAM-2026-CRT-001
  
              </span>
  
            </p>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default CertificateDetails