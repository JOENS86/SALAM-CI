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

            if (!roomId) return;

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
            // INFORMER UNIQUEMENT LES AUTRES
            // ---------------------------------------------
            socket.to(roomId).emit(
                "conference:userJoined",
                {
                    participant
                }
            );

            // ---------------------------------------------
            // ENVOYER LA LISTE COMPLETE
            // A TOUS LES PARTICIPANTS
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
    // ETAT MEDIA D'UN PARTICIPANT
    // =====================================================
    socket.on(
        "participant:mediaState",
        ({
            roomId,
            microphone,
            camera
        } = {}) => {

            if (!roomId) return;

            socket.to(roomId).emit(
                "participant:mediaState",
                {
                    socketId: socket.id,
                    microphone: Boolean(microphone),
                    camera: Boolean(camera)
                }
            );

        }
    );

// =====================================================
// ETAT MICRO DU PARTICIPANT
// =====================================================
socket.on(
    "participant:microphone:state",
    ({ roomId, enabled } = {}) => {

        if (!roomId) return;

        socket.to(roomId).emit(
            "participant:mediaState",
            {
                socketId: socket.id,
                microphone: Boolean(enabled)
            }
        );

    }
);


// =====================================================
// ETAT CAMERA DU PARTICIPANT
// =====================================================
socket.on(
    "participant:camera:state",
    ({ roomId, enabled } = {}) => {

        if (!roomId) return;

        socket.to(roomId).emit(
            "participant:mediaState",
            {
                socketId: socket.id,
                camera: Boolean(enabled)
            }
        );

    }
);

// =====================================================
// ETAT PARTAGE D'ECRAN
// =====================================================
socket.on(
    "participant:screenShareState",
    ({
        roomId,
        enabled
    } = {}) => {

        if (!roomId) return;

        console.log(
            `🖥️ ${socket.id} ${
                enabled
                    ? "COMMENCE"
                    : "ARRETE"
            } le partage d'écran`
        );

        socket.to(roomId).emit(
            "participant:screenShareState",
            {
                socketId: socket.id,
                enabled: Boolean(enabled)
            }
        );

    }
);

    // =====================================================
    // QUITTER UNE SALLE
    // =====================================================
    socket.on(
        "conference:leaveRoom",
        ({ roomId } = {}) => {

            if (!roomId) return;

            const participant =
                getParticipants(roomId)
                    .find(
                        p =>
                            p.socketId === socket.id
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
                    participants:
                        getParticipants(roomId),

                    count:
                        getParticipantCount(roomId)
                }
            );

            // ---------------------------------------------
            // MISE A JOUR GLOBALE
            // ---------------------------------------------
            io.emit(
                "conference:participantsUpdated",
                {
                    roomId,
                    count:
                        getParticipantCount(roomId)
                }
            );

            // ---------------------------------------------
            // NETTOYER LES DONNEES SOCKET
            // ---------------------------------------------
            socket.data.roomId = null;
            socket.data.user = null;

        }
    );


    // =====================================================
    // DECONNEXION
    // =====================================================
    socket.on(
        "disconnect",
        () => {

            if (
                !socket.data.roomId ||
                !socket.data.user
            ) {
                return;
            }

            const roomId =
                socket.data.roomId;

            const participant =
                getParticipants(roomId)
                    .find(
                        p =>
                            p.socketId === socket.id
                    );

            removeParticipant(
                roomId,
                socket.id
            );

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
                    participants:
                        getParticipants(roomId),

                    count:
                        getParticipantCount(roomId)
                }
            );

            // ---------------------------------------------
            // MISE A JOUR GLOBALE
            // ---------------------------------------------
            io.emit(
                "conference:participantsUpdated",
                {
                    roomId,
                    count:
                        getParticipantCount(roomId)
                }
            );

            // ---------------------------------------------
            // NETTOYER
            // ---------------------------------------------
            socket.data.roomId = null;
            socket.data.user = null;

        }
    );


    // =====================================================
    // DEMARRAGE CONFERENCE
    // =====================================================
    socket.on(
        "conference:start",
        ({ roomId } = {}) => {

            if (!roomId) return;

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
        ({ roomId } = {}) => {

            if (!roomId) return;

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
        ({
            roomId,
            reason
        } = {}) => {

            if (!roomId) return;

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
        ({
            roomId,
            conference
        } = {}) => {

            if (!roomId) return;

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

            if (!roomId) return;

            const room =
                io.sockets.adapter.rooms.get(
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