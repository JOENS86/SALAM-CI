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
        ({ roomId, user = {} }) => {

            socket.join(roomId);

            socket.data.roomId = roomId;
            socket.data.user = user;

            // ---------------------------------------------
            // NOM COMPLET
            // ---------------------------------------------
            const participantName =
                user.name ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                "Participant";

            const participant = {
                socketId: socket.id,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                name: participantName,
                email: user.email,
                photo: user.photo,
                role: user.role
            };

            // ---------------------------------------------
            // AJOUTER LE PARTICIPANT
            // ---------------------------------------------
            addParticipant(
                roomId,
                participant
            );

            console.log(
                `🟢 ${participantName} rejoint ${roomId}`
            );

            console.log(
                "👥 Participants :",
                getParticipants(roomId)
            );

            console.log(
                "🔢 Nombre :",
                getParticipantCount(roomId)
            );

            // ---------------------------------------------
            // INFORMER LES AUTRES QU'UN PARTICIPANT ARRIVE
            // ---------------------------------------------
            socket.to(roomId).emit(
                "conference:userJoined",
                {
                    participant
                }
            );

            // ---------------------------------------------
            // ENVOYER LA LISTE COMPLETE A TOUT LE MONDE
            // ---------------------------------------------
            io.to(roomId).emit(
                "conference:participants",
                {
                    participants: getParticipants(roomId),
                    count: getParticipantCount(roomId)
                }
            );

            // ---------------------------------------------
            // MISE A JOUR GLOBALE
            // ---------------------------------------------
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
        ({ roomId }) => {

            const participant =
                getParticipants(roomId)
                    .find(
                        p => p.socketId === socket.id
                    );

            removeParticipant(
                roomId,
                socket.id
            );

            socket.leave(roomId);

            // ---------------------------------------------
            // INFORMER LES AUTRES
            // ---------------------------------------------
            if (participant) {

                io.to(roomId).emit(
                    "conference:userLeft",
                    {
                        participant
                    }
                );

            }

            // ---------------------------------------------
            // NOUVELLE LISTE
            // ---------------------------------------------
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

            // Nettoyer les données socket
            socket.data.roomId = null;
            socket.data.user = null;

        }
    );


    // =====================================================
    // DECONNEXION
    // =====================================================
    socket.on("disconnect", () => {

        if (
            !socket.data.roomId ||
            !socket.data.user
        ) {
            return;
        }

        const roomId = socket.data.roomId;

        const participant =
            getParticipants(roomId)
                .find(
                    p => p.socketId === socket.id
                );

        removeParticipant(
            roomId,
            socket.id
        );

        if (participant) {

            io.to(roomId).emit(
                "conference:userLeft",
                {
                    participant
                }
            );

        }

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
    // INFOS SALLE
    // =====================================================
    socket.on(
        "conference:getRoomInfo",
        (roomId) => {

            const room =
                io.sockets.adapter.rooms.get(roomId);

            socket.emit(
                "conference:roomInfo",
                {
                    roomId,
                    participants: room
                        ? room.size
                        : 0
                }
            );

        }
    );

};

export default conferenceSocket;