import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import "./index.css"

import { BrowserRouter } from "react-router-dom"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import {
  initializeTheme,
  watchSystemTheme
} from "./utils/theme"


// =====================================================
// INITIALISATION DU THÈME
// =====================================================

initializeTheme()

watchSystemTheme()


// =====================================================
// APPLICATION
// =====================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </BrowserRouter>

  </React.StrictMode>

)