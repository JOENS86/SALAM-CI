{/* Ce fichier servira pour 3 choses :
👁️ Voir le certificat
🖨️ Imprimer
📄 Télécharger le PDF
*/}

// =========================
// IMPORTS
// =========================

import {
    FaShieldAlt,
    FaCheckCircle
  } from "react-icons/fa"
  
  // =========================
  // COMPONENT
  // =========================
  
  function CertificatePrint() {
  
    return (

        <div
         id="certificate-print"
         className="
         relative
         bg-white
         w-[794px]
         min-h-[1163px]
         mx-auto
         rounded-[30px]
         overflow-hidden
         shadow-2xl

         print:w-[794px]
         print:min-h-[1163px]
         print:rounded-none
         print:shadow-none
         print:mx-0
         print:m-0
         print:p-0
         print:overflow-hidden
         "
         >
      
          {/* ========================= */}
          {/* BANDEAU SUPERIEUR */}
          {/* ========================= */}
      
          <div className="h-4 bg-gradient-to-r from-[#0b1736] via-purple-600 to-[#0b1736]" />
      
          {/* ========================= */}
          {/* FILIGRANE */}
          {/* ========================= */}
      
          <div
            className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            pointer-events-none
            overflow-hidden
            "
          >
      
            <h1
              className="
              text-[180px]
              font-black
              text-gray-100
              opacity-30
              rotate-[-25deg]
              select-none
              "
            >
              SALAM CI
            </h1>
      
          </div>
      
          {/* ========================= */}
          {/* CONTENU */}
          {/* ========================= */}
      
          <div
            className="
            relative
            z-10
            px-[70px]
            py-[70px]
            h-[1095px]
            flex
            flex-col
            justify-between
            "
            >    

            {/* ========================= */}
            {/* LOGO */}
            {/* ========================= */}
      
            <div className="text-center">
      
              <h1 className="text-6xl font-black text-[#0b1736]">
                SALAM <span className="text-purple-600">CI</span>
              </h1>
      
              <p className="mt-3 uppercase tracking-[8px] text-gray-500">
                Plateforme d'apprentissage numérique
              </p>
      
            </div>
      
            {/* ========================= */}
            {/* BADGE */}
            {/* ========================= */}
      
            <div className="flex justify-center mt-10">
      
              <div
                className="
                bg-purple-100
                text-purple-700
                px-8
                py-3
                rounded-full
                flex
                items-center
                gap-3
                font-semibold
                "
              >
      
                <FaCheckCircle />
      
                Certificat Officiel
      
              </div>
      
            </div>
      
            {/* ========================= */}
            {/* TITRE */}
            {/* ========================= */}
      
            <div className="text-center mt-14">
      
              <p className="tracking-[10px] uppercase text-gray-400">
                Certifie que
              </p>
      
            </div>
      
            {/* ========================= */}
            {/* NOM */}
            {/* ========================= */}
      
            <div className="text-center mt-8">
      
              <h2 className="text-6xl font-extrabold text-[#0b1736]">
                Koukougnon Tagbo Axel Emmanuel
              </h2>
      
            </div>
      
            {/* ========================= */}
            {/* DESCRIPTION */}
            {/* ========================= */}
      
            <div className="text-center mt-10">
      
              <p className="text-xl text-gray-600 leading-10">
                a validé avec succès toutes les compétences requises pour la formation
              </p>
      
              <h3 className="mt-8 text-4xl font-bold text-purple-600">
                Développement Web Full Stack React & Node.js
              </h3>
      
              <p className="mt-5 text-gray-500">
                Formation dispensée sur la plateforme SALAM CI
              </p>
      
            </div>
      
            {/* ========================= */}
            {/* INFORMATIONS */}
            {/* ========================= */}
      
            <div
              className="
              grid
              grid-cols-3
              items-end
              gap-10
              mt-8
              "
              >
      
              <div className="bg-[#f8f9fc] rounded-2xl p-6 text-center">
      
                <p className="text-sm uppercase text-gray-400">
                  Formateur
                </p>
      
                <h3 className="font-bold text-xl mt-3">
                  M. Kouassi
                </h3>
      
              </div>
      
              <div className="bg-[#f8f9fc] rounded-2xl p-6 text-center">
      
                <p className="text-sm uppercase text-gray-400">
                  Date
                </p>
      
                <h3 className="font-bold text-xl mt-3">
                  23 Juin 2026
                </h3>
      
              </div>
      
              <div className="bg-[#f8f9fc] rounded-2xl p-6 text-center">
      
                <p className="text-sm uppercase text-gray-400">
                  N° Certificat
                </p>
      
                <h3 className="font-bold text-xl mt-3">
                  SALAM-2026-CRT-001
                </h3>
      
              </div>
      
            </div>
      
            {/* ========================= */}
            {/* SIGNATURES */}
            {/* ========================= */}
      
            <div
              className="
              grid
              grid-cols-3
              items-end
              mt-8
              gap-10
              "
            >
      
              <div className="text-center">
      
                <h3 className="italic text-3xl text-[#0b1736]">
                  M. Kouassi
                </h3>
      
                <div className="border-b mt-5 border-gray-400" />
      
                <p className="mt-3 text-gray-500">
                  Formateur
                </p>
      
              </div>
      
              <div className="text-center">
      
                <div
                  className="
                  w-36
                  h-36
                  rounded-2xl
                  border-4
                  border-purple-300
                  mx-auto
                  flex
                  items-center
                  justify-center
                  bg-purple-50
                  "
                >
                  QR CODE
                </div>
      
                <p className="mt-4 text-gray-500">
                  Scanner pour vérifier
                </p>
      
              </div>
      
              <div className="text-center">
      
                <h3 className="italic text-3xl text-[#0b1736]">
                  Direction SALAM CI
                </h3>
      
                <div className="border-b mt-5 border-gray-400" />
      
                <p className="mt-3 text-gray-500">
                  Direction pédagogique
                </p>
      
              </div>
      
            </div>
      
            {/* ========================= */}
            {/* PIED */}
            {/* ========================= */}
      
            <div
              className="
              mt-16
              mb-8
              border-t
              pt-8
              flex
              justify-between
              items-center
              "
            >
      
              <div
                className="
                flex
                items-center
                gap-3
                text-gray-500
                "
              >
      
                <FaShieldAlt className="text-purple-600 text-2xl" />
      
                Certificat numérique sécurisé
      
              </div>
      
              <div className="text-sm text-gray-500">
                www.salam-ci.com
              </div>
      
            </div>
      
          </div>
      
          {/* ========================= */}
          {/* BANDEAU BAS */}
          {/* ========================= */}
      
          <div
            className="
            absolute
            bottom-0
            left-0
            right-0
            h-4
            bg-gradient-to-r
            from-[#0b1736]
            via-purple-600
            to-[#0b1736]
            "
            />      
        </div>
      
      )
  
  }
  
  export default CertificatePrint