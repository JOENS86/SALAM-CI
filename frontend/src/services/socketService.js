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

// VITE_API_URL contient normalement :
// https://salam-ci-backend.onrender.com/api
//
// Socket.IO doit utiliser :
// https://salam-ci-backend.onrender.com

const SOCKET_URL = API_URL
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

// =====================================================
// SERVICE SOCKET.IO
// =====================================================

class SocketService {

    constructor() {

        this.socket = null;

    }

    // =====================================================
    // CONNEXION
    // =====================================================

    connect() {

        // Si déjà connecté, on réutilise le socket
        if (this.socket) {

            return this.socket;

        }

        console.log(
            "🔌 Connexion Socket.IO :",
            SOCKET_URL
        );

        // =====================================================
        // CREER LA CONNEXION
        // =====================================================

        this.socket = io(

            SOCKET_URL,

            {
                autoConnect: true,

                transports: ["websocket"]
            }

        );

        // =====================================================
        // CONNEXION REUSSIE
        // =====================================================

        this.socket.on(

            "connect",

            () => {

                console.log(
                    "🟢 Socket.IO connecté :",
                    this.socket.id
                );

            }

        );

        // =====================================================
        // ERREUR DE CONNEXION
        // =====================================================

        this.socket.on(

            "connect_error",

            (error) => {

                console.error(
                    "❌ Erreur Socket.IO :",
                    error.message
                );

            }

        );

        // =====================================================
        // DECONNEXION
        // =====================================================

        this.socket.on(

            "disconnect",

            (reason) => {

                console.log(
                    "🔴 Socket.IO déconnecté :",
                    reason
                );

            }

        );

        return this.socket;

    }

    // =====================================================
    // DECONNEXION
    // =====================================================

    disconnect() {

        if (this.socket) {

            this.socket.disconnect();

            this.socket = null;

        }

    }

    // =====================================================
    // SOCKET
    // =====================================================

    getSocket() {

        return this.socket;

    }

    // =====================================================
    // EMIT
    // =====================================================

    emit(

        event,

        data

    ) {

        if (this.socket) {

            this.socket.emit(

                event,

                data

            );

        }

    }

    // =====================================================
    // LISTENER
    // =====================================================

    on(

        event,

        callback

    ) {

        if (this.socket) {

            this.socket.on(

                event,

                callback

            );

        }

    }

    // =====================================================
    // SUPPRIMER LISTENER
    // =====================================================

    off(

        event,

        callback

    ) {

        if (this.socket) {

            this.socket.off(

                event,

                callback

            );

        }

    }

}

// =====================================================
// INSTANCE UNIQUE
// =====================================================

export default new SocketService();