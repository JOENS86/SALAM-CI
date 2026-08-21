import AdminLayout from "../../layouts/AdminLayout"

import {
  FaCog,
  FaBell,
  FaLock,
  FaPalette,
  FaTools,
  FaSave,
  FaCheckCircle
} from "react-icons/fa"

import { useEffect, useState } from "react"
import axios from "axios"

function Settings() {

  // =====================================================
  // ONGLET ACTIF
  // =====================================================

  const [activeTab, setActiveTab] = useState("general")

const [loading, setLoading] = useState(true)

const [saving, setSaving] = useState(false)

const [error, setError] = useState("")

  // MESSAGE DE CONFIRMATION
const [saved, setSaved] = useState(false)

  // =====================================================
  // PARAMÈTRES GÉNÉRAUX
  // =====================================================

  const [general, setGeneral] = useState({

    platformName: "SALAM CI",

    email: "",

    phone: "",

    address: "",

    description:
      "Plateforme de formation en ligne permettant aux enseignants et aux étudiants de partager et suivre des contenus pédagogiques."

  })


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState({

    newUser: true,

    newTeacher: true,

    newCourse: true,

    conferenceRequest: true,

    email: true

  })


  // =====================================================
  // SÉCURITÉ
  // =====================================================

  const [security, setSecurity] = useState({

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

    twoFactor: false

  })


  // =====================================================
  // APPARENCE
  // =====================================================

  const [appearance, setAppearance] = useState({

    theme: "light",

    animations: true

  })


  // =====================================================
  // MAINTENANCE
  // =====================================================

  const [maintenance, setMaintenance] = useState({

    enabled: false,

    message:
      "La plateforme est actuellement en maintenance. Merci de revenir plus tard."

  })


  useEffect(() => {

    const fetchSettings = async () => {
  
      try {
  
        setLoading(true)
  
        setError("")
  
        const API_URL =
          import.meta.env.VITE_API_URL ||
          "http://localhost:10000"
  
        const response = await axios.get(
          `${API_URL}/api/settings`
        )
  
        console.log(
          "⚙️ Paramètres reçus :",
          response.data
        )
  
        const settings = response.data.settings
  
        if (!settings) {
          throw new Error(
            "Paramètres introuvables."
          )
        }
  
        setGeneral({
          platformName:
            settings.platformName || "",
  
          email:
            settings.email || "",
  
          phone:
            settings.phone || "",
  
          address:
            settings.address || "",
  
          description:
            settings.description || ""
        })
  
        setNotifications({
          newUser:
            settings.notifications?.newUser ?? true,
  
          newTeacher:
            settings.notifications?.newTeacher ?? true,
  
          newCourse:
            settings.notifications?.newCourse ?? true,
  
          conferenceRequest:
            settings.notifications?.conferenceRequest ?? true,
  
          email:
            settings.notifications?.email ?? true
        })
  
        setAppearance({
          theme:
            settings.appearance?.theme || "light",
  
          animations:
            settings.appearance?.animations ?? true
        })
  
        setMaintenance({
          enabled:
            settings.maintenance?.enabled ?? false,
  
          message:
            settings.maintenance?.message || ""
        })
  
      }
  
      catch (err) {
  
        console.error(
          "❌ Erreur chargement paramètres :",
          err
        )
  
        setError(
          err.response?.data?.message ||
          err.message ||
          "Impossible de charger les paramètres."
        )
  
      }
  
      finally {
  
        setLoading(false)
  
      }
  
    }
  
    fetchSettings()
  
  }, [])


  // =====================================================
  // ONGLETS
  // =====================================================

  const tabs = [

    {
      id: "general",
      label: "Général",
      icon: <FaCog />
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />
    },

    {
      id: "security",
      label: "Sécurité",
      icon: <FaLock />
    },

    {
      id: "appearance",
      label: "Apparence",
      icon: <FaPalette />
    },

    {
      id: "maintenance",
      label: "Maintenance",
      icon: <FaTools />
    }

  ]


  // =====================================================
  // ENREGISTRER
  // =====================================================
  const handleSave = async () => {

    try {
  
      setSaving(true)
  
      setSaved(false)
  
      setError("")
  
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000"
  
      const response = await axios.put(
        `${API_URL}/api/settings`,
        {
          ...general,
  
          notifications,
  
          appearance,
  
          maintenance
        }
      )
  
      console.log(
        "💾 Paramètres enregistrés :",
        response.data
      )
  
      setSaved(true)
  
      setTimeout(() => {
  
        setSaved(false)
  
      }, 3000)
  
    }
  
    catch (err) {
  
      console.error(
        "❌ Erreur sauvegarde paramètres :",
        err
      )
  
      setError(
        err.response?.data?.message ||
        "Impossible d'enregistrer les paramètres."
      )
  
    }
  
    finally {
  
      setSaving(false)
  
    }
  
  }


  // =====================================================
  // CLASSE INPUT
  // =====================================================

  const inputClass =
    "w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"

    if (loading) {

      return (
    
        <AdminLayout>
    
          <div className="flex items-center justify-center min-h-[400px]">
    
            <div className="text-center">
    
              <div className="
                w-10
                h-10
                border-4
                border-purple-600
                border-t-transparent
                rounded-full
                animate-spin
                mx-auto
                mb-4
              " />
    
              <p className="text-gray-500">
                Chargement des paramètres...
              </p>
    
            </div>
    
          </div>
    
        </AdminLayout>
    
      )
    
    }


  return (

    <AdminLayout>

      {/* =====================================================
          EN-TÊTE
      ===================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Paramètres
        </h1>

        <p className="text-gray-500 mt-2">
          Configurez et gérez les paramètres de votre plateforme SALAM CI.
        </p>

      </div>


      {/* =====================================================
          CONTENEUR PRINCIPAL
      ===================================================== */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">


        {/* =====================================================
            NAVIGATION DES PARAMÈTRES
        ===================================================== */}

        <div className="border-b border-gray-100">

          <div className="flex gap-2 overflow-x-auto p-4">

            {tabs.map((tab) => (

              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >

                {tab.icon}

                <span>
                  {tab.label}
                </span>

              </button>

            ))}

          </div>

        </div>


        {/* =====================================================
            CONTENU
        ===================================================== */}

        <div className="p-8">

        {error && (
          <div className="
            mb-6
            bg-red-50
            border
            border-red-200
            text-red-700
            rounded-2xl
            p-4
          ">

          <p className="font-semibold">
            Erreur
          </p>

          <p className="mt-1">
            {error}
          </p>

          </div>
        )}

          {/* =====================================================
              GÉNÉRAL
          ===================================================== */}

          {activeTab === "general" && (

            <div>

              <SectionTitle
                title="Paramètres généraux"
                description="Les informations principales de votre plateforme."
              />


              <div className="grid md:grid-cols-2 gap-6">

                {/* NOM */}

                <Field label="Nom de la plateforme">

                  <input
                    type="text"
                    value={general.platformName}
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        platformName: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                {/* EMAIL */}

                <Field label="Email principal">

                  <input
                    type="email"
                    value={general.email}
                    placeholder="contact@salam-ci.com"
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        email: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                {/* TÉLÉPHONE */}

                <Field label="Téléphone">

                  <input
                    type="text"
                    value={general.phone}
                    placeholder="+225 XX XX XX XX"
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        phone: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                {/* ADRESSE */}

                <Field label="Adresse">

                  <input
                    type="text"
                    value={general.address}
                    placeholder="Abidjan, Côte d'Ivoire"
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        address: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>

              </div>


              {/* DESCRIPTION */}

              <div className="mt-6">

                <Field label="Description">

                  <textarea
                    rows={4}
                    value={general.description}
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        description: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>

              </div>

            </div>

          )}


          {/* =====================================================
              NOTIFICATIONS
          ===================================================== */}

          {activeTab === "notifications" && (

            <div>

              <SectionTitle
                title="Notifications"
                description="Choisissez les événements pour lesquels vous souhaitez être averti."
              />


              <div className="space-y-4">

                <NotificationRow
                  title="Nouveaux utilisateurs"
                  description="Être informé lorsqu'un étudiant s'inscrit."
                  checked={notifications.newUser}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      newUser: value
                    })
                  }
                />


                <NotificationRow
                  title="Nouveaux enseignants"
                  description="Recevoir une notification lorsqu'un enseignant rejoint la plateforme."
                  checked={notifications.newTeacher}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      newTeacher: value
                    })
                  }
                />


                <NotificationRow
                  title="Nouveaux cours"
                  description="Être informé lorsqu'un nouveau cours est publié."
                  checked={notifications.newCourse}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      newCourse: value
                    })
                  }
                />


                <NotificationRow
                  title="Demandes de conférence"
                  description="Recevoir les demandes de conférence des enseignants."
                  checked={notifications.conferenceRequest}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      conferenceRequest: value
                    })
                  }
                />


                <NotificationRow
                  title="Notifications par email"
                  description="Recevoir les notifications importantes par email."
                  checked={notifications.email}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      email: value
                    })
                  }
                />

              </div>

            </div>

          )}


          {/* =====================================================
              SÉCURITÉ
          ===================================================== */}

          {activeTab === "security" && (

            <div>

              <SectionTitle
                title="Sécurité"
                description="Renforcez la sécurité de votre compte administrateur."
              />


              <div className="max-w-2xl space-y-5">

                <Field label="Mot de passe actuel">

                  <input
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                <Field label="Nouveau mot de passe">

                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        newPassword: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                <Field label="Confirmer le nouveau mot de passe">

                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        confirmPassword: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>


                <NotificationRow
                  title="Authentification à deux facteurs"
                  description="Ajouter une couche de sécurité supplémentaire à votre compte."
                  checked={security.twoFactor}
                  onChange={(value) =>
                    setSecurity({
                      ...security,
                      twoFactor: value
                    })
                  }
                />

              </div>

            </div>

          )}


          {/* =====================================================
              APPARENCE
          ===================================================== */}

          {activeTab === "appearance" && (

            <div>

              <SectionTitle
                title="Apparence"
                description="Personnalisez l'apparence de votre espace administrateur."
              />


              <div className="max-w-2xl space-y-6">

                {/* THÈME */}

                <div>

                  <label className="block font-medium mb-3">
                    Thème
                  </label>


                  <div className="grid grid-cols-3 gap-4">

                    {[
                      ["light", "Clair"],
                      ["dark", "Sombre"],
                      ["system", "Système"]
                    ].map(([value, label]) => (

                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setAppearance({
                            ...appearance,
                            theme: value
                          })
                        }
                        className={`p-4 rounded-2xl border-2 transition ${
                          appearance.theme === value
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >

                        {label}

                      </button>

                    ))}

                  </div>

                </div>


                {/* ANIMATIONS */}

                <NotificationRow
                  title="Animations"
                  description="Activer les animations et transitions de l'interface."
                  checked={appearance.animations}
                  onChange={(value) =>
                    setAppearance({
                      ...appearance,
                      animations: value
                    })
                  }
                />

              </div>

            </div>

          )}


          {/* =====================================================
              MAINTENANCE
          ===================================================== */}

          {activeTab === "maintenance" && (

            <div>

              <SectionTitle
                title="Maintenance"
                description="Contrôlez l'état général de la plateforme."
              />


              <div className="max-w-3xl space-y-6">

                {/* MODE MAINTENANCE */}

                <NotificationRow
                  title="Mode maintenance"
                  description="Empêcher temporairement les utilisateurs d'accéder à la plateforme."
                  checked={maintenance.enabled}
                  onChange={(value) =>
                    setMaintenance({
                      ...maintenance,
                      enabled: value
                    })
                  }
                />


                {/* MESSAGE */}

                <Field label="Message de maintenance">

                  <textarea
                    rows={5}
                    value={maintenance.message}
                    onChange={(e) =>
                      setMaintenance({
                        ...maintenance,
                        message: e.target.value
                      })
                    }
                    className={inputClass}
                  />

                </Field>

              </div>

            </div>

          )}


          {/* =====================================================
              BARRE D'ENREGISTREMENT
          ===================================================== */}

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">

            <div>

              {saved && (

                <div className="flex items-center gap-2 text-green-600">

                  <FaCheckCircle />

                  <span>
                    Paramètres enregistrés avec succès.
                  </span>

                </div>

              )}

            </div>


            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                bg-gradient-to-r
                from-purple-600
                to-indigo-600
                hover:from-purple-700
                hover:to-indigo-700
                text-white
                px-7
                py-3.5
                rounded-2xl
                font-semibold
                shadow-md
                transition
              "
            >

              <FaSave />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"
                }

            </button>

          </div>

        </div>

      </div>

    </AdminLayout>

  )

}


// =====================================================
// TITRE DE SECTION
// =====================================================

function SectionTitle({ title, description }) {

  return (

    <div className="mb-8">

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-1">
        {description}
      </p>

    </div>

  )

}


// =====================================================
// CHAMP
// =====================================================

function Field({ label, children }) {

  return (

    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">

        {label}

      </label>

      {children}

    </div>

  )

}


// =====================================================
// LIGNE AVEC SWITCH
// =====================================================

function NotificationRow({
  title,
  description,
  checked,
  onChange
}) {

  return (

    <div className="flex items-center justify-between gap-6 p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">

      <div>

        <p className="font-semibold text-gray-800">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

      </div>


      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition ${
          checked
            ? "bg-purple-600"
            : "bg-gray-300"
        }`}
      >

        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
            checked
              ? "left-7"
              : "left-1"
          }`}
        />

      </button>

    </div>

  )

}


export default Settings