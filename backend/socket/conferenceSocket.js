const conferenceSocket = (io, socket) => {

    // =====================================================
    // REJOINDRE UNE SALLE
    // =====================================================

    socket.on(

        "conference:joinRoom",

        ({ roomId, user }) => {

            socket.join(roomId);

            console.log(

                `🟢 ${user.firstName} rejoint ${roomId}`

            );

            io.to(roomId).emit(

                "conference:userJoined",

                {

                    user,

                    socketId: socket.id

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

            socket.leave(roomId);

            io.to(roomId).emit(

                "conference:userLeft",

                {

                    user,

                    socketId: socket.id

                }

            );

        }

    );

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