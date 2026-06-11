import AdminLayout from "../../layouts/AdminLayout"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

import {
    FaUsers,
    FaBook,
    FaVideo,
    FaAward
  } from "react-icons/fa"

function Statistics() {

  const usersData = [

    { month: "Jan", users: 120 },
    { month: "Fév", users: 180 },
    { month: "Mar", users: 260 },
    { month: "Avr", users: 340 },
    { month: "Mai", users: 480 },
    { month: "Juin", users: 620 }

  ]

  const coursesData = [

    { name: "Web", value: 40 },
    { name: "IA", value: 25 },
    { name: "Cloud", value: 20 },
    { name: "Cyber", value: 15 }

  ]

  const activityData = [

    { name: "Lun", value: 80 },
    { name: "Mar", value: 120 },
    { name: "Mer", value: 90 },
    { name: "Jeu", value: 150 },
    { name: "Ven", value: 200 }

  ]

  const COLORS = [
    "#7c3aed",
    "#2563eb",
    "#16a34a",
    "#ea580c"
  ]

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Statistiques
        </h1>

        <p className="text-gray-500 mt-2">
          Analyse des performances de la plateforme
        </p>

      </div>

      {/* CARTES */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="bg-white rounded-3xl p-6 shadow-sm">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Utilisateurs
      </p>

      <h2 className="text-4xl font-bold mt-2">
        1 254
      </h2>

    </div>

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">

      <FaUsers />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Cours
      </p>

      <h2 className="text-4xl font-bold mt-2">
        342
      </h2>

    </div>

    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">

      <FaBook />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Conférences
      </p>

      <h2 className="text-4xl font-bold mt-2">
        89
      </h2>

    </div>

    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl">

      <FaVideo />

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm">

  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-500">
        Certificats
      </p>

      <h2 className="text-4xl font-bold mt-2">
        678
      </h2>

    </div>

    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">

      <FaAward />

    </div>

  </div>

</div>

</div>

      {/* GRAPHIQUES */}

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Évolution des utilisateurs
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={usersData}>

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#7c3aed"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Répartition des cours
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={coursesData}
                dataKey="value"
                outerRadius={100}
              >

                {coursesData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ACTIVITE */}

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Activité hebdomadaire
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={activityData}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </AdminLayout>

  )

}

export default Statistics