import AdminSidebar from "../components/AdminSidebar"

function AdminLayout({ children }) {

  return (

    <div className="flex h-screen overflow-hidden">

      <AdminSidebar />

      <div
        className="
        flex-1
        overflow-y-auto
        bg-[#f8fafc]
        p-10
        "
      >

        {children}

      </div>

    </div>

  )

}

export default AdminLayout