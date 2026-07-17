import axios from "axios"

// =========================
// ÉVITE LES MULTIPLES POPUPS
// =========================
let roleChangedHandled = false

import {

  errorToast

} from "../utils/toast"

// =========================
// CRÉATION INSTANCE AXIOS
// =========================
const API = axios.create({

  baseURL: "http://localhost:5000/api"

})

// =========================
// AJOUT AUTOMATIQUE DU TOKEN
// =========================
API.interceptors.request.use(

  (config) => {

    // =========================
    // RÉCUPÉRATION TOKEN
    // =========================
    const token = localStorage.getItem("token")

    // =========================
    // AJOUT HEADER AUTHORIZATION
    // =========================
    if (token) {

      config.headers.Authorization =

        `Bearer ${token}`

    }

    return config

  },

  (error) => Promise.reject(error)

)

// =========================
// INTERCEPTOR DES RÉPONSES
// =========================
API.interceptors.response.use(

  // =========================
  // SI TOUT VA BIEN
  // =========================
  (response) => response,

  // =========================
  // SI UNE ERREUR ARRIVE
  // =========================
  (error) => {

// =========================
// RÔLE MODIFIÉ
// =========================
if (

  error.response?.status === 401

  &&

  error.response?.data?.code === "ROLE_CHANGED"

  &&

  !roleChangedHandled

) {

  // Empêche les autres requêtes
  roleChangedHandled = true

  // =========================
  // MESSAGE
  // =========================
  errorToast(

    "Session expirée",

    "Votre rôle a été modifié. Veuillez vous reconnecter."

  )

  // =========================
  // SUPPRESSION SESSION
  // =========================
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("registeredEmail")

  // =========================
  // REDIRECTION
  // =========================
  setTimeout(() => {

    window.location.replace("/login")

  }, 2800)

}

    return Promise.reject(error)

  }

)

export default API