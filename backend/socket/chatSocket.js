// =====================================================
// MESSAGES EN MEMOIRE
// roomId => messages
// =====================================================

const chats = {};

const chatSocket = (io, socket) => {

    // =====================================================
    // ENVOYER UN MESSAGE
    // =====================================================

    socket.on(

        "chat:send",

        ({ roomId, user, message }) => {

            if (!chats[roomId]) {

                chats[roomId] = [];

            }

            const newMessage = {

                id: Date.now().toString(),

                sender: {

                    id: user.id,

                    firstName: user.firstName,

                    lastName: user.lastName,

                    photo: user.photo,

                    role: user.role

                },

                message,

                createdAt: new Date()

            };

            chats[roomId].push(newMessage);

            io.to(roomId).emit(

                "chat:newMessage",

                newMessage

            );

        }

    );

    // =====================================================
    // HISTORIQUE
    // =====================================================

    socket.on(

        "chat:getHistory",

        (roomId) => {

            socket.emit(

                "chat:history",

                chats[roomId] || []

            );

        }

    );

    // =====================================================
    // UTILISATEUR EN TRAIN D'ECRIRE
    // =====================================================

    socket.on(

        "chat:typing",

        ({ roomId, user }) => {

            socket.to(roomId).emit(

                "chat:typing",

                {

                    user

                }

            );

        }

    );

    // =====================================================
    // FIN D'ECRITURE
    // =====================================================

    socket.on(

        "chat:stopTyping",

        ({ roomId, user }) => {

            socket.to(roomId).emit(

                "chat:stopTyping",

                {

                    user

                }

            );

        }

    );

    // =====================================================
    // SUPPRIMER UN MESSAGE
    // (Prof/Admin)
    // =====================================================

    socket.on(

        "chat:delete",

        ({ roomId, messageId }) => {

            if (!chats[roomId]) return;

            chats[roomId] = chats[roomId].filter(

                message =>

                    message.id !== messageId

            );

            io.to(roomId).emit(

                "chat:history",

                chats[roomId]

            );

        }

    );

};

export default chatSocket;