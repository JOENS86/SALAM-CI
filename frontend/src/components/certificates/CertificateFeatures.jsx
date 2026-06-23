// =========================
// IMPORTS
// =========================

import {
    FaAward,
    FaDownload,
    FaCheckCircle,
    FaHistory,
    FaPrint,
    FaMagic
  } from "react-icons/fa"
  import { useNavigate } from "react-router-dom"

  // =========================
  // DONNEES
  // =========================
  
  const features = [
    {
      icon: <FaAward />,
      title: "Consulter vos certificats",
      description:
        "Retrouvez tous vos certificats obtenus après la réussite de vos formations SALAM CI."
    },
    {
      icon: <FaDownload />,
      title: "Télécharger en PDF",
      description:
        "Exportez vos certificats au format PDF pour les partager ou les enregistrer."
    },
    {
      icon: <FaCheckCircle />,
      title: "Vérifier l'authenticité",
      description:
        "Chaque certificat possède un identifiant unique pour garantir sa validité."
    },
    {
      icon: <FaHistory />,
      title: "Historique complet",
      description:
        "Accédez à l'ensemble de votre parcours et à tous vos certificats."
    },
    {
      icon: <FaPrint />,
      title: "Impression officielle",
      description:
        "Imprimez vos certificats directement depuis la plateforme."
    },
    {
      icon: <FaMagic />,
      title: "Génération automatique",
      description:
        "Les certificats sont générés automatiquement après validation des formations."
    }
  ]
  
  // =========================
  // COMPONENT
  // =========================
  
  function CertificateFeatures() {

    const navigate = useNavigate()
  
    return (
  
      <section className="py-20">
  
        <div className="max-w-7xl mx-auto px-6">
  
          {/* TITRE */}
  
          <div className="text-center mb-14">
  
            <h2 className="text-4xl font-bold text-gray-900">
  
              Que pouvez-vous faire ?
  
            </h2>
  
            <p className="text-gray-500 mt-4">
  
              Toutes les fonctionnalités disponibles dans le module certificats.
  
            </p>
  
          </div>
  
          {/* CARDS */}
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  
            {features.map((feature, index) => (
  
              <div
                key={index}
                onClick={() => {
                    if (feature.title === "Consulter vos certificats") {
                      navigate("/my-certificates")
                    }
                  }}
                className="
                bg-white
                rounded-3xl
                p-8
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                "
              >
  
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
                  mb-6
                  "
                >
                  {feature.icon}
                </div>
  
                <h3 className="text-xl font-bold">
  
                  {feature.title}
  
                </h3>
  
                <p className="text-gray-500 mt-4 leading-7">
  
                  {feature.description}
  
                </p>
  
              </div>
  
            ))}
  
          </div>
  
        </div>
  
      </section>
  
    )
  
  }
  
  export default CertificateFeatures