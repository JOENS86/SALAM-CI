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

    const exists = participants.find(

        p => p.socketId === participant.socketId

    );

    if (!exists) {

        participants.push(participant);

    }

};

// =====================================================
// RETIRER UN PARTICIPANT
// =====================================================
export const removeParticipant = (

    roomId,

    socketId

) => {

    if (!rooms.has(roomId)) return;

    const participants = rooms.get(roomId).filter(

        participant => participant.socketId !== socketId

    );

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