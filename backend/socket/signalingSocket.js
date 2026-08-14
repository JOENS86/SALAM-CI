// =====================================================
// SIGNALING WEBRTC
// =====================================================

const signalingSocket = (io, socket) => {

    // =====================================================
    // OFFER
    // =====================================================
    socket.on(

        "webrtc:offer",
    
        ({target, offer, sender}) => {
    
            io.to(target).emit(
    
                "webrtc:offer",
    
                {sender, offer}
    
            );
    
        }
    
    );

    // =====================================================
    // ANSWER
    // =====================================================
    socket.on(

        "webrtc:answer",
    
        ({target, answer, sender}) => {
    
            io.to(target).emit(
    
                "webrtc:answer",
    
                {sender, answer}
    
            );
    
        }
    
    );

    // =====================================================
    // ICE CANDIDATE
    // =====================================================
    socket.on(

        "webrtc:iceCandidate",
    
        ({target, candidate, sender}) => {
    
            io.to(target).emit(
    
                "webrtc:iceCandidate",
    
                {sender, candidate}
    
            );
    
        }
    
    );

};

export default signalingSocket;