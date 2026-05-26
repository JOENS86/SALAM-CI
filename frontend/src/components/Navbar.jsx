import { Link } from "react-router-dom"

function Navbar() {
    return (
      <nav className="w-full bg-white shadow-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
  
          <h1 className="text-3xl font-bold">
            SALAM <span className="text-purple-600">CI</span>
          </h1>
  
          <div className="flex gap-4">

<Link to="/register">
  <button className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
    Commencer
  </button>
</Link>

<Link to="/login">
  <button className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
    Connexion
  </button>
</Link>

</div>
  
        </div>
      </nav>
    )
  }
  
  export default Navbar