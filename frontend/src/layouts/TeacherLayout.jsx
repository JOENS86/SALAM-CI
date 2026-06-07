import TeacherSidebar from "../components/TeacherSidebar"

function TeacherLayout({ children }) {

  return (

<div className="flex h-screen bg-[#f8fafc]">

{/* SIDEBAR FIXE */}
<TeacherSidebar />

{/* CONTENU SCROLLABLE */}
<div className="flex-1 overflow-y-auto p-10">

  {children}

</div>

</div>

  )

}

export default TeacherLayout