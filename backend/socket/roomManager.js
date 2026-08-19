// =====================================================
// GESTION DES PARTICIPANTS DES SALLES
// =====================================================

const rooms = new Map();


// =====================================================
// AJOUTER UN PARTICIPANT
// =====================================================

export const addParticipant = (
    roomId,
    participant
) => {

    if (!roomId || !participant?.socketId) {
        return;
    }

    if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
    }

    const participants =
        rooms.get(roomId);

    const exists =
        participants.some(
            item =>
                item.socketId === participant.socketId
        );

    if (exists) {
        return;
    }

    const fullName =
        `${participant.firstName || ""} ${
            participant.lastName || ""
        }`.trim();

    const normalizedParticipant = {
        ...participant,
        name:
            participant.name ||
            fullName ||
            "Participant",
        role:
            participant.role ||
            "student"
    };

    participants.push(
        normalizedParticipant
    );

    console.log(
        `✅ Participant ajouté : ${
            normalizedParticipant.name
        } (${participant.socketId})`
    );

};


// =====================================================
// RETIRER UN PARTICIPANT
// =====================================================

export const removeParticipant = (
    roomId,
    socketId
) => {

    if (!roomId || !socketId) {
        return;
    }

    const participants =
        rooms.get(roomId);

    if (!participants) {
        return;
    }

    const remaining =
        participants.filter(
            participant =>
                participant.socketId !== socketId
        );

    if (remaining.length === 0) {

        rooms.delete(roomId);

        console.log(
            `🗑️ Salle supprimée : ${roomId}`
        );

        return;
    }

    rooms.set(
        roomId,
        remaining
    );

};


// =====================================================
// RECUPERER LES PARTICIPANTS
// =====================================================

export const getParticipants = (
    roomId
) => {

    return rooms.get(roomId) || [];

};


// =====================================================
// NOMBRE DE PARTICIPANTS
// =====================================================

export const getParticipantCount = (
    roomId
) => {

    return getParticipants(roomId).length;

};


// =====================================================
// SALLE EXISTE
// =====================================================

export const roomExists = (
    roomId
) => {

    return rooms.has(roomId);

};


// =====================================================
// SUPPRIMER UNE SALLE
// =====================================================

export const removeRoom = (
    roomId
) => {

    rooms.delete(roomId);

};