import {
    FaHome,
    FaBook,
    FaVideo,
    FaUser,
    FaSignOutAlt
  } from "react-icons/fa"
  
  import {
    Link,
    useLocation
  } from "react-router-dom"
  
  function TeacherSidebar() {
  
    const location = useLocation()
  
    const logout = () => {
  
      localStorage.removeItem("token")
      localStorage.removeItem("user")
  
      window.location.href = "/login"
  
    }
  
    const user = JSON.parse(
      localStorage.getItem("user")
    )
  
    const menuClass = (path) => {
  
      return `
      w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium
      ${
          location.pathname === path
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
            : "hover:bg-[#1a2342]"
        }
      `
    }
  
    return (
  
      <div className="  w-[300px] h-screen flex-shrink-0 bg-gradient-to-b from-[#0b1736] via-[#081028]to-[#050b1f] shadow-2xl text-white p-8 flex flex-col">
  
        {/* PROFIL */}
  
        <div className="flex items-center gap-4 mb-10">
  
          <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl">
  
            {user?.name?.charAt(0)}
  
          </div>
  
          <div>
  
            <h3 className="font-bold">
              {user?.name}
            </h3>
  
            <p className="text-gray-400 text-sm">
              Enseignant
            </p>
  
          </div>
  
        </div>
  
        {/* MENU */}
  
        <div className="space-y-3 flex-1">
  
          <Link
            to="/teacher-dashboard"
            className={menuClass("/teacher-dashboard")}
          >
            <FaHome />
            Dashboard
          </Link>
  
          <Link
            to="/teacher-courses"
            className={menuClass("/teacher-courses")}
          >
            <FaBook />
            Mes cours
          </Link>
  
          <Link
            to="/teacher-conferences"
            className={menuClass("/teacher-conferences")}
          >
            <FaVideo />
            Conférences
          </Link>
  
          <Link
            to="/teacher-profile"
            className={menuClass("/teacher-profile")}
          >
            <FaUser />
            Profil
          </Link>
  
        </div>
  
        {/* LOGOUT */}
  
        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-gradient-to-r
            from-red-500
            to-red-600
            p-4
            rounded-2xl
            hover:scale-105
            transition-all
          "
        >
  
          <FaSignOutAlt />
  
          Déconnexion
  
        </button>
  
      </div>
  
    )
  
  }
  
  export default TeacherSidebar