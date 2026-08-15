import { io } from "socket.io-client";

// =====================================================
// URL DU BACKEND SALAM CI
// =====================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://salam-ci-backend.onrender.com/api";

// =====================================================
// URL DU SERVEUR SOCKET.IO
// =====================================================

const SOCKET_URL = API_URL
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

// =====================================================
// CONNEXION SOCKET.IO
// =====================================================

const socket = io(

    SOCKET_URL,

    {

        autoConnect: true,

        transports: ["websocket"]

    }

);

// =====================================================
// DEBUG
// =====================================================

socket.on(

    "connect",

    () => {

        console.log(
            "🟢 Socket.IO connecté :",
            socket.id
        );

    }

);

socket.on(

    "connect_error",

    (error) => {

        console.error(
            "❌ Erreur Socket.IO :",
            error.message
        );

    }

);

export default socket;