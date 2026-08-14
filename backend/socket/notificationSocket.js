// =====================================================
// SOCKET NOTIFICATIONS
// =====================================================

const notificationSocket = (io, socket) => {

    // =====================================================
    // ENREGISTRER L'UTILISATEUR
    // =====================================================

    socket.on(
        "notification:register",
        (userId) => {

            if (!userId) {
                return;
            }

            // Chaque utilisateur possède sa propre room
            const room = `user:${userId}`;

            socket.join(room);

            socket.data.notificationUserId =
                userId.toString();

            console.log(
                `🔔 Notification Socket enregistrée : ${userId}`
            );

        }
    );


    // =====================================================
    // DECONNEXION
    // =====================================================

    socket.on(
        "disconnect",
        () => {

            const userId =
                socket.data.notificationUserId;

            if (userId) {

                console.log(
                    `🔕 Notification Socket déconnectée : ${userId}`
                );

            }

        }
    );

};


export default notificationSocket;