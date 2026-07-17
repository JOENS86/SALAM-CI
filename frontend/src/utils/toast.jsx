// =========================
// IMPORTS
// =========================

import { toast } from "react-toastify"

import CustomToast from "../components/CustomToast"

// =========================
// TOAST SUCCÈS
// =========================

export const successToast = (

  title,

  message

) => {

  toast(

    <CustomToast

      type="success"

      title={title}

      message={message}

    />,

    {

      closeButton: false,

      hideProgressBar: false,

      autoClose: 3000,

      style: {

        background: "transparent",

        boxShadow: "none",

        padding: 0

      }

    }

  )

}

// =========================
// TOAST ERREUR
// =========================

export const errorToast = (

  title,

  message

) => {

  toast(

    <CustomToast

      type="error"

      title={title}

      message={message}

    />,

    {

      closeButton: false,

      hideProgressBar: false,

      autoClose: 3000,

      style: {

        background: "transparent",

        boxShadow: "none",

        padding: 0

      }

    }

  )

}