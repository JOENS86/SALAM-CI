import { useEffect, useState } from "react"

import AdminSidebar from "../components/AdminSidebar"

import API from "../services/api"


function AdminLayout({ children }) {

  const [theme, setTheme] = useState("light")
  const [animations, setAnimations] = useState(true)

  // =====================================================
  // APPLICATION DU THÈME
  // =====================================================

  useEffect(() => {

    const applyAppearance = (
      selectedTheme,
      enableAnimations
    ) => {

      const root =
        document.documentElement

      // =========================
      // DÉTERMINER LE THÈME
      // =========================

      let darkMode = false

      if (selectedTheme === "dark") {

        darkMode = true

      }

      else if (selectedTheme === "system") {

        darkMode =
          window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches

      }

      // =========================
      // APPLIQUER DARK
      // =========================

      root.classList.toggle(
        "dark",
        darkMode
      )

      // =========================
      // ANIMATIONS
      // =========================

      root.classList.toggle(
        "no-animations",
        !enableAnimations
      )

    }


    applyAppearance(
      theme,
      animations
    )


    // =========================
    // SYSTÈME
    // SURVEILLER WINDOWS
    // =========================

    if (theme === "system") {

      const mediaQuery =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        )

      const handleSystemTheme = () => {

        applyAppearance(
          "system",
          animations
        )

      }

      mediaQuery.addEventListener(
        "change",
        handleSystemTheme
      )

      return () => {

        mediaQuery.removeEventListener(
          "change",
          handleSystemTheme
        )

      }

    }

  }, [
    theme,
    animations
  ])


  // =====================================================
  // CHARGER LES PARAMÈTRES
  // =====================================================

  useEffect(() => {

    const loadAppearance = async () => {

      try {

        const res =
          await API.get("/settings")

        const appearance =
          res.data?.appearance

        if (!appearance) {

          return

        }

        setTheme(
          appearance.theme ||
          "light"
        )

        setAnimations(
          appearance.animations !== false
        )

      }

      catch (error) {

        console.log(
          "Impossible de charger l'apparence :",
          error
        )

      }

    }


    loadAppearance()

  }, [])


  // =====================================================
  // ÉCOUTER LES MODIFICATIONS DEPUIS SETTINGS
  // =====================================================

  useEffect(() => {

    const handleAppearanceChange = (event) => {

      const appearance =
        event.detail

      if (!appearance) {

        return

      }

      setTheme(
        appearance.theme ||
        "light"
      )

      setAnimations(
        appearance.animations !== false
      )

    }


    window.addEventListener(
      "appearanceChanged",
      handleAppearanceChange
    )

    return () => {

      window.removeEventListener(
        "appearanceChanged",
        handleAppearanceChange
      )

    }

  }, [])


  return (

    <div
      className="
      flex
      h-screen
      overflow-hidden
      bg-[#f8fafc]
      dark:bg-slate-900
      transition-colors
      duration-300
      "
    >

      <AdminSidebar />


      <div
        className="
        flex-1
        overflow-y-auto
        bg-[#f8fafc]
        dark:bg-slate-900
        p-10
        text-gray-900
        dark:text-gray-100
        transition-colors
        duration-300
        "
      >

        {children}

      </div>

    </div>

  )

}


export default AdminLayout