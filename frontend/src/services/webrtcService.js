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
        // ICE Candidates en attente
        // clé = socketId
        // ============================
        this.pendingCandidates = new Map();

        // ============================
        // Etats des connexions
        // ============================
        this.connectionStates = new Map();

        // ============================
        // Flux distants
        // clé = socketId
        // ============================

        this.remoteStreams = new Map();

        // ============================
        // Etats
        // ============================

        this.cameraEnabled = false;
        this.microphoneEnabled = false;

        this.audioTrack = null;
        this.videoTrack = null;

        this.localStreamPromise = null;

        this.isScreenSharing = false;

        this.onScreenShareEnded = null;
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

    console.log("========== startLocalStream ==========");
    console.log(
        "localStream actuel :",
        this.localStream
    );


    // =====================================================
    // 1. UN FLUX EXISTE DÉJÀ
    // =====================================================

    if (
        this.localStream instanceof MediaStream
    ) {

        console.log(
            "✅ Flux local déjà disponible"
        );


        // -------------------------------------------------
        // Resynchroniser les pistes
        // -------------------------------------------------

        this.audioTrack =
            this.localStream
                .getAudioTracks()[0] || null;

        this.videoTrack =
            this.localStream
                .getVideoTracks()[0] || null;

        // =====================================================
        // ETAT INITIAL : CAMERA ET MICRO DESACTIVES
        // =====================================================
        if (this.audioTrack) {
          this.audioTrack.enabled = false;
        }

        if (this.videoTrack) {
          this.videoTrack.enabled = false;
        }

        this.microphoneEnabled = false;
        this.cameraEnabled = false;

        // -------------------------------------------------
        // Resynchroniser les états
        // -------------------------------------------------

        this.microphoneEnabled =
            this.audioTrack
                ? this.audioTrack.enabled
                : false;

        this.cameraEnabled =
            this.videoTrack
                ? this.videoTrack.enabled
                : false;


        console.log(
            "🎤 audioTrack existante :",
            this.audioTrack
        );

        console.log(
            "📹 videoTrack existante :",
            this.videoTrack
        );


        return this.localStream;
    }


    // =====================================================
    // 2. UNE DEMANDE EST DÉJÀ EN COURS
    // =====================================================

    if (this.localStreamPromise) {

        console.log(
            "⏳ getUserMedia déjà en cours..."
        );

        return this.localStreamPromise;
    }


    // =====================================================
    // 3. CONTRAINTES
    // =====================================================

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


    console.log(
        "🎥 Demande getUserMedia :",
        constraints
    );


    // =====================================================
    // 4. UNE SEULE DEMANDE AU NAVIGATEUR
    // =====================================================

    this.localStreamPromise =
        navigator.mediaDevices
            .getUserMedia(constraints)

            .then((stream) => {

                console.log(
                    "✅ Flux local obtenu :",
                    stream
                );


                // =========================================
                // CONSERVER LE FLUX
                // =========================================

                this.localStream = stream;


                // =========================================
                // CONSERVER LES PISTES
                // =========================================

                this.audioTrack =
                    stream
                        .getAudioTracks()[0] || null;

                this.videoTrack =
                    stream
                        .getVideoTracks()[0] || null;

                // =====================================================
                // ETAT INITIAL : CAMERA ET MICRO DESACTIVES
                // =====================================================
                if (this.audioTrack) {
                  this.audioTrack.enabled = false;
                }

                if (this.videoTrack) {
                  this.videoTrack.enabled = false;
                }

                // =========================================
                // ÉTATS RÉELS
                // =========================================

                this.microphoneEnabled =
                    this.audioTrack
                        ? this.audioTrack.enabled
                        : false;

                this.cameraEnabled =
                    this.videoTrack
                        ? this.videoTrack.enabled
                        : false;


                console.log(
                    "🎤 audioTrack :",
                    this.audioTrack
                );

                console.log(
                    "📹 videoTrack :",
                    this.videoTrack
                );

                console.log(
                    "🎤 Micro actif :",
                    this.microphoneEnabled
                );

                console.log(
                    "📹 Caméra active :",
                    this.cameraEnabled
                );


                return stream;

            })

            .catch((error) => {

                console.error(
                    "❌ Erreur getUserMedia :",
                    error
                );

                throw error;

            })

            .finally(() => {

                // -----------------------------------------
                // La promesse est terminée.
                // Le flux reste conservé dans localStream.
                // -----------------------------------------

                this.localStreamPromise = null;
            });


    return this.localStreamPromise;
}

    // =====================================================
    // CREER UNE PEER CONNECTION
    // =====================================================
    createPeerConnection(socketId) {

    // Si elle existe déj�
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

    // =====================================================
    // ETAT DE LA CONNEXION
    // =====================================================
    peerConnection.onconnectionstatechange = () => {

      console.log(
        "ConnectionState :",
        socketId,
        peerConnection.connectionState
      );

      this.connectionStates.set(
        socketId,
        peerConnection.connectionState
      );

    // Si la connexion est terminée
      if (
        peerConnection.connectionState === "failed" ||
        peerConnection.connectionState === "closed" ||
        peerConnection.connectionState === "disconnected"
      ) {

        this.closePeerConnection(socketId);

      }

    };

    // =====================================================
    // ETAT ICE
    // =====================================================
    peerConnection.oniceconnectionstatechange = () => {

      console.log(
        "ICE State :",
        socketId,
        peerConnection.iceConnectionState
      );

      if (

        peerConnection.iceConnectionState === "failed"

      ) {

        this.closePeerConnection(socketId);

      }

   };

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
// APPLIQUER LES ICE CANDIDATES EN ATTENTE
// =====================================================
async flushPendingCandidates(socketId) {

    const peerConnection =
        this.peerConnections.get(socketId);

    if (!peerConnection) return;

    if (!peerConnection.remoteDescription) return;

    const pending =
        this.pendingCandidates.get(socketId);

    if (!pending || pending.length === 0) return;

    console.log(
        "🧊 Application des ICE en attente :",
        socketId,
        pending.length
    );

    for (const candidate of pending) {

        try {

            await peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            );

        } catch (error) {

            console.error(
                "❌ Erreur ICE en attente :",
                error
            );

        }

    }

    this.pendingCandidates.delete(socketId);

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

    // =====================================================
    // APPLIQUER LES ICE ARRIVÉS AVANT L'OFFER
    // =====================================================

    await this.flushPendingCandidates(socketId);

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

        peerConnection.signalingState === "stable"

    ) {

        return;

    }

    await peerConnection.setRemoteDescription(

        new RTCSessionDescription(answer)

    );

    await this.flushPendingCandidates(socketId);

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

// Attendre que la RemoteDescription existe
if (!peerConnection.remoteDescription) {

    console.log(
        "ICE en attente..."
    );

    if (!this.pendingCandidates.has(socketId)) {

        this.pendingCandidates.set(socketId, []);

    }

    this.pendingCandidates
        .get(socketId)
        .push(candidate);

    return;

}

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
// FERMER UNE PEER CONNECTION
// =====================================================
closePeerConnection(socketId) {

    const peerConnection = this.peerConnections.get(socketId);

    if (!peerConnection) return;

    try {

        peerConnection.ontrack = null;
        peerConnection.onicecandidate = null;

        peerConnection.close();

    }

    catch (error) {

        console.error(error);

    }

    this.peerConnections.delete(socketId);

    this.remoteStreams.delete(socketId);

    this.pendingCandidates.delete(socketId);

    this.connectionStates.delete(socketId);

}

// =====================================================
// FERMER TOUTES LES CONNEXIONS
// =====================================================
closeAllConnections() {

    for (const socketId of this.peerConnections.keys()) {

        this.closePeerConnection(socketId);

    }

}

// =====================================================
// ARRETER CAMERA / MICRO
// =====================================================
stopLocalStream() {

    console.log(
        "🚨 STOP LOCAL STREAM APPELÉ"
    );

    console.trace();

    if (!this.localStream) {

        return;

    }

    this.localStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });

        this.localStream = null;

        this.audioTrack = null;

        this.videoTrack = null;

        this.localStreamPromise = null;

        this.cameraEnabled = false;

        this.microphoneEnabled = false;

}

// =====================================================
// REINITIALISER WEBRTC
// =====================================================
destroy(){

    console.log("🚨 DESTROY APPELÉ");

    console.trace();

    this.stopScreenShare();

    this.stopLocalStream();

    this.closeAllConnections();

    this.onRemoteStream = null;
    this.onIceCandidate = null;

}

// =====================================================
// ACTIVER / DESACTIVER LE MICRO
// =====================================================
toggleMicrophone() {

    console.log("========== MICRO ==========");

    const newState =
        !this.microphoneEnabled;

    return this.setMicrophoneEnabled(
        newState
    );
}

// =====================================================
// RÉCUPÉRER UNE PISTE LOCALE WEBRTC
// =====================================================
getLocalTrack(kind) {

    console.log(
        "========== RECHERCHE PISTE",
        kind.toUpperCase(),
        "=========="
    );

    // =================================================
    // 1. PISTE DÉJÀ MÉMORISÉE
    // =================================================

    if (kind === "audio" && this.audioTrack) {

        console.log(
            "🎤 Piste audio mémorisée trouvée :",
            this.audioTrack
        );

        return this.audioTrack;
    }

    if (kind === "video" && this.videoTrack) {

        console.log(
            "📹 Piste vidéo mémorisée trouvée :",
            this.videoTrack
        );

        return this.videoTrack;
    }


    // =================================================
    // 2. RECHERCHE DANS localStream
    // =================================================

    if (this.localStream instanceof MediaStream) {

        console.log(
            "📡 localStream disponible :",
            this.localStream
        );

        let tracks = [];

        if (kind === "audio") {

            tracks =
                this.localStream.getAudioTracks();

        } else if (kind === "video") {

            tracks =
                this.localStream.getVideoTracks();

        }


        if (tracks.length > 0) {

            const track = tracks[0];

            console.log(
                `✅ Piste ${kind} trouvée dans localStream :`,
                track
            );


            // -----------------------------------------
            // Mémoriser définitivement la piste
            // -----------------------------------------

            if (kind === "audio") {

                this.audioTrack = track;

            } else {

                this.videoTrack = track;

            }

            return track;
        }
    }


    // =================================================
    // 3. RECHERCHE DANS LES PEER CONNECTIONS
    // =================================================

    if (
        this.peerConnections &&
        this.peerConnections.size > 0
    ) {

        console.log(
            "🔎 Recherche dans les PeerConnections..."
        );


        for (
            const peerConnection
            of this.peerConnections.values()
        ) {

            if (!peerConnection) continue;


            const senders =
                peerConnection.getSenders();


            for (const sender of senders) {

                const track =
                    sender?.track;


                if (
                    track &&
                    track.kind === kind
                ) {

                    console.log(
                        `✅ Piste ${kind} retrouvée dans PeerConnection :`,
                        track
                    );


                    // ---------------------------------
                    // Remémoriser la piste
                    // ---------------------------------

                    if (kind === "audio") {

                        this.audioTrack = track;

                    } else {

                        this.videoTrack = track;

                    }


                    // ---------------------------------
                    // Reconstituer localStream si besoin
                    // ---------------------------------

                    if (
                        !(this.localStream instanceof MediaStream)
                    ) {

                        try {

                            this.localStream =
                                new MediaStream();

                        } catch (error) {

                            console.warn(
                                "⚠️ Impossible de recréer localStream :",
                                error
                            );

                        }

                    }


                    if (
                        this.localStream instanceof MediaStream &&
                        !this.localStream
                            .getTracks()
                            .some(
                                existingTrack =>
                                    existingTrack.id === track.id
                            )
                    ) {

                        this.localStream.addTrack(track);

                    }


                    return track;
                }
            }
        }
    }


    // =================================================
    // 4. VÉRIFICATION DES PISTES MÉMORISÉES
    // =================================================

    const memorizedTrack =
        kind === "audio"
            ? this.audioTrack
            : this.videoTrack;


    if (memorizedTrack) {

        console.log(
            `✅ Piste ${kind} récupérée depuis la mémoire :`,
            memorizedTrack
        );

        return memorizedTrack;
    }


    // =================================================
    // 5. AUCUNE PISTE
    // =================================================

    console.warn(
        `⚠️ Aucune piste ${kind} disponible`
    );

    console.warn(
        "localStream :",
        this.localStream
    );

    console.warn(
        "audioTrack :",
        this.audioTrack
    );

    console.warn(
        "videoTrack :",
        this.videoTrack
    );


    return null;
}

// =====================================================
// FORCER L'ETAT DU MICRO
// =====================================================
setMicrophoneEnabled(enabled) {

    console.log(
        "========== CONTROLE MICRO DISTANT =========="
    );

    console.log(
        "Etat demandé :",
        enabled ? "ACTIVER" : "COUPER"
    );

    // ------------------------------------------
    // Chercher d'abord la piste déjà mémorisée
    // ------------------------------------------
    let audioTrack = this.audioTrack;

    // ------------------------------------------
    // Si elle n'existe pas, chercher dans
    // le localStream existant
    // ------------------------------------------
    if (!audioTrack && this.localStream) {

        audioTrack =
            this.localStream.getAudioTracks()[0] || null;

    }

    // ------------------------------------------
    // Aucun getUserMedia ici !
    // ------------------------------------------
    if (!audioTrack) {

        console.warn(
            "⚠️ Impossible de contrôler le micro : aucune piste audio disponible"
        );

        return this.microphoneEnabled;

    }

    // ------------------------------------------
    // Modifier directement la piste existante
    // ------------------------------------------
    audioTrack.enabled =
        Boolean(enabled);

    // ------------------------------------------
    // Conserver la référence
    // ------------------------------------------
    this.audioTrack =
        audioTrack;

    // ------------------------------------------
    // Mettre à jour l'état
    // ------------------------------------------
    this.microphoneEnabled =
        Boolean(audioTrack.enabled);

    console.log(
        "🎤 Etat réel du micro :",
        this.microphoneEnabled
            ? "ACTIVÉ"
            : "COUPÉ"
    );

    return this.microphoneEnabled;
}

// =====================================================
// ACTIVER / DESACTIVER LA CAMERA
// =====================================================
toggleCamera() {

    console.log("========== CAMERA ==========");

    const newState =
        !this.cameraEnabled;

    return this.setCameraEnabled(
        newState
    );
}

// =====================================================
// FORCER L'ETAT DE LA CAMERA
// =====================================================
setCameraEnabled(enabled) {

    console.log(
        "========== CONTROLE CAMERA DISTANT =========="
    );

    console.log(
        "Etat demandé :",
        enabled ? "ACTIVER" : "COUPER"
    );

    // ------------------------------------------
    // Chercher d'abord la piste déjà mémorisée
    // ------------------------------------------
    let videoTrack = this.videoTrack;

    // ------------------------------------------
    // Sinon chercher dans le localStream existant
    // ------------------------------------------
    if (!videoTrack && this.localStream) {

        videoTrack =
            this.localStream.getVideoTracks()[0] || null;

    }

    // ------------------------------------------
    // Aucun getUserMedia ici !
    // ------------------------------------------
    if (!videoTrack) {

        console.warn(
            "⚠️ Impossible de contrôler la caméra : aucune piste vidéo disponible"
        );

        return this.cameraEnabled;

    }

    // ------------------------------------------
    // Modifier directement la piste existante
    // ------------------------------------------
    videoTrack.enabled =
        Boolean(enabled);

    // ------------------------------------------
    // Conserver la référence
    // ------------------------------------------
    this.videoTrack =
        videoTrack;

    // ------------------------------------------
    // Mettre à jour l'état
    // ------------------------------------------
    this.cameraEnabled =
        Boolean(videoTrack.enabled);

    console.log(
        "📹 Etat réel de la caméra :",
        this.cameraEnabled
            ? "ACTIVÉE"
            : "COUPÉE"
    );

    return this.cameraEnabled;
}

// =====================================================
// DEMARRER LE PARTAGE D'ECRAN
// =====================================================
async startScreenShare() {

    console.log("========== PARTAGE ECRAN ==========");

    if (this.screenStream) {

        console.log("Partage écran déjà actif");

        return this.screenStream;

    }

    try {

        const screenStream =
            await navigator.mediaDevices.getDisplayMedia({

                video: true

            });

        const screenTrack =
            screenStream.getVideoTracks()[0];

        if (!screenTrack) {

            console.error(
                "Aucune piste vidéo écran"
            );

            return null;

        }

        console.log(
            "Piste écran obtenue :",
            screenTrack
        );

        // ------------------------------------------
        // Remplacer la caméra par l'écran
        // ------------------------------------------

        this.peerConnections.forEach(
            (peerConnection, socketId) => {

                const sender =
                    peerConnection
                        .getSenders()
                        .find(
                            sender =>
                                sender.track &&
                                sender.track.kind === "video"
                        );

                if (sender) {

                    console.log(
                        "Remplacement vidéo pour :",
                        socketId
                    );

                    sender.replaceTrack(
                        screenTrack
                    );

                }

            }
        );

        // ------------------------------------------
        // Sauvegarder le flux écran
        // ------------------------------------------

        this.screenStream = screenStream;

        this.isScreenSharing = true;

        // ------------------------------------------
        // Si l'utilisateur arrête le partage
        // depuis Chrome/Edge
        // ------------------------------------------

        screenTrack.onended = () => {

            console.log(
                "Partage écran arrêté depuis le navigateur"
            );

            this.stopScreenShare();

        };

        return screenStream;

    }

    catch (error) {

        console.error(
            "Erreur partage écran :",
            error
        );

        throw error;

    }

}

// =====================================================
// CALLBACK FIN PARTAGE ECRAN
// =====================================================
setScreenShareEndedCallback(callback) {

    this.onScreenShareEnded = callback;

}

// =====================================================
// ARRETER LE PARTAGE D'ECRAN
// =====================================================
stopScreenShare() {

    console.log("========== STOP PARTAGE ECRAN ==========");

    if (!this.screenStream) {

        console.log(
            "Aucun partage écran actif"
        );

        return;

    }

    // ------------------------------------------
    // Récupérer la caméra
    // ------------------------------------------

    let cameraTrack = null;

    if (this.localStream) {

        cameraTrack =
            this.localStream
                .getVideoTracks()[0];

    }

    // ------------------------------------------
    // Remettre la caméra chez les participants
    // ------------------------------------------

    this.peerConnections.forEach(
        (peerConnection, socketId) => {

            const sender =
                peerConnection
                    .getSenders()
                    .find(
                        sender =>
                            sender.track &&
                            sender.track.kind === "video"
                    );

            if (sender) {

                console.log(
                    "Retour caméra pour :",
                    socketId
                );

                sender.replaceTrack(
                    cameraTrack || null
                );

                if (cameraTrack) {
                    cameraTrack.enabled = this.cameraEnabled;
                }

            }

        }
    );

    // ------------------------------------------
    // Arrêter le partage écran
    // ------------------------------------------

    this.screenStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });

        this.screenStream = null;

        this.isScreenSharing = false;

        if (this.onScreenShareEnded) {
            this.onScreenShareEnded();
        }

    console.log(
        "Partage écran arrêté"
    );

}

    // =====================================================
    // RECUPERER LE STREAM
    // =====================================================
    getStream() {

        return this.localStream;

    }

}

export default new WebRTCService();
