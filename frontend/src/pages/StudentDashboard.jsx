import DashboardLayout from "../layouts/DashboardLayout"

function StudentDashboard() {

  // USER CONNECTÉ
  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold text-gray-800">
            Dashboard Étudiant
          </h1>

          <p className="mt-3 text-gray-500 text-xl">
            Bienvenue {user?.name}

            <div className="mt-6 flex items-center gap-4">

<div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">

  {user?.name?.charAt(0)}

</div>

<div>

  <p className="font-semibold text-xl">
    {user?.email}
  </p>

  <p className="text-gray-500">
    Étudiant
  </p>

</div>

</div>

          </p>

        </div>

      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

        {/* CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

          <h2 className="text-2xl font-bold">
            Cours inscrits
          </h2>

          <p className="text-5xl font-bold text-purple-600 mt-6">
            12
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

          <h2 className="text-2xl font-bold">
            Conférences
          </h2>

          <p className="text-5xl font-bold text-green-500 mt-6">
            4
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

          <h2 className="text-2xl font-bold">
            Certificats
          </h2>

          <p className="text-5xl font-bold text-orange-500 mt-6">
            2
          </p>

        </div>

      </div>

    </DashboardLayout>

  )
}

export default StudentDashboard