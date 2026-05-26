import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {

  return (

    <div className="flex bg-gradient-to-br from-[#f5f7fb] to-[#eef2ff] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENU */}
      <div className="flex-1 p-10">

        {children}

      </div>

    </div>

  )
}

export default DashboardLayout