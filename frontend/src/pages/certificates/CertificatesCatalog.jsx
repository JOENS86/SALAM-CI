import CertificatesHero from "../../components/certificates/CertificateHero"
import CertificateStats from "../../components/certificates/CertificateStats"
import CertificateFeatures from "../../components/certificates/CertificateFeatures"
import CertificateCTA from "../../components/certificates/CertificateCTA"

function CertificatesCatalog() {

  return (

    <div className="bg-[#f5f7fb] min-h-screen">

      {/* HERO */}
      <CertificatesHero />

      {/* STATISTIQUES */}
      <CertificateStats />

      {/* FONCTIONNALITÉS */}
      <CertificateFeatures />

      {/* CTA */}
      <CertificateCTA />

    </div>

  )

}

export default CertificatesCatalog