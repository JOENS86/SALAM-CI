import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {

  return (

<div className="flex h-screen bg-gradient-to-br from-[#f5f7fb] to-[#eef2ff]">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENU */}
      <div className="flex-1 overflow-y-auto p-10">

        {children}

      </div>

    </div>

  )
}

export default DashboardLayout