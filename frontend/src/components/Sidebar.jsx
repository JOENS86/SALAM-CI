import {
  FaHome,
  FaBook,
  FaVideo,
  FaUser,
  FaSignOutAlt,
  FaAward,
  FaDownload
} from "react-icons/fa"

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom"

function Sidebar() {

  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    window.location.href = "/login"

  }

  const menuClass = (path) => {

    return `
    w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium
      ${
        location.pathname === path
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
          : "hover:bg-[#1a2342] hover:translate-x-2"
      }
    `
  }

  return (

    <div className="  w-[300px] h-screen flex-shrink-0 bg-gradient-to-b from-[#0b1736] via-[#081028]to-[#050b1f] shadow-2xl text-white p-8 flex flex-col">
     
      {/* LOGO */}
      <div className="mb-12 cursor-pointer" onClick={() => navigate("/")} >
        <div className="flex items-center gap-3">
            <FaHome className="text-xl text-purple-400" />
    <h1 className="text-4xl font-extrabold tracking-wide">
      SALAM <span className="text-purple-500">CI</span>
    </h1>
        </div>
    <p className="text-gray-400 mt-2 text-sm">
    Espace Étudiant
    </p>
      </div>

      {/* MENU */}

      <div className="space-y-3 flex-1">

        <Link
          to="/student-dashboard"
          className={menuClass("/student-dashboard")}
        >
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/student-courses"
          className={menuClass("/student-courses")}
        >
          <FaBook className="text-lg" />
          <span>Mes cours</span>
        </Link>

        <Link
          to="/student-conferences"
          className={menuClass("/student-conferences")}
        >
          <FaVideo className="text-lg" />
          <span>Conférences</span>
        </Link>

        <Link
          to="/student-certificates"
          className={menuClass("/student-certificates")}
        >
          <FaAward className="text-lg" />
          <span>Certificats</span>
        </Link>

        <Link
          to="/student-downloads"
          className={menuClass("/student-downloads")}
        >
          <FaDownload className="text-lg" />
          <span>Téléchargements</span>
        </Link>

        <Link
          to="/student-profile"
          className={menuClass("/student-profile")}
        >
          <FaUser className="text-lg" />
          <span>Profil</span>
        </Link>

      </div>

      {/* LOGOUT */}

      <button onClick={logout} className=" w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:scale-105 transition-all duration-300 p-4 rounded-2xl shadow-lg " >
        <FaSignOutAlt />
          Déconnexion
      </button>

    </div>

  )
}

export default Sidebar