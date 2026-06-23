import Navbar from "../../components/Navbar"
import Hero from "../../components/Hero"
import FeatureCard from "../../components/FeatureCard"
import Footer from "../../components/Footer"
import { Link, useNavigate } from "react-router-dom"

import {
  FaBookOpen,
  FaVideo,
  FaUsers,
  FaAward
} from "react-icons/fa"

function Home() {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const handleCourses = () => {
    navigate("/courses")
  }

  const handleConference = () => {

    const user =
      localStorage.getItem("user")
    if (user) {
      navigate("/conference-room")
    } else {
      navigate("/login?conference=true")
    }
  }


  const handleCommunity = () => {
    const user =
      localStorage.getItem("user")
    if (user) {
      navigate("/community")
    } else {  
      navigate("/login?community=true") 
    } 
  }

  const handleCertificates = () => {
    navigate("/certificates")
  }

  const handleDashboard = () => {

    if (!user) return
  
    if (user.role === "admin") {
  
      navigate("/admin-dashboard")
  
    } else if (user.role === "teacher") {
  
      navigate("/teacher-dashboard")
  
    } else {
  
      navigate("/student-dashboard")
  
    }
  
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen">

      <Navbar />

      <Hero />

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div onClick={handleCourses} className="cursor-pointer h-full">
              <FeatureCard
                icon={<FaBookOpen className="text-purple-600" />}
                title="Cours variés"
                description="Accédez à une large bibliothèque de cours dans différents domaines."
              />
          </div>

          <div onClick={handleConference} className="cursor-pointer h-full" >
              <FeatureCard
                icon={<FaVideo className="text-green-500" />}
                title="Conférences en direct"
                description="Participez à des visioconférences interactives avec vos enseignants."
              />
          </div>
        
          <div onClick={handleCommunity} className="cursor-pointer h-full" >
              <FeatureCard
                icon={<FaUsers className="text-pink-500" />}
                title="Communauté active"
                description="Échangez avec d'autres apprenants et enseignants passionnés."
              />

          </div>

          <div onClick={handleCertificates} className="cursor-pointer h-full" >
              <FeatureCard
                icon={<FaAward className="text-orange-500" />}
                title="Certificats"
                description="Obtenez des certificats reconnus pour valider vos compétences."
              />
          </div>

        </div>

      </section>

      <section className="max-w-5xl mx-auto px-6">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-14 text-center text-white shadow-2xl">

        {
  user ? (

    <>

      <h2 className="text-5xl font-bold">
        Bon retour parmi nous !
      </h2>

      <p className="mt-6 text-xl">
        Accédez à vos cours, conférences, certificats et ressources en quelques clics.
      </p>

      <button
        onClick={handleDashboard}
        className="
        mt-10
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
        Accéder à mon espace
      </button>

    </>

  ) : (

    <>

      <h2 className="text-5xl font-bold">
        Prêt à commencer ?
      </h2>

      <p className="mt-6 text-xl">
        Rejoignez des milliers d'apprenants et développez vos compétences dès aujourd'hui
      </p>

      <Link to="/register">

        <button
          className="
          mt-10
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
          Créer un compte gratuitement
        </button>

      </Link>

    </>

  )
}

        </div>

      </section>

      <Footer />

    </div>
  )
}

export default Home