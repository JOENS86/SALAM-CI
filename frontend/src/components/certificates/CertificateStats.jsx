// =========================
// DONNEES
// =========================

function CertificateStats() {

    const stats = [
      {
        value: "4 800+",
        label: "Certificats délivrés"
      },
      {
        value: "3 200+",
        label: "Apprenants certifiés"
      },
      {
        value: "120+",
        label: "Formations disponibles"
      },
      {
        value: "98%",
        label: "Taux de satisfaction"
      }
    ]
  
    return (
  
      <section className="bg-white shadow-sm">
  
        <div className="max-w-7xl mx-auto grid md:grid-cols-4">
  
          {stats.map((stat, index) => (
  
            <div
              key={index}
              className="
              text-center
              py-8
              border-r
              last:border-r-0
              "
            >
  
              <h3 className="text-3xl font-bold text-purple-600">
                {stat.value}
              </h3>
  
              <p className="text-gray-500 mt-2">
                {stat.label}
              </p>
  
            </div>
  
          ))}
  
        </div>
  
      </section>
  
    )
  
  }
  
  export default CertificateStats