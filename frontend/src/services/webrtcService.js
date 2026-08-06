// =====================================================
// CONFIGURATION WEBRTC
// =====================================================

const configuration = {

    iceServers: [

        {

            urls: "stun:stun.l.google.com:19302"

        }

    ]

};

class WebRTCService {

    constructor() {

        // ============================
        // Flux local
        // ============================

        this.localStream = null;

        // ============================
        // Partage d'écran
        // ============================

        this.screenStream = null;

        // =====================================================
        // CALLBACK ICE
        // =====================================================

        this.onIceCandidate = null;

        // =====================================================
        // CALLBACK REMOTE STREAM
        // =====================================================

        this.onRemoteStream = null;

        // ============================
        // Plusieurs PeerConnections
        // clé = socketId
        // ============================

        this.peerConnections = new Map();

        // ============================
        // Flux distants
        // clé = socketId
        // ============================

        this.remoteStreams = new Map();

        // ============================
        // Etats
        // ============================

        this.cameraEnabled = true;

        this.microphoneEnabled = true;

        this.isScreenSharing = false;

    }

// =====================================================
// SAVOIR SI UNE CONNEXION EXISTE
// =====================================================
hasPeerConnection(socketId) {
    return this.peerConnections.has(socketId);
}

    // =====================================================
    // DEFINIR LE CALLBACK DU FLUX DISTANT
    // =====================================================
    setRemoteStreamCallback(callback) {
      this.onRemoteStream = callback;
    }

      // =====================================================
      // DEFINIR LE CALLBACK ICE
      // =====================================================
      setIceCandidateCallback(callback) {
        this.onIceCandidate = callback;
      }

      // =====================================================
      // OUVRIR CAMERA + MICRO
      // =====================================================
    async startLocalStream(options = {}) {

    try {

        // Si le flux existe déjà, on le réutilise
        if (this.localStream) {

            return this.localStream;

        }

        const constraints = {

            video:

                options.video !== undefined

                    ? options.video

                    : true,

            audio:

                options.audio !== undefined

                    ? options.audio

                    : true

        };

        this.localStream = await navigator.mediaDevices.getUserMedia(

            constraints

        );

        this.cameraEnabled = constraints.video;

        this.microphoneEnabled = constraints.audio;

        return this.localStream;

    }

    catch (error) {

        console.error(

            "Erreur accès caméra/micro :",

            error

        );

        throw error;

    }

}

    // =====================================================
    // CREER UNE PEER CONNECTION
    // =====================================================
    createPeerConnection(socketId) {

    // Si elle existe déjà
    if (this.peerConnections.has(socketId)) {

        return this.peerConnections.get(socketId);

    }

    const peerConnection = new RTCPeerConnection(

        configuration

    );

    // Sauvegarde

    this.peerConnections.set(

        socketId,

        peerConnection

    );

    // Ajouter les pistes locales

    if (this.localStream) {

        this.localStream

            .getTracks()

            .forEach(track => {

                peerConnection.addTrack(

                    track,

                    this.localStream

                );

            });

    }

   // =====================================================
   // ENVOI ICE CANDIDATE
   // =====================================================

   peerConnection.onicecandidate = (event) => {

    if (event.candidate && this.onIceCandidate) {

        this.onIceCandidate(

            socketId,

            event.candidate

        );

    }

   };

    // =====================================================
    // RECEPTION DU FLUX DISTANT
    // =====================================================
    peerConnection.ontrack = (event) => {
        const stream = event.streams[0];
  
        this.remoteStreams.set(
  
          socketId,
  
          stream
  
        );
  
        if (this.onRemoteStream) {
          this.onRemoteStream(
  
              socketId,
              stream
  
          );
        }
      };

    return peerConnection;

}

// =====================================================
// CREER UNE OFFER
// =====================================================
async createOffer(socketId) {

    const peerConnection = this.createPeerConnection(

        socketId

    );

    const offer = await peerConnection.createOffer({

        offerToReceiveAudio: true,

        offerToReceiveVideo: true

    });

    await peerConnection.setLocalDescription(

        offer

    );

    return offer;

}

// =====================================================
// TRAITER UNE OFFER
// =====================================================
async handleOffer(socketId, offer) {

    // Récupérer ou créer la connexion
    const peerConnection = this.createPeerConnection(

        socketId

    );

    // Enregistrer l'offre distante
    await peerConnection.setRemoteDescription(

        new RTCSessionDescription(offer)

    );

    // Créer une réponse
    const answer = await peerConnection.createAnswer();

    // Sauvegarder la réponse
    await peerConnection.setLocalDescription(

        answer

    );

    return answer;

}

// =====================================================
// TRAITER UNE ANSWER
// =====================================================
async handleAnswer(socketId, answer) {

    const peerConnection = this.peerConnections.get(socketId);

    if (!peerConnection) {
    
        console.warn(
    
            "PeerConnection introuvable :", socketId
    
        );
    
        return;
    
    }
    
    if (

        peerConnection.remoteDescription
    
    ) {
    
        console.log(
    
            "RemoteDescription déjà définie"
    
        );
    
        return;
    
    }
    
    await peerConnection.setRemoteDescription(
    
        new RTCSessionDescription(answer)
    
    );

}

// =====================================================
// AJOUTER UN ICE CANDIDATE
// =====================================================
async addIceCandidate(socketId, candidate) {

    const peerConnection = this.peerConnections.get(

        socketId

    );

    if (!peerConnection) {

        console.warn(

            "PeerConnection introuvable :", socketId

        );

        return;

    }

    try {

        await peerConnection.addIceCandidate(

            new RTCIceCandidate(candidate)

        );

    }

    catch (error) {

        console.error(

            "Erreur ICE Candidate :",

            error

        );

    }

}

    // =====================================================
    // RECUPERER LE STREAM
    // =====================================================
    getStream() {

        return this.localStream;

    }

}

export default new WebRTCService();