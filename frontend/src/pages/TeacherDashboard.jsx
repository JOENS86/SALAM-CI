import DashboardLayout from "../layouts/DashboardLayout"

function TeacherDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <DashboardLayout>

      <h1 className="text-5xl font-bold">
        Dashboard Enseignant
      </h1>

      <p className="mt-3 text-xl text-gray-500">
        Bienvenue {user?.name}
      </p>

    </DashboardLayout>

  )
}

export default TeacherDashboard