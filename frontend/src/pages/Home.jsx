import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FeatureCard from "../components/FeatureCard"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

import {
  FaBookOpen,
  FaVideo,
  FaUsers,
  FaAward
} from "react-icons/fa"

function Home() {
  return (
    <div className="bg-[#f5f7fb] min-h-screen">

      <Navbar />

      <Hero />

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <FeatureCard
            icon={<FaBookOpen className="text-purple-600" />}
            title="Cours variés"
            description="Accédez à une large bibliothèque de cours dans différents domaines."
          />

          <FeatureCard
            icon={<FaVideo className="text-green-500" />}
            title="Conférences en direct"
            description="Participez à des visioconférences interactives avec vos enseignants."
          />

          <FeatureCard
            icon={<FaUsers className="text-pink-500" />}
            title="Communauté active"
            description="Échangez avec d'autres apprenants et enseignants passionnés."
          />

          <FeatureCard
            icon={<FaAward className="text-orange-500" />}
            title="Certificats"
            description="Obtenez des certificats reconnus pour valider vos compétences."
          />

        </div>

      </section>

      <section className="max-w-5xl mx-auto px-6">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-14 text-center text-white shadow-2xl">

          <h2 className="text-5xl font-bold">
            Prêt à commencer ?
          </h2>

          <p className="mt-6 text-xl">
            Rejoignez des milliers d'apprenants et développez vos compétences dès aujourd'hui
          </p>
          <Link to="/register">

<button className="mt-10 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
  Créer un compte gratuitement
</button>

</Link>

        </div>

      </section>

      <Footer />

    </div>
  )
}

export default Home