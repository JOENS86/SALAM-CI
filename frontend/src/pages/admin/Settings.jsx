import AdminLayout from "../../layouts/AdminLayout"

import {
  FaCog,
  FaBell,
  FaLock,
  FaPalette,
  FaTools,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa"

import { useEffect, useState } from "react"
import API from "../../services/api"


function Settings() {

  // =====================================================
  // ONGLET ACTIF
  // =====================================================

  const [activeTab, setActiveTab] = useState("general")


  // =====================================================
  // ÉTATS GÉNÉRAUX
  // =====================================================

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")

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


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    )
  }


  // =====================================================
  // CHARGEMENT DES PARAMÈTRES
  // =====================================================

  useEffect(() => {

    const fetchSettings = async () => {

      try {

        setLoading(true)
        setError("")

        // IMPORTANT :
        // API contient déjà /api dans son baseURL.
        // Il faut donc appeler uniquement /settings.
        const response = await API.get("/settings")

        console.log(
          "⚙️ Paramètres reçus :",
          response.data
        )

        const settings = response.data?.settings

        if (!settings) {
          throw new Error("Paramètres introuvables.")
        }

        setGeneral({
          platformName: settings.platformName || "",
          email: settings.email || "",
          phone: settings.phone || "",
          address: settings.address || "",
          description: settings.description || ""
        })

        setNotifications({
          newUser: settings.notifications?.newUser ?? true,
          newTeacher: settings.notifications?.newTeacher ?? true,
          newCourse: settings.notifications?.newCourse ?? true,
          conferenceRequest:
            settings.notifications?.conferenceRequest ?? true,
          email: settings.notifications?.email ?? true
        })

        setAppearance({
          theme: settings.appearance?.theme || "light",
          animations: settings.appearance?.animations ?? true
        })

        setMaintenance({
          enabled: settings.maintenance?.enabled ?? false,
          message:
            settings.maintenance?.message ||
            "La plateforme est actuellement en maintenance. Merci de revenir plus tard."
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
  // MESSAGE TEMPORAIRE
  // =====================================================

  const showSavedMessage = () => {

    setSaved(true)

    setTimeout(() => {

      setSaved(false)

    }, 3000)

  }


  // =====================================================
  // ENREGISTRER PARAMÈTRES GÉNÉRAUX
  // =====================================================

  const saveSettings = async () => {

    const token = getToken()


    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {}


    const response = await API.put(
      "/settings",
      {
        ...general,
        notifications,
        appearance,
        maintenance
      },
      config
    )


    console.log(
      "💾 Paramètres enregistrés :",
      response.data
    )

  }


  // =====================================================
  // CHANGER MOT DE PASSE
  // =====================================================

  const changePassword = async () => {

    // ===================================================
    // VÉRIFICATIONS FRONTEND
    // ===================================================

    if (!security.currentPassword) {

      throw new Error(
        "Veuillez saisir votre mot de passe actuel."
      )

    }


    if (!security.newPassword) {

      throw new Error(
        "Veuillez saisir votre nouveau mot de passe."
      )

    }


    if (!security.confirmPassword) {

      throw new Error(
        "Veuillez confirmer votre nouveau mot de passe."
      )

    }


    if (security.newPassword.length < 8) {

      throw new Error(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      )

    }


    if (
      security.newPassword !==
      security.confirmPassword
    ) {

      throw new Error(
        "Les nouveaux mots de passe ne correspondent pas."
      )

    }


    const token = getToken()


    if (!token) {

      throw new Error(
        "Votre session a expiré. Veuillez vous reconnecter."
      )

    }


    // ===================================================
    // REQUÊTE BACKEND
    // ===================================================

    const response = await API.put(
      "/settings/change-password",
      {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
        confirmPassword: security.confirmPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )


    console.log(
      "🔐 Mot de passe modifié :",
      response.data
    )


    // ===================================================
    // NETTOYAGE
    // ===================================================

    setSecurity({

      currentPassword: "",

      newPassword: "",

      confirmPassword: "",

      twoFactor: false

    })


    return response.data

  }


  // =====================================================
  // ENREGISTREMENT PRINCIPAL
  // =====================================================

  const handleSave = async () => {

    try {

      setSaving(true)

      setSaved(false)

      setError("")


      // =================================================
      // SÉCURITÉ
      // =================================================

      if (activeTab === "security") {

        const response =
          await changePassword()


        showSavedMessage()


        // =================================================
        // DÉCONNEXION AUTOMATIQUE
        // =================================================

        if (response?.requiresLogin) {

          localStorage.removeItem("token")

          localStorage.removeItem("authToken")

          localStorage.removeItem("user")


          setTimeout(() => {

            window.location.href = "/"

          }, 1800)

        }


        return

      }


      // =================================================
      // AUTRES PARAMÈTRES
      // =================================================

      await saveSettings()


      showSavedMessage()

    }

    catch (err) {

      console.error(
        "❌ Erreur sauvegarde :",
        err
      )


      setError(

        err.response?.data?.message ||

        err.message ||

        "Impossible d'enregistrer les modifications."

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


  // =====================================================
  // CHARGEMENT
  // =====================================================

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


  // =====================================================
  // INTERFACE
  // =====================================================

  return (

    <AdminLayout>


      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Paramètres

        </h1>


        <p className="text-gray-500 mt-2">

          Configurez et gérez les paramètres de votre
          plateforme SALAM CI.

        </p>

      </div>



      {/* =================================================
          CONTENEUR
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="border-b border-gray-100">

          <div className="flex gap-2 overflow-x-auto p-4">

            {tabs.map((tab) => (

              <button

                key={tab.id}

                type="button"

                onClick={() => {

                  setActiveTab(tab.id)

                  setError("")

                  setSaved(false)

                }}

                className={`
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  whitespace-nowrap
                  transition

                  ${
                    activeTab === tab.id

                      ? "bg-purple-600 text-white shadow"

                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}

              >

                {tab.icon}

                <span>

                  {tab.label}

                </span>

              </button>

            ))}

          </div>

        </div>



        {/* =================================================
            CONTENU
        ================================================= */}

        <div className="p-8">


          {/* =================================================
              ERREUR
          ================================================= */}

          {error && (

            <div className="
              mb-6
              bg-red-50
              border
              border-red-200
              text-red-700
              rounded-2xl
              p-4
              flex
              items-start
              gap-3
            ">

              <FaExclamationCircle className="mt-1" />

              <div>

                <p className="font-semibold">

                  Une erreur est survenue

                </p>

                <p className="mt-1">

                  {error}

                </p>

              </div>

            </div>

          )}



          {/* =================================================
              GÉNÉRAL
          ================================================= */}

          {activeTab === "general" && (

            <div>

              <SectionTitle

                title="Paramètres généraux"

                description="Les informations principales de votre plateforme."

              />


              <div className="grid md:grid-cols-2 gap-6">


                <Field label="Nom de la plateforme">

                  <input

                    type="text"

                    value={general.platformName}

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        platformName:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Email principal">

                  <input

                    type="email"

                    value={general.email}

                    placeholder="contact@salam-ci.com"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        email:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Téléphone">

                  <input

                    type="text"

                    value={general.phone}

                    placeholder="+225 XX XX XX XX"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        phone:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Adresse">

                  <input

                    type="text"

                    value={general.address}

                    placeholder="Abidjan, Côte d'Ivoire"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        address:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>



              <div className="mt-6">

                <Field label="Description">

                  <textarea

                    rows={4}

                    value={general.description}

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        description:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>

            </div>

          )}



          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

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

                  checked={
                    notifications.newUser
                  }

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

                  checked={
                    notifications.newTeacher
                  }

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

                  checked={
                    notifications.newCourse
                  }

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

                  checked={
                    notifications.conferenceRequest
                  }

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

                  checked={
                    notifications.email
                  }

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



          {/* =================================================
              SÉCURITÉ
          ================================================= */}

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

                    value={
                      security.currentPassword
                    }

                    placeholder="••••••••"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        currentPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Nouveau mot de passe">

                  <input

                    type="password"

                    value={
                      security.newPassword
                    }

                    placeholder="Minimum 8 caractères"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        newPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Confirmer le nouveau mot de passe">

                  <input

                    type="password"

                    value={
                      security.confirmPassword
                    }

                    placeholder="Retapez le nouveau mot de passe"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        confirmPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                {/* =================================================
                    2FA
                ================================================= */}

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-6
                  p-5
                  border
                  border-gray-100
                  rounded-2xl
                  bg-gray-50
                ">

                  <div>

                    <p className="font-semibold text-gray-800">

                      Authentification à deux facteurs

                    </p>

                    <p className="text-sm text-gray-500 mt-1">

                      Cette fonctionnalité sera disponible
                      prochainement.

                    </p>

                  </div>


                  <button

                    type="button"

                    disabled

                    className="
                      relative
                      flex-shrink-0
                      w-12
                      h-6
                      rounded-full
                      bg-gray-300
                      cursor-not-allowed
                    "

                  >

                    <span className="
                      absolute
                      top-1
                      left-1
                      w-4
                      h-4
                      bg-white
                      rounded-full
                      shadow
                    " />

                  </button>

                </div>

              </div>

            </div>

          )}



          {/* =================================================
              APPARENCE
          ================================================= */}

          {activeTab === "appearance" && (

            <div>

              <SectionTitle

                title="Apparence"

                description="Personnalisez l'apparence de votre espace administrateur."

              />


              <div className="max-w-2xl space-y-6">


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

                        className={`
                          p-4
                          rounded-2xl
                          border-2
                          transition

                          ${
                            appearance.theme === value

                              ? "border-purple-600 bg-purple-50 text-purple-700"

                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}

                      >

                        {label}

                      </button>

                    ))}

                  </div>

                </div>



                <NotificationRow

                  title="Animations"

                  description="Activer les animations et transitions de l'interface."

                  checked={
                    appearance.animations
                  }

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



          {/* =================================================
              MAINTENANCE
          ================================================= */}

          {activeTab === "maintenance" && (

            <div>

              <SectionTitle

                title="Maintenance"

                description="Contrôlez l'état général de la plateforme."

              />


              <div className="max-w-3xl space-y-6">


                <NotificationRow

                  title="Mode maintenance"

                  description="Empêcher temporairement les utilisateurs d'accéder à la plateforme."

                  checked={
                    maintenance.enabled
                  }

                  onChange={(value) =>

                    setMaintenance({

                      ...maintenance,

                      enabled: value

                    })

                  }

                />


                <Field label="Message de maintenance">

                  <textarea

                    rows={5}

                    value={
                      maintenance.message
                    }

                    onChange={(e) =>

                      setMaintenance({

                        ...maintenance,

                        message:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>

            </div>

          )}



          {/* =================================================
              BARRE ENREGISTREMENT
          ================================================= */}

          <div className="
            mt-10
            pt-6
            border-t
            border-gray-100
            flex
            items-center
            justify-between
            gap-4
          ">


            <div>

              {saved && (

                <div className="
                  flex
                  items-center
                  gap-2
                  text-green-600
                  font-medium
                ">

                  <FaCheckCircle />

                  <span>

                    {activeTab === "security"

                      ? "Mot de passe modifié avec succès."

                      : "Paramètres enregistrés avec succès."
                    }

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
                disabled:opacity-60
                disabled:cursor-not-allowed
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

                : activeTab === "security"

                  ? "Modifier le mot de passe"

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
// TITRE SECTION
// =====================================================

function SectionTitle({
  title,
  description
}) {

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

function Field({
  label,
  children
}) {

  return (

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-gray-700
        mb-2
      ">

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

    <div className="
      flex
      items-center
      justify-between
      gap-6
      p-5
      border
      border-gray-100
      rounded-2xl
      hover:bg-gray-50
      transition
    ">

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

        className={`
          relative
          flex-shrink-0
          w-12
          h-6
          rounded-full
          transition

          ${
            checked

              ? "bg-purple-600"

              : "bg-gray-300"
          }
        `}

      >

        <span

          className={`
            absolute
            top-1
            w-4
            h-4
            bg-white
            rounded-full
            shadow
            transition

            ${
              checked

                ? "left-7"

                : "left-1"
            }
          `}

        />

      </button>

    </div>

  )

}


export default Settings