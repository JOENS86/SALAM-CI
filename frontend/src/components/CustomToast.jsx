// =========================
// IMPORTS
// =========================

import {
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaExclamationTriangle
  } from "react-icons/fa"
  
  // =========================
  // COMPOSANT
  // =========================
  
  function CustomToast({
  
    title,
    message,
    type = "success"
  
  }) {
  
    // =========================
    // CHOIX DE L'ICÔNE
    // =========================
  
    const icons = {
  
      success: <FaCheckCircle className="text-green-400 text-2xl" />,
  
      error: <FaTimesCircle className="text-red-400 text-2xl" />,
  
      info: <FaInfoCircle className="text-blue-400 text-2xl" />,
  
      warning:
        <FaExclamationTriangle className="text-yellow-400 text-2xl" />
  
    }
  
    return (
  
      <div
  
        className="
        w-[370px]
        bg-gradient-to-r
        from-[#1E1B4B]
        via-[#5B21B6]
        to-[#7C3AED]
        rounded-2xl
        shadow-2xl
        p-5
        text-white
        "
  
      >
  
        {/* ========================= */}
        {/* EN-TÊTE */}
        {/* ========================= */}
  
        <div className="flex gap-4 items-start">
  
          {/* Icône */}
  
          {icons[type]}
  
          {/* Texte */}
  
          <div>
  
            <h3 className="font-bold text-lg">
  
              SALAM CI
  
            </h3>
  
            <p className="font-semibold mt-1">
  
              {title}
  
            </p>
  
            <p className="text-sm opacity-90 mt-1">
  
              {message}
  
            </p>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default CustomToast