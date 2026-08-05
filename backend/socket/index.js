import conferenceSocket from "./conferenceSocket.js";
import chatSocket from "./chatSocket.js";
import notificationSocket from "./notificationSocket.js";
import participantSocket from "./participantSocket.js";

const initializeSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("🟢 Utilisateur connecté :", socket.id);

        conferenceSocket(io, socket);

        participantSocket(io, socket);

        chatSocket(io, socket);

        notificationSocket(io, socket);

        socket.on("disconnect", () => {

            console.log("🔴 Utilisateur déconnecté :", socket.id);

        });

    });

};

export default initializeSocket;