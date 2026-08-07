// =====================================================
// GESTION GLOBALE DE SOCKET.IO
// =====================================================

let io = null;

// =====================================================
// ENREGISTRER L'INSTANCE SOCKET.IO
// =====================================================

export const setIO = (socketInstance) => {

    io = socketInstance;

};

// =====================================================
// RECUPERER L'INSTANCE SOCKET.IO
// =====================================================

export const getIO = () => {

    return io;

};