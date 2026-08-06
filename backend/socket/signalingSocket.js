// =====================================================
// SIGNALING WEBRTC
// =====================================================

const signalingSocket = (io, socket) => {

    // =====================================================
    // OFFER
    // =====================================================
    socket.on(

        "webrtc:offer",

        ({ roomId, offer, sender }) => {

            socket.to(roomId).emit(

                "webrtc:offer",

                {

                    offer,

                    sender

                }

            );

        }

    );

    // =====================================================
    // ANSWER
    // =====================================================
    socket.on(

        "webrtc:answer",

        ({ roomId, answer, sender }) => {

            socket.to(roomId).emit(

                "webrtc:answer",

                {

                    answer,

                    sender

                }

            );

        }

    );

    // =====================================================
    // ICE CANDIDATE
    // =====================================================
    socket.on(

        "webrtc:iceCandidate",

        ({ roomId, candidate, sender }) => {

            socket.to(roomId).emit(

                "webrtc:iceCandidate",

                {

                    candidate,

                    sender

                }

            );

        }

    );

};

export default signalingSocket;