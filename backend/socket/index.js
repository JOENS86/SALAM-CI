import conferenceSocket from "./conferenceSocket.js";
import chatSocket from "./chatSocket.js";
import notificationSocket from "./notificationSocket.js";
import participantSocket from "./participantSocket.js";
import {removeParticipant, getParticipants, getParticipantCount} from "./roomManager.js";
import signalingSocket from "./signalingSocket.js";
import handSocket from "./handSocket.js";
import controlSocket from "./controlSocket.js";

const initializeSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("🟢 Utilisateur connecté :", socket.id);

        conferenceSocket(io, socket);

        participantSocket(io, socket);

        chatSocket(io, socket);

        notificationSocket(io, socket);

        signalingSocket(io, socket);

        handSocket(io, socket);

        controlSocket(io, socket);

        socket.on("disconnect", () => {

            const roomId = socket.data.roomId;
        
            const user = socket.data.user;
        
            if (roomId && user) {
        
                removeParticipant(
        
                    roomId,
        
                    user._id
        
                );
        
                io.to(roomId).emit(
        
                    "conference:participants",
        
                    {
        
                        participants: getParticipants(roomId),
        
                        count: getParticipantCount(roomId)
        
                    }
        
                );
        
            }
        
            console.log("🔴 Utilisateur déconnecté :", socket.id);
        
        });

    });

};

export default initializeSocket;