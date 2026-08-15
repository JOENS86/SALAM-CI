import { io } from "socket.io-client";


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


        // =====================================================
        // URL DE L'API
        // =====================================================

        const apiUrl =
            import.meta.env.VITE_API_URL
            || "https://salam-ci-backend.onrender.com/api";


        // =====================================================
        // URL DU SERVEUR SOCKET.IO
        // =====================================================

        const socketUrl =
            apiUrl.replace("/api", "");


        console.log(
            "🔌 Connexion Socket.IO :",
            socketUrl
        );


        // =====================================================
        // CREER LA CONNEXION
        // =====================================================

        this.socket = io(

            socketUrl,

            {

                transports: [

                    "websocket"

                ],

                autoConnect: true

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


export default new SocketService();