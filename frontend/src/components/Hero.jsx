import { Link } from "react-router-dom"
function Hero() {
    return (
      <section className="pt-36 pb-20 text-center px-6">
  
        <h1 className="text-6xl font-bold text-gray-900">
          SALAM <span className="text-purple-600">CI</span>
        </h1>
  
        <p className="text-2xl mt-4 text-gray-600">
          Votre plateforme de formation en ligne
        </p>
  
        <p className="max-w-3xl mx-auto mt-6 text-gray-500 leading-8">
          Apprenez à votre rythme avec des cours de qualité,
          participez à des conférences en direct et développez
          vos compétences avec les meilleurs enseignants.
        </p>
  
        <div className="flex justify-center gap-4 mt-10 flex-wrap">

<Link to="/register">
  <button className="bg-purple-600 hover:bg-purple-700 transition text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
    Commencer gratuitement
  </button>
</Link>

<Link to="/login">
  <button className="bg-gray-200 hover:bg-gray-300 transition px-8 py-4 rounded-xl font-semibold">
    Se connecter
  </button>
</Link>

</div>
  
      </section>
    )
  }
  
  export default Hero