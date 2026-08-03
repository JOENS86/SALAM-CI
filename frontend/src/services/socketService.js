import { io } from "socket.io-client";

class SocketService {

    constructor() {

        this.socket = null;

    }

    // =====================================================
    // CONNEXION
    // =====================================================

    connect() {

        if (this.socket) {

            return this.socket;

        }

        this.socket = io(

            import.meta.env.VITE_API_URL.replace(

                "/api",

                ""

            ),

            {

                transports: [

                    "websocket"

                ],

                autoConnect: true

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