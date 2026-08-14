import Conference from "../models/Conference.js";

// =====================================================
// MEMOIRE DES MAINS LEVEES
// =====================================================
const raisedHands = {};


// =====================================================
// RECUPERER L'HOTE REEL DE LA CONFERENCE
// =====================================================
const getConferenceHost = async (roomId) => {

    try {

        const conference =
            await Conference.findById(roomId)
                .select("createdBy teacher");

        if (!conference) {

            console.warn(
                "⚠️ Conférence introuvable pour la salle :",
                roomId
            );

            return null;

        }

        // =================================================
        // CONFERENCE CREEE PAR L'ADMINISTRATEUR
        // =================================================
        if (conference.createdBy) {

            return String(
                conference.createdBy
            );

        }

        // =================================================
        // CONFERENCE CREEE PAR L'ENSEIGNANT
        // =================================================
        if (conference.teacher) {

            return String(
                conference.teacher
            );

        }

        console.warn(
            "⚠️ Aucun hôte trouvé pour la conférence :",
            roomId
        );

        return null;

    }

    catch (error) {

        console.error(
            "❌ Erreur récupération hôte conférence :",
            error.message
        );

        return null;

    }

};


// =====================================================
// ENVOYER LA LISTE DES MAINS UNIQUEMENT A L'HOTE
// =====================================================
const emitRaisedHandsToHost = async (
    io,
    roomId
) => {

    try {

        const hostId =
            await getConferenceHost(roomId);

        if (!hostId) {

            return;

        }

        const room =
            io.sockets.adapter.rooms.get(roomId);

        if (!room) {

            return;

        }

        room.forEach(socketId => {

            const participantSocket =
                io.sockets.sockets.get(socketId);

            if (!participantSocket) {

                return;

            }

            const participantUserId =
                participantSocket.data.user?._id ||
                participantSocket.data.user?.id;

            if (!participantUserId) {

                return;

            }

            // =================================================
            // SEUL L'HOTE RECOIT LA LISTE
            // =================================================
            if (
                String(participantUserId)
                ===
                String(hostId)
            ) {

                participantSocket.emit(
                    "hand:list",
                    raisedHands[roomId] || []
                );

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur envoi liste mains levées :",
            error.message
        );

    }

};


// =====================================================
// ENVOYER UNE NOTIFICATION UNIQUEMENT A L'HOTE
// =====================================================
const notifyHost = async (
    io,
    roomId,
    data
) => {

    try {

        const hostId =
            await getConferenceHost(roomId);

        if (!hostId) {

            return;

        }

        const room =
            io.sockets.adapter.rooms.get(roomId);

        if (!room) {

            return;

        }

        room.forEach(socketId => {

            const participantSocket =
                io.sockets.sockets.get(socketId);

            if (!participantSocket) {

                return;

            }

            const participantUserId =
                participantSocket.data.user?._id ||
                participantSocket.data.user?.id;

            if (!participantUserId) {

                return;

            }

            // =================================================
            // SEUL L'HOTE RECOIT LA NOTIFICATION
            // =================================================
            if (
                String(participantUserId)
                ===
                String(hostId)
            ) {

                participantSocket.emit(
                    "hand:notification",
                    data
                );

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur notification hôte :",
            error.message
        );

    }

};


// =====================================================
// SOCKET DES MAINS LEVEES
// =====================================================
const handSocket = (
    io,
    socket
) => {


    // =====================================================
    // LEVER LA MAIN
    // =====================================================
    socket.on(
        "hand:raise",
        async ({ roomId, user }) => {

            if (!roomId || !user) {

                console.warn(
                    "⚠️ hand:raise incomplet."
                );

                return;

            }

            // =================================================
            // VERIFIER QUE L'UTILISATEUR EST BIEN DANS LA SALLE
            // =================================================
            if (
                socket.data.roomId
                !==
                roomId
            ) {

                console.warn(
                    "⚠️ Utilisateur hors de la salle."
                );

                return;

            }

            // =================================================
            // INITIALISER LA SALLE
            // =================================================
            if (!raisedHands[roomId]) {

                raisedHands[roomId] = [];

            }

            // =================================================
            // IDENTIFIANT UTILISATEUR
            // =================================================
            const userId =
                user._id ||
                user.id;

            if (!userId) {

                console.warn(
                    "⚠️ Utilisateur sans identifiant."
                );

                return;

            }

            // =================================================
            // VERIFIER SI LA MAIN EST DEJA LEVEE
            // =================================================
            const exists =
                raisedHands[roomId].find(
                    participant =>
                        String(
                            participant._id ||
                            participant.id
                        )
                        ===
                        String(userId)
                );

            if (exists) {

                // Mettre à jour le socket
                exists.socketId = socket.id;

                return;

            }

            // =================================================
            // AJOUTER LA MAIN
            // =================================================
            const participant = {

                socketId: socket.id,

                ...user,

                raisedAt: new Date()

            };

            raisedHands[roomId].push(
                participant
            );

            console.log(
                "✋ Main levée :",
                user.name || user.firstName || userId
            );

            // =================================================
            // ENVOYER LA LISTE UNIQUEMENT A L'HOTE
            // =================================================
            await emitRaisedHandsToHost(
                io,
                roomId
            );

            // =================================================
            // NOTIFICATION UNIQUEMENT A L'HOTE
            // =================================================
            await notifyHost(
                io,
                roomId,
                {
                    name:
                        user.name
                        ||
                        `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        ||
                        "Un participant",

                    raised: true
                }
            );

        }
    );


    // =====================================================
    // BAISSER LA MAIN
    // =====================================================
    socket.on(
        "hand:lower",
        async ({ roomId }) => {

            if (!roomId) {

                return;

            }

            if (!raisedHands[roomId]) {

                return;

            }

            // =================================================
            // TROUVER LA MAIN DE L'UTILISATEUR
            // =================================================
            const participant =
                raisedHands[roomId].find(
                    participant =>
                        participant.socketId
                        ===
                        socket.id
                );

            if (!participant) {

                return;

            }

            // =================================================
            // RECUPERER LE NOM AVANT SUPPRESSION
            // =================================================
            const participantName =
                participant.name
                ||
                `${participant.firstName || ""} ${participant.lastName || ""}`.trim()
                ||
                "Un participant";

            // =================================================
            // SUPPRIMER LA MAIN
            // =================================================
            raisedHands[roomId] =
                raisedHands[roomId].filter(
                    participant =>
                        participant.socketId
                        !==
                        socket.id
                );

            console.log(
                "✋ Main baissée :",
                participantName
            );

            // =================================================
            // METTRE A JOUR LA LISTE CHEZ L'HOTE
            // =================================================
            await emitRaisedHandsToHost(
                io,
                roomId
            );

            // =================================================
            // NOTIFIER L'HOTE
            // =================================================
            await notifyHost(
                io,
                roomId,
                {
                    name:
                        participantName,

                    raised: false
                }
            );

        }
    );


    // =====================================================
    // NETTOYAGE A LA DECONNEXION
    // =====================================================
    socket.on(
        "disconnect",
        async () => {

            const roomId =
                socket.data.roomId;

            const user =
                socket.data.user;

            if (!roomId) {

                return;

            }

            if (!raisedHands[roomId]) {

                return;

            }

            // =================================================
            // IDENTIFIANT UTILISATEUR
            // =================================================
            const userId =
                user?._id ||
                user?.id;

            // =================================================
            // TROUVER LA MAIN
            // =================================================
            const participant =
                raisedHands[roomId].find(
                    participant => {

                        // Priorité à l'identifiant utilisateur

                        if (userId) {

                            const participantId =
                                participant._id ||
                                participant.id;

                            if (
                                participantId
                                &&
                                String(participantId)
                                ===
                                String(userId)
                            ) {

                                return true;

                            }

                        }

                        // Sécurité avec socketId

                        return (
                            participant.socketId
                            ===
                            socket.id
                        );

                    }
                );

            // =================================================
            // SUPPRIMER LA MAIN
            // =================================================
            if (participant) {

                raisedHands[roomId] =
                    raisedHands[roomId].filter(
                        item => {

                            const itemId =
                                item._id ||
                                item.id;

                            if (
                                userId
                                &&
                                itemId
                            ) {

                                return (
                                    String(itemId)
                                    !==
                                    String(userId)
                                );

                            }

                            return (
                                item.socketId
                                !==
                                socket.id
                            );

                        }
                    );

            }

            // =================================================
            // SI LA SALLE N'A PLUS DE MAINS
            // =================================================
            if (
                raisedHands[roomId].length === 0
            ) {

                delete raisedHands[roomId];

            }

            else {

                // =================================================
                // METTRE A JOUR L'HOTE
                // =================================================
                await emitRaisedHandsToHost(
                    io,
                    roomId
                );

            }

        }
    );

};


// =====================================================
// EXPORT
// =====================================================

export default handSocket;