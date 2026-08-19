import Conference from "../models/Conference.js";

// =====================================================
// CONTROLE DES PARTICIPANTS PAR L'HOTE
// =====================================================

const controlSocket = (io, socket) => {

    // =====================================================
    // VERIFIER QUE L'UTILISATEUR EST L'HOTE
    // =====================================================
    const isConferenceHost = async (roomId) => {

        try {

            const conference =
                await Conference.findById(roomId);

            if (!conference) {

                console.warn(
                    "⚠️ Conférence introuvable :",
                    roomId
                );

                return false;

            }

            const user =
                socket.data.user || {};

            const userId =
                user._id ||
                user.id;

            if (!userId) {

                console.warn(
                    "⚠️ Utilisateur non identifié."
                );

                return false;

            }

            // =================================================
            // ADMIN
            // =================================================

            if (
                user.role === "admin"
            ) {

                const adminIds = [

                    conference.createdBy,
                    conference.startedBy

                ]
                .filter(Boolean)
                .map(
                    value =>
                        String(
                            value?._id ||
                            value
                        )
                );

                if (
                    adminIds.includes(
                        String(userId)
                    )
                ) {

                    return true;

                }

            }

            // =================================================
            // ENSEIGNANT
            // =================================================

            if (
                user.role === "teacher"
            ) {

                const teacherIds = [

                    conference.teacher,
                    conference.createdBy,
                    conference.startedBy

                ]
                .filter(Boolean)
                .map(
                    value =>
                        String(
                            value?._id ||
                            value
                        )
                );

                if (
                    teacherIds.includes(
                        String(userId)
                    )
                ) {

                    return true;

                }

            }

            return false;

        }

        catch (error) {

            console.error(
                "❌ Erreur vérification hôte :",
                error
            );

            return false;

        }

    };


    // =====================================================
    // COUPER / ACTIVER LE MICRO D'UN PARTICIPANT
    // =====================================================

    socket.on(
        "participant:microphone",
        async ({
            roomId,
            targetSocketId,
            enabled
        }) => {

            // ---------------------------------------------
            // Vérifier que l'expéditeur est l'hôte
            // ---------------------------------------------

            const isHost =
                await isConferenceHost(roomId);

            if (!isHost) {

                console.warn(
                    "⚠️ Tentative de contrôle micro par un non-hôte."
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier que l'hôte est dans la salle
            // ---------------------------------------------

            if (
                socket.data.roomId !== roomId
            ) {

                console.warn(
                    "⚠️ L'hôte n'est pas dans cette salle."
                );

                return;

            }

            // ---------------------------------------------
            // Récupérer le participant cible
            // ---------------------------------------------

            const targetSocket =
                io.sockets.sockets.get(
                    targetSocketId
                );

            if (!targetSocket) {

                console.warn(
                    "⚠️ Participant introuvable :",
                    targetSocketId
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier que le participant est dans la salle
            // ---------------------------------------------

            if (
                !targetSocket.rooms.has(roomId)
            ) {

                console.warn(
                    "⚠️ Participant absent de la salle."
                );

                return;

            }

            // ---------------------------------------------
            // Envoyer la commande
            // ---------------------------------------------
            targetSocket.emit(
                "participant:microphone",
                {
                    enabled
                }
            );

            io.to(roomId).emit(
                "participant:mediaState",
                {
                    socketId: targetSocketId,
                    microphone: Boolean(enabled)
                }
            );

            console.log(
                `🎤 Micro ${
                    enabled
                        ? "activé"
                        : "coupé"
                } pour`,
                targetSocketId
            );

        }
    );


    // =====================================================
    // COUPER / ACTIVER LA CAMERA D'UN PARTICIPANT
    // =====================================================

    socket.on(
        "participant:camera",
        async ({
            roomId,
            targetSocketId,
            enabled
        }) => {

            // ---------------------------------------------
            // Vérifier que l'expéditeur est l'hôte
            // ---------------------------------------------

            const isHost =
                await isConferenceHost(roomId);

            if (!isHost) {

                console.warn(
                    "⚠️ Tentative de contrôle caméra par un non-hôte."
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier que l'hôte est dans la salle
            // ---------------------------------------------

            if (
                socket.data.roomId !== roomId
            ) {

                console.warn(
                    "⚠️ L'hôte n'est pas dans cette salle."
                );

                return;

            }

            // ---------------------------------------------
            // Participant cible
            // ---------------------------------------------

            const targetSocket =
                io.sockets.sockets.get(
                    targetSocketId
                );

            if (!targetSocket) {

                console.warn(
                    "⚠️ Participant introuvable :",
                    targetSocketId
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier présence dans la salle
            // ---------------------------------------------

            if (
                !targetSocket.rooms.has(roomId)
            ) {

                console.warn(
                    "⚠️ Participant absent de la salle."
                );

                return;

            }

            // ---------------------------------------------
            // Envoyer la commande
            // ---------------------------------------------
            targetSocket.emit(
                "participant:camera",
                {
                    enabled
                }
            );

            io.to(roomId).emit(
                "participant:mediaState",
                {
                    socketId: targetSocketId,
                    camera: Boolean(enabled)
                }
            );

            console.log(
                `📹 Caméra ${
                    enabled
                        ? "activée"
                        : "coupée"
                } pour`,
                targetSocketId
            );

        }
    );


    // =====================================================
    // CONTROLE GLOBAL MICRO
    // =====================================================

    socket.on(
        "teacher:microphone:all",
        async ({
            roomId,
            enabled
        }) => {

            // ---------------------------------------------
            // Vérifier l'hôte
            // ---------------------------------------------

            const isHost =
                await isConferenceHost(roomId);

            if (!isHost) {

                console.warn(
                    "⚠️ Tentative de contrôle global micro par un non-hôte."
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier la salle
            // ---------------------------------------------

            if (
                socket.data.roomId !== roomId
            ) {

                return;

            }

            // ---------------------------------------------
            // Tous les sockets de la salle
            // ---------------------------------------------

            const room =
                io.sockets.adapter.rooms.get(
                    roomId
                );

            if (!room) return;

            for (const socketId of room) {

                // Ne pas contrôler l'hôte
                if (
                    socketId === socket.id
                ) {

                    continue;

                }

                const targetSocket =
                    io.sockets.sockets.get(
                        socketId
                    );

                if (!targetSocket) continue;

                // Ne contrôler que les étudiants
                if (
                    targetSocket.data.user?.role
                    !==
                    "student"
                ) {

                    continue;

                }

                targetSocket.emit(
                    "teacher:microphone:all",
                    {
                        enabled
                    }
                );

            }

            console.log(
                `🎤 Microphones étudiants ${
                    enabled
                        ? "activés"
                        : "coupés"
                } par l'hôte`
            );

        }
    );


    // =====================================================
    // CONTROLE GLOBAL CAMERA
    // =====================================================

    socket.on(
        "teacher:camera:all",
        async ({
            roomId,
            enabled
        }) => {

            // ---------------------------------------------
            // Vérifier l'hôte
            // ---------------------------------------------

            const isHost =
                await isConferenceHost(roomId);

            if (!isHost) {

                console.warn(
                    "⚠️ Tentative de contrôle global caméra par un non-hôte."
                );

                return;

            }

            // ---------------------------------------------
            // Vérifier la salle
            // ---------------------------------------------

            if (
                socket.data.roomId !== roomId
            ) {

                return;

            }

            // ---------------------------------------------
            // Tous les sockets de la salle
            // ---------------------------------------------

            const room =
                io.sockets.adapter.rooms.get(
                    roomId
                );

            if (!room) return;

            for (const socketId of room) {

                // Ne pas contrôler l'hôte
                if (
                    socketId === socket.id
                ) {

                    continue;

                }

                const targetSocket =
                    io.sockets.sockets.get(
                        socketId
                    );

                if (!targetSocket) continue;

                // Ne contrôler que les étudiants
                if (
                    targetSocket.data.user?.role
                    !==
                    "student"
                ) {

                    continue;

                }

                targetSocket.emit(
                    "teacher:camera:all",
                    {
                        enabled
                    }
                );

            }

            console.log(
                `📹 Caméras étudiantes ${
                    enabled
                        ? "activées"
                        : "coupées"
                } par l'hôte`
            );

        }
    );

// =====================================================
// AUTORISER / INTERDIRE LE PARTAGE D'ECRAN
// =====================================================
socket.on(
    "participant:screenShare",
    async ({
        roomId,
        targetSocketId,
        enabled
    } = {}) => {

        console.log(
            "🖥️ Demande autorisation partage écran :",
            {
                roomId,
                targetSocketId,
                enabled
            }
        );

        // =================================================
        // VERIFIER L'HOTE
        // =================================================

        const isHost =
            await isConferenceHost(roomId);

        if (!isHost) {

            console.warn(
                "⚠️ Tentative d'autorisation partage écran par un non-hôte."
            );

            return;
        }

        // =================================================
        // VERIFIER QUE L'HOTE EST DANS LA SALLE
        // =================================================

        if (
            socket.data.roomId !== roomId
        ) {

            console.warn(
                "⚠️ L'hôte n'est pas dans cette salle."
            );

            return;
        }

        // =================================================
        // RECUPERER LE PARTICIPANT
        // =================================================

        const targetSocket =
            io.sockets.sockets.get(
                targetSocketId
            );

        if (!targetSocket) {

            console.warn(
                "⚠️ Participant introuvable :",
                targetSocketId
            );

            return;
        }

        // =================================================
        // VERIFIER SA PRESENCE
        // =================================================

        if (
            !targetSocket.rooms.has(roomId)
        ) {

            console.warn(
                "⚠️ Participant absent de la salle."
            );

            return;
        }

        // =================================================
        // UNIQUEMENT LES ETUDIANTS
        // =================================================

        if (
            targetSocket.data.user?.role !== "student"
        ) {

            console.warn(
                "⚠️ Le contrôle du partage concerne uniquement les étudiants."
            );

            return;
        }

        // =================================================
        // ENVOYER UNIQUEMENT L'AUTORISATION
        // =================================================

        targetSocket.emit(
            "participant:screenShare",
            {
                enabled: Boolean(enabled)
            }
        );

        console.log(
            `🖥️ Partage écran ${
                enabled
                    ? "autorisé"
                    : "interdit"
            } pour ${targetSocketId}`
        );

    }
);

};

export default controlSocket;
