import { io } from "socket.io-client";

// =====================================================
// CONNEXION SOCKET.IO
// =====================================================

const socket = io(

    "https://salam-ci-backend.onrender.com",

    {

        autoConnect: true,

        transports: ["websocket"]

    }

);

export default socket;