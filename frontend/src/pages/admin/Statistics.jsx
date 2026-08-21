import AdminLayout from "../../layouts/AdminLayout"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts"

import {
  FaUsers,
  FaBook,
  FaVideo,
  FaAward
} from "react-icons/fa"

import { useEffect, useState } from "react"
import axios from "axios"

function Statistics() {

  // =====================================================
  // STATISTIQUES
  // =====================================================

  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  // =====================================================
  // RECUPERER LES STATISTIQUES
  // =====================================================

  useEffect(() => {

    const fetchStatistics = async () => {

      try {

        setLoading(true)

        setError("")

        const API_URL =
          import.meta.env.VITE_API_URL ||
          "http://localhost:5000"

        const response = await axios.get(
          `${API_URL}/api/statistics`
        )

        console.log(
          "📊 Statistiques reçues :",
          response.data
        )

        setStats(response.data)

      }

      catch (error) {

        console.error(
          "❌ Erreur récupération statistiques :",
          error
        )

        setError(
          error.response?.data?.message ||
          "Impossible de récupérer les statistiques."
        )

      }

      finally {

        setLoading(false)

      }

    }

    fetchStatistics()

  }, [])


  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {

    return (

      <AdminLayout>

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Chargement des statistiques...
            </p>

          </div>

        </div>

      </AdminLayout>

    )

  }


  // =====================================================
  // ERREUR
  // =====================================================

  if (error) {

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

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">

          <p className="font-semibold">
            Erreur
          </p>

          <p className="mt-1">
            {error}
          </p>

        </div>

      </AdminLayout>

    )

  }


  // =====================================================
  // DONNEES
  // =====================================================

  const users = stats?.users || {}

  const courses = stats?.courses || {}

  const conferences = stats?.conferences || {}

  const certificates = stats?.certificates || {}


  // =====================================================
  // REPARTITION DES UTILISATEURS
  // =====================================================

  const usersData = [

    {
      name: "Étudiants",
      value: users.students || 0
    },

    {
      name: "Enseignants",
      value: users.teachers || 0
    },

    {
      name: "Administrateurs",
      value: users.admins || 0
    }

  ]


  // =====================================================
  // REPARTITION DES COURS
  // =====================================================

  const coursesData = [

    {
      name: "Publiés",
      value: courses.published || 0
    },

    {
      name: "En attente",
      value: courses.pending || 0
    },

    {
      name: "Suspendus",
      value: courses.suspended || 0
    }

  ]


  // =====================================================
  // COULEURS GRAPHIQUES
  // =====================================================

  const COLORS = [

    "#7c3aed",
    "#2563eb",
    "#16a34a",
    "#ea580c"

  ]


  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (

    <AdminLayout>

      {/* =====================================================
          TITRE
      ===================================================== */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Statistiques
        </h1>

        <p className="text-gray-500 mt-2">
          Analyse des performances de la plateforme
        </p>

      </div>


      {/* =====================================================
          CARTES
      ===================================================== */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">


        {/* UTILISATEURS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Utilisateurs
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {users.total || 0}
              </h2>

            </div>

            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">

              <FaUsers />

            </div>

          </div>

        </div>


        {/* COURS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Cours
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {courses.total || 0}
              </h2>

            </div>

            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">

              <FaBook />

            </div>

          </div>

        </div>


        {/* CONFERENCES */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Conférences
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {conferences.total || 0}
              </h2>

            </div>

            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl">

              <FaVideo />

            </div>

          </div>

        </div>


        {/* CERTIFICATS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Certificats
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {certificates.total || 0}
              </h2>

            </div>

            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">

              <FaAward />

            </div>

          </div>

        </div>


      </div>


      {/* =====================================================
          GRAPHIQUES
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-8">


        {/* =====================================================
            REPARTITION DES UTILISATEURS
        ===================================================== */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Répartition des utilisateurs
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={usersData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {usersData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* =====================================================
            REPARTITION DES COURS
        ===================================================== */}

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
                nameKey="name"
                outerRadius={100}
                label
              >

                {coursesData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


      </div>


      {/* =====================================================
          INFORMATIONS CONFERENCES
      ===================================================== */}

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

        <h2 className="text-2xl font-bold mb-6">
          État des conférences
        </h2>

        <div className="grid md:grid-cols-3 gap-6">


          <div className="bg-red-50 rounded-2xl p-6">

            <p className="text-gray-500">
              En direct
            </p>

            <p className="text-3xl font-bold mt-2">
              {conferences.live || 0}
            </p>

          </div>


          <div className="bg-blue-50 rounded-2xl p-6">

            <p className="text-gray-500">
              Programmées
            </p>

            <p className="text-3xl font-bold mt-2">
              {conferences.scheduled || 0}
            </p>

          </div>


          <div className="bg-green-50 rounded-2xl p-6">

            <p className="text-gray-500">
              Terminées
            </p>

            <p className="text-3xl font-bold mt-2">
              {conferences.completed || 0}
            </p>

          </div>


        </div>

      </div>


    </AdminLayout>

  )

}

export default Statistics