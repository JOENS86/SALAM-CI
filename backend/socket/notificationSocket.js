// =====================================================
// UTILISATEURS CONNECTES
// =====================================================

const onlineUsers = new Map();

const notificationSocket = (io, socket) => {

    // =====================================================
    // UTILISATEUR CONNECTE
    // =====================================================

    socket.on(

        "notification:register",

        (userId) => {

            onlineUsers.set(

                userId,

                socket.id

            );

            console.log(

                `🟢 Utilisateur connecté : ${userId}`

            );

        }

    );

    // =====================================================
    // ENVOYER UNE NOTIFICATION
    // =====================================================

    socket.on(

        "notification:send",

        ({ recipientId, notification }) => {

            const socketId = onlineUsers.get(

                recipientId

            );

            if (socketId) {

                io.to(socketId).emit(

                    "notification:new",

                    notification

                );

            }

        }

    );

    // =====================================================
    // NOTIFICATION GLOBALE
    // =====================================================

    socket.on(

        "notification:broadcast",

        (notification) => {

            io.emit(

                "notification:new",

                notification

            );

        }

    );

    // =====================================================
    // DECONNEXION
    // =====================================================

    socket.on(

        "disconnect",

        () => {

            for (const [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    break;

                }

            }

        }

    );

};

export default notificationSocket;