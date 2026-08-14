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

        p =>
    
            p.socketId === participant.socketId ||
    
            p._id === participant._id
    
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

    // =====================================================
    // SUPPRIMER LA SALLE SI ELLE EST VIDE
    // =====================================================
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