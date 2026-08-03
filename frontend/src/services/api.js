import axios from "axios";

import {

    errorToast

} from "../utils/toast";

// =====================================================
// EVITE LES MULTIPLES POPUPS
// =====================================================

let roleChangedHandled = false;

// =====================================================
// INSTANCE AXIOS
// =====================================================

const API = axios.create({

    baseURL:

        import.meta.env.VITE_API_URL ||

        "http://localhost:5000/api",

    timeout: 10000,

    headers: {

        "Content-Type": "application/json"

    }

});

// =====================================================
// INTERCEPTEUR DES REQUETES
// =====================================================

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem(

            "token"

        );

        if (token) {

            config.headers.Authorization =

                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

// =====================================================
// INTERCEPTEUR DES REPONSES
// =====================================================

API.interceptors.response.use(

    (response) => response,

    (error) => {

        // ==========================================
        // SERVEUR INJOIGNABLE
        // ==========================================

        if (!error.response) {

            errorToast(

                "Serveur indisponible",

                "Impossible de contacter le serveur."

            );

            return Promise.reject(error);

        }

        // ==========================================
        // SESSION EXPIREE
        // ==========================================

        if (

            error.response.status === 401 &&

            error.response.data?.code ===

                "ROLE_CHANGED" &&

            !roleChangedHandled

        ) {

            roleChangedHandled = true;

            errorToast(

                "Session expirée",

                "Votre rôle a été modifié. Veuillez vous reconnecter."

            );

            localStorage.removeItem(

                "token"

            );

            localStorage.removeItem(

                "user"

            );

            localStorage.removeItem(

                "registeredEmail"

            );

            setTimeout(() => {

                window.location.replace(

                    "/login"

                );

            }, 2500);

        }

        // ==========================================
        // TOKEN EXPIRE
        // ==========================================

        else if (

            error.response.status === 401

        ) {

            errorToast(

                "Authentification",

                error.response.data?.message ||

                "Veuillez vous reconnecter."

            );

        }

        // ==========================================
        // ACCES REFUSE
        // ==========================================

        else if (

            error.response.status === 403

        ) {

            errorToast(

                "Accès refusé",

                error.response.data?.message ||

                "Vous n'avez pas les autorisations nécessaires."

            );

        }

        // ==========================================
        // RESSOURCE INTROUVABLE
        // ==========================================

        else if (

            error.response.status === 404

        ) {

            errorToast(

                "Introuvable",

                error.response.data?.message ||

                "La ressource demandée est introuvable."

            );

        }

        // ==========================================
        // ERREUR SERVEUR
        // ==========================================

        else if (

            error.response.status === 500

        ) {

            errorToast(

                "Erreur serveur",

                error.response.data?.message ||

                "Une erreur interne est survenue."

            );

        }

        return Promise.reject(error);

    }

);

export default API;