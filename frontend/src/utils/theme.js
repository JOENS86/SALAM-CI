// =====================================================
// GESTION DU THÈME GLOBAL SALAM CI
// =====================================================

const THEME_KEY = "salamci-theme"


// =====================================================
// RÉCUPÉRER LE THÈME SYSTÈME
// =====================================================

export const getSystemTheme = () => {

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light"

}


// =====================================================
// APPLIQUER LE THÈME
// =====================================================

export const applyTheme = (theme) => {

  const root = document.documentElement

  let finalTheme = theme

  if (theme === "system") {

    finalTheme = getSystemTheme()

  }

  if (finalTheme === "dark") {

    root.classList.add("dark")

  }

  else {

    root.classList.remove("dark")

  }

}


// =====================================================
// SAUVEGARDER LE THÈME
// =====================================================

export const saveTheme = (theme) => {

  localStorage.setItem(
    THEME_KEY,
    theme
  )

  applyTheme(theme)

}


// =====================================================
// RÉCUPÉRER LE THÈME
// =====================================================

export const getSavedTheme = () => {

  return (
    localStorage.getItem(THEME_KEY) ||
    "light"
  )

}


// =====================================================
// INITIALISATION
// =====================================================

export const initializeTheme = () => {

  const theme = getSavedTheme()

  applyTheme(theme)

  return theme

}


// =====================================================
// ÉCOUTER LE MODE SYSTÈME
// =====================================================

export const watchSystemTheme = () => {

  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  )

  const handleChange = () => {

    const currentTheme =
      getSavedTheme()

    if (currentTheme === "system") {

      applyTheme("system")

    }

  }

  mediaQuery.addEventListener(
    "change",
    handleChange
  )

  return () => {

    mediaQuery.removeEventListener(
      "change",
      handleChange
    )

  }

}