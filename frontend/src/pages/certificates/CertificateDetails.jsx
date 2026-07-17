// =========================
// IMPORTS
// =========================

import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaCheckCircle
} from "react-icons/fa"

import {
  useNavigate
} from "react-router-dom"

import {
  useRef
} from "react"

import {
  useReactToPrint
} from "react-to-print"

// =========================
// CERTIFICAT
// =========================

import CertificatePrint from "./CertificatePrint"
// =========================
// COMPONENT
// =========================

function CertificateDetails() {

  // =========================
  // NAVIGATION
  // =========================

  const navigate = useNavigate()

// =========================
// REFERENCE DU CERTIFICAT
// =========================

const certificateRef = useRef(null)

// =========================
// IMPRESSION
// =========================

const handlePrint = useReactToPrint({

  contentRef: certificateRef,

  documentTitle: "Certificat SALAM CI",

  pageStyle: `
    @page{
      size:A4 portrait;
      margin:0;
    }

    body{
      margin:0;
      padding:0;
      background:white;
    }

    @media print{

      body{
        -webkit-print-color-adjust:exact;
        print-color-adjust:exact;
      }

    }
  `

})

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div
        className="
        bg-white
        border-b
        sticky
        top-0
        z-50
        "
      >

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
  print:hidden
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
      onClick={handlePrint}
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

      </div>

      {/* ========================= */}
      {/* CONTENU */}
      {/* ========================= */}

      <div className="max-w-7xl mx-auto px-8 py-14">

        {/* ========================= */}
        {/* CERTIFICAT */}
        {/* ========================= */}

        <div ref={certificateRef}>
          <CertificatePrint />
        </div>
        
        {/* ========================= */}
        {/* VALIDATION */}
        {/* ========================= */}

        <div

          className="
          mt-10
          bg-green-50
          border
          border-green-200
          rounded-3xl
          p-8
          "

        >

          <div

            className="
            flex
            items-center
            gap-3
            text-green-700
            font-bold
            text-lg
            "

          >

            <FaCheckCircle />

            Certificat authentique et valide

          </div>

          <p className="mt-4 text-gray-600 leading-8">

            Ce certificat est signé numériquement
            par la plateforme <strong>SALAM CI</strong>.

            <br />

            Il peut être vérifié grâce à son
            numéro unique ou via le QR Code
            présent sur le certificat.

          </p>

          <div
            className="
            mt-5
            text-purple-600
            font-semibold
            break-all
            "
          >

            https://salam-ci.com/verify/SALAM-2026-CRT-001

          </div>

        </div>

      </div>

    </div>

  )

}

export default CertificateDetails