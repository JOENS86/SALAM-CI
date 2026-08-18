// =====================================================
// GESTION DES PARTICIPANTS DES SALLES
// =====================================================

const rooms = new Map();

// =====================================================
// AJOUTER UN PARTICIPANT
// =====================================================
export const addParticipant = (roomId, participant) => {

    if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
    }

    const participants = rooms.get(roomId);

    // IMPORTANT :
    // Un participant est identifié par son socketId.
    // On ne compare PAS _id ici car deux connexions
    // différentes peuvent avoir des objets user différents.
    const exists = participants.some(
        p => p.socketId === participant.socketId
    );

    if (exists) {
        return;
    }

    // Normaliser le nom
    const name =
        participant.name ||
        `${participant.firstName || ""} ${participant.lastName || ""}`.trim() ||
        "Participant";

    participants.push({
        ...participant,
        name
    });

    console.log(
        `✅ Participant ajouté : ${name} (${participant.socketId})`
    );

};

// =====================================================
// RETIRER UN PARTICIPANT
// =====================================================
export const removeParticipant = (
    roomId,
    socketId
) => {

    if (!rooms.has(roomId)) return;

    const participants = rooms
        .get(roomId)
        .filter(
            participant =>
                participant.socketId !== socketId
        );

    if (participants.length === 0) {

        rooms.delete(roomId);

        return;
    }

    rooms.set(roomId, participants);

};

// =====================================================
// RECUPERER LES PARTICIPANTS
// =====================================================
export const getParticipants = (roomId) => {

    return rooms.get(roomId) || [];

};

// =====================================================
// NOMBRE DE PARTICIPANTS
// =====================================================
export const getParticipantCount = (roomId) => {

    return getParticipants(roomId).length;

};

// =====================================================
// SAVOIR SI UNE SALLE EXISTE
// =====================================================
export const roomExists = (roomId) => {

    return rooms.has(roomId);

};

// =====================================================
// SUPPRIMER UNE SALLE
// =====================================================
export const removeRoom = (roomId) => {

    rooms.delete(roomId);

};