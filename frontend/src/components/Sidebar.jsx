import {
    FaHome,
    FaBook,
    FaVideo,
    FaUser,
    FaSignOutAlt
  } from "react-icons/fa"
  
  function Sidebar() {
  
    // =========================
    // LOGOUT
    // =========================
    const logout = () => {
  
      localStorage.removeItem("token")
      localStorage.removeItem("user")
  
      window.location.href = "/login"
  
    }
  
    return (
  
      <div className="w-[260px] min-h-screen bg-[#081028] shadow-2xl text-white p-6">
  
        {/* LOGO */}
        <h1 className="text-3xl font-bold mb-12">
          SALAM <span className="text-purple-500">CI</span>
        </h1>
  
        {/* MENU */}
        <div className="space-y-4">
  
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1a2342] hover:translate-x-2 transition">
  
            <FaHome />
  
            <span>Dashboard</span>
  
          </button>
  
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1a2342] hover:translate-x-2 transition">
  
            <FaBook />
  
            <span>Mes cours</span>
  
          </button>
  
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1a2342] hover:translate-x-2 transition">
  
            <FaVideo />
  
            <span>Conférences</span>
  
          </button>
  
          <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1a2342] hover:translate-x-2 transition">
  
            <FaUser />
  
            <span>Profil</span>
  
          </button>
  
        </div>
  
        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-20 w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition p-4 rounded-xl"
        >
  
          <FaSignOutAlt />
  
          Déconnexion
  
        </button>
  
      </div>
  
    )
  }
  
  export default Sidebar