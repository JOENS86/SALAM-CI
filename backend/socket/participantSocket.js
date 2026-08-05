// =====================================================
// MEMOIRE DES PARTICIPANTS
// =====================================================

const rooms = {};

const participantSocket = (io, socket) => {

    // =====================================================
    // REJOINDRE
    // =====================================================
    socket.on(

        "participant:join",

        ({ roomId, user }) => {

            if (!rooms[roomId]) {

                rooms[roomId] = [];

            }

            const alreadyExists = rooms[roomId].find(

                participant => participant.id === user.id

            );

            if (!alreadyExists) {

                rooms[roomId].push({

                    socketId: socket.id,

                    id: user.id,

                    firstName: user.firstName,

                    lastName: user.lastName,

                    photo: user.photo,

                    role: user.role,

                    microphone: true,

                    camera: true,

                    screenSharing: false,

                    handRaised: false,

                    joinedAt: new Date()

                });

            }

            io.to(roomId).emit(

                "participant:list",

                rooms[roomId]

            );

        }

    );

// =====================================================
// MICRO
// =====================================================
socket.on(

    "participant:microphone",

    ({ roomId, enabled }) => {

        const participant = rooms[roomId]?.find(

            participant =>

                participant.socketId === socket.id

        );

        if (!participant) return;

        participant.microphone = enabled;

        io.to(roomId).emit(

            "participant:list",

            rooms[roomId]

        );

    }

);

// =====================================================
// CAMERA
// =====================================================

socket.on(

    "participant:camera",

    ({ roomId, enabled }) => {

        const participant = rooms[roomId]?.find(

            participant =>

                participant.socketId === socket.id

        );

        if (!participant) return;

        participant.camera = enabled;

        io.to(roomId).emit(

            "participant:list",

            rooms[roomId]

        );

    }

);

// =====================================================
// MAIN LEVEE
// =====================================================

socket.on(

    "participant:hand",

    ({ roomId, raised }) => {

        const participant = rooms[roomId]?.find(

            participant =>

                participant.socketId === socket.id

        );

        if (!participant) return;

        participant.handRaised = raised;

        io.to(roomId).emit(

            "participant:list",

            rooms[roomId]

        );

    }

);

    // =====================================================
    // QUITTER
    // =====================================================

    socket.on(

        "participant:leave",

        ({ roomId }) => {

            if (!rooms[roomId]) return;

            rooms[roomId] = rooms[roomId].filter(

                participant =>

                    participant.socketId !== socket.id

            );

            io.to(roomId).emit(

                "participant:list",

                rooms[roomId]

            );

        }

    );

};

export default participantSocket;