import {
    addParticipant,
    removeParticipant,
    getParticipants,
    getParticipantCount
} from "./roomManager.js";

const conferenceSocket = (io, socket) => {

    // =====================================================
    // REJOINDRE UNE SALLE
    // =====================================================
    socket.on(

        "conference:joinRoom",
    
        ({ roomId, user }) => {
    
            socket.join(roomId);
    
            socket.data.roomId = roomId;
    
            socket.data.user = user;
    
            addParticipant(

                roomId,
            
                {
            
                    socketId: socket.id,
            
                    ...user
            
                }
            
            );
    
            console.log(`🟢 ${user.name} rejoint ${roomId}`);
    
            console.log(
                "Participants :",
                getParticipants(roomId)
            );
            
            console.log(
                "Nombre :",
                getParticipantCount(roomId)
            );

            io.to(roomId).emit(
                "conference:userJoined",
                {
                    participant: {
                        socketId: socket.id,
                        ...user
                    }
                }
            );
            
            io.to(roomId).emit(
    
                "conference:participants",
    
                {
    
                    participants: getParticipants(roomId),
                    count: getParticipantCount(roomId)
    
                }
    
            );

            io.emit(
                "conference:participantsUpdated",
                {
                    roomId,
                    count: getParticipantCount(roomId)
                }
            );
    
        }
    
    );

    // =====================================================
    // QUITTER UNE SALLE
    // =====================================================
    socket.on(

        "conference:leaveRoom",
    
        ({ roomId, user }) => {
    
            removeParticipant(
    
                roomId,
    
                socket.id
    
            );
    
            socket.leave(roomId);
    
            io.to(roomId).emit(

                "conference:userLeft",
            
                {
            
                    participant: {
            
                        socketId: socket.id,
            
                        ...user
            
                    }
            
                }
            
            );
    
            io.to(roomId).emit(
    
                "conference:participants",
    
                {
    
                    participants: getParticipants(roomId),
                    count: getParticipantCount(roomId)
    
                }
    
            );

            io.emit(
                "conference:participantsUpdated",
                {
                    roomId,
                    count: getParticipantCount(roomId)
                }
            );
    
        }
    
    );

    // =====================================================
    // DECONNECTER D'UNE SALLE
    // =====================================================
    socket.on("disconnect", () => {

        if (!socket.data.roomId || !socket.data.user) return;
    
          const roomId = socket.data.roomId;
    
          const participant = {
    
            socketId: socket.id,
    
            ...socket.data.user
    
        };
    
        removeParticipant(
    
            roomId,
    
            socket.id
    
        );
    
        io.to(roomId).emit(
    
            "conference:userLeft",
    
            {
    
                participant
    
            }
    
        );
    
        io.to(roomId).emit(
    
            "conference:participants",
    
            {
    
                participants: getParticipants(roomId),  
                count: getParticipantCount(roomId)
    
            }
    
        );

        io.emit(
            "conference:participantsUpdated",
            {
                roomId,
                count: getParticipantCount(roomId)
            }
        );
    
    });

    // =====================================================
    // DEMARRAGE CONFERENCE
    // =====================================================
    socket.on(

        "conference:start",

        ({ roomId }) => {

            io.to(roomId).emit(

                "conference:started",

                {

                    startedAt: new Date()

                }

            );

        }

    );

    // =====================================================
    // FIN CONFERENCE
    // =====================================================

    socket.on(

        "conference:end",

        ({ roomId }) => {

            io.to(roomId).emit(

                "conference:ended",

                {

                    endedAt: new Date()

                }

            );

        }

    );

    // =====================================================
    // ANNULATION
    // =====================================================

    socket.on(

        "conference:cancel",

        ({ roomId, reason }) => {

            io.to(roomId).emit(

                "conference:cancelled",

                {

                    reason

                }

            );

        }

    );

    // =====================================================
    // MISE A JOUR
    // =====================================================

    socket.on(

        "conference:update",

        ({ roomId, conference }) => {

            io.to(roomId).emit(

                "conference:updated",

                conference

            );

        }

    );

    // =====================================================
    // DEMANDE DES INFOS
    // =====================================================

    socket.on(

        "conference:getRoomInfo",

        (roomId) => {

            const room = io.sockets.adapter.rooms.get(

                roomId

            );

            socket.emit(

                "conference:roomInfo",

                {

                    roomId,

                    participants:

                        room

                        ? room.size

                        : 0

                }

            );

        }

    );

};

export default conferenceSocket;