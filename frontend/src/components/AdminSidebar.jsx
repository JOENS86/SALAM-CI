import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaVideo,
  FaFolder,
  FaFileAlt,
  FaBell,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa"

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom"


function AdminSidebar() {

  const location = useLocation()
  const navigate = useNavigate()


  // =====================================================
  // DÉCONNEXION
  // =====================================================

  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    window.location.href = "/login"

  }


  // =====================================================
  // STYLE MENU
  // =====================================================

  const menuClass = (path) => {

    return `
      flex
      items-center
      gap-4
      px-5
      py-4
      rounded-2xl
      transition-all
      duration-300
      ${
        location.pathname === path

          ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"

          : "hover:bg-[#1a2342] dark:hover:bg-slate-700"
      }
    `

  }


  return (

    <div
      className="
      w-[280px]
      h-screen
      flex-shrink-0
      bg-gradient-to-b
      from-[#312e81]
      via-[#3730a3]
      to-[#4338ca]
      shadow-2xl
      text-white
      flex
      flex-col
      "
    >


      {/* =================================================
          LOGO
      ================================================= */}

      <div
        className="
        p-8
        border-b
        border-white/10
        cursor-pointer
        "
        onClick={() => navigate("/")}
      >

        <div className="flex items-center gap-3">

          <FaHome className="text-xl" />

          <h1 className="text-4xl font-bold">

            SALAM CI

          </h1>

        </div>


        <p className="text-gray-300 mt-2">

          Espace Administrateur

        </p>

      </div>


      {/* =================================================
          MENU
      ================================================= */}

      <div
        className="
        flex-1
        p-4
        space-y-2
        overflow-y-auto
        "
      >

        <Link
          to="/admin-dashboard"
          className={menuClass("/admin-dashboard")}
        >

          <FaTachometerAlt />

          Dashboard

        </Link>


        <Link
          to="/admin-users"
          className={menuClass("/admin-users")}
        >

          <FaUsers />

          Utilisateurs

        </Link>


        <Link
          to="/admin-courses"
          className={menuClass("/admin-courses")}
        >

          <FaBook />

          Cours

        </Link>


        <Link
          to="/admin-conferences"
          className={menuClass("/admin-conferences")}
        >

          <FaVideo />

          Conférences

        </Link>


        <Link
          to="/admin-categories"
          className={menuClass("/admin-categories")}
        >

          <FaFolder />

          Catégories

        </Link>


        <Link
          to="/admin-files"
          className={menuClass("/admin-files")}
        >

          <FaFileAlt />

          Fichiers

        </Link>


        <Link
          to="/admin-notifications"
          className={menuClass("/admin-notifications")}
        >

          <FaBell />

          Notifications

        </Link>


        <Link
          to="/admin-statistics"
          className={menuClass("/admin-statistics")}
        >

          <FaChartBar />

          Statistiques

        </Link>


        <Link
          to="/admin-settings"
          className={menuClass("/admin-settings")}
        >

          <FaCog />

          Paramètres

        </Link>


        <Link
          to="/admin-profile"
          className={menuClass("/admin-profile")}
        >

          <FaUser />

          Profil

        </Link>

      </div>


      {/* =================================================
          DÉCONNEXION
      ================================================= */}

      <div
        className="
        p-4
        border-t
        border-white/10
        "
      >

        <button
          onClick={logout}
          className="
          w-full
          flex
          items-center
          justify-center
          gap-3
          bg-red-500
          hover:bg-red-600
          py-4
          rounded-2xl
          transition
          "
        >

          <FaSignOutAlt />

          Déconnexion

        </button>

      </div>


    </div>

  )

}


export default AdminSidebar