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
        this.originalCameraTrack = null;
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
        this.microphoneEnabled =
        Boolean(this.audioTrack?.enabled);

        this.cameraEnabled =
        Boolean(this.videoTrack?.enabled);

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
// AJOUTER LES PISTES LOCALES À UNE PEER CONNECTION
// =====================================================
addLocalTracksToPeerConnection(peerConnection) {

    if (!peerConnection) return;

    if (!(this.localStream instanceof MediaStream)) {

        console.warn(
            "⚠️ Aucun localStream disponible pour ajouter les pistes"
        );

        return;
    }

    const senders = peerConnection.getSenders();

    const audioSender =
        senders.find(
            sender =>
                sender.track?.kind === "audio"
        );

    const videoSender =
        senders.find(
            sender =>
                sender.track?.kind === "video"
        );

    const audioTrack =
        this.localStream.getAudioTracks()[0] || null;

    const videoTrack =
        this.localStream.getVideoTracks()[0] || null;

    // MICRO
    if (audioTrack && !audioSender) {

        peerConnection.addTrack(
            audioTrack,
            this.localStream
        );

        console.log(
            "🎤 Piste audio ajoutée"
        );
    }

    // CAMERA
    if (videoTrack && !videoSender) {

        peerConnection.addTrack(
            videoTrack,
            this.localStream
        );

        console.log(
            "📹 Piste vidéo ajoutée"
        );
    }
}

// =====================================================
// CREER UNE PEER CONNECTION
// =====================================================
createPeerConnection(socketId) {

    // -------------------------------------------------
    // Si elle existe déj�
    // -------------------------------------------------

    if (this.peerConnections.has(socketId)) {

        const existingConnection =
            this.peerConnections.get(socketId);

        // S'assurer que les pistes locales sont présentes
        this.addLocalTracksToPeerConnection(
            existingConnection
        );

        return existingConnection;
    }

    // -------------------------------------------------
    // Créer la PeerConnection
    // -------------------------------------------------

    const peerConnection =
        new RTCPeerConnection(configuration);

    // -------------------------------------------------
    // Sauvegarder
    // -------------------------------------------------

    this.peerConnections.set(
        socketId,
        peerConnection
    );

    // =====================================================
    // ETAT DE LA CONNEXION
    // =====================================================
    peerConnection.onconnectionstatechange = () => {

        console.log(
            "🔗 ConnectionState :",
            socketId,
            peerConnection.connectionState
        );

        this.connectionStates.set(
            socketId,
            peerConnection.connectionState
        );

        if (
            peerConnection.connectionState === "failed" ||
            peerConnection.connectionState === "closed"
        ) {

            this.closePeerConnection(socketId);

        }

    };

    // =====================================================
    // ETAT ICE
    // =====================================================

    peerConnection.oniceconnectionstatechange = () => {

        console.log(
            "🧊 ICE State :",
            socketId,
            peerConnection.iceConnectionState
        );

        console.log(
            "🔗 Connection State :",
            socketId,
            peerConnection.connectionState
        );

        if (
            peerConnection.iceConnectionState === "failed"
        ) {

            console.warn(
                "⚠️ Connexion ICE échouée :",
                socketId
            );

        }

    };

    // =====================================================
    // AJOUTER LES PISTES LOCALES
    // =====================================================

    this.addLocalTracksToPeerConnection(
        peerConnection
    );

    // =====================================================
    // ENVOI ICE CANDIDATE
    // =====================================================
    peerConnection.onicecandidate = (event) => {

        if (
            event.candidate &&
            this.onIceCandidate
        ) {

            this.onIceCandidate(
                socketId,
                event.candidate
            );

        }

    };

    peerConnection.onicecandidateerror = (event) => {

        console.error(
            "❌ ICE candidate error :",
            socketId,
            event
        );
    
    };

// =====================================================
// RECEPTION DU FLUX DISTANT
// =====================================================
peerConnection.ontrack = (event) => {

    console.log(
        "📡 ONTRACK reçu :",
        socketId,
        "kind =",
        event.track?.kind,
        "streams =",
        event.streams?.length
    );

    if (!event.track) return;

    // =================================================
    // UTILISER LE STREAM FOURNI PAR WEBRTC SI DISPONIBLE
    // =================================================

    let remoteStream = null;

    if (
        event.streams &&
        event.streams.length > 0 &&
        event.streams[0] instanceof MediaStream
    ) {

        remoteStream = event.streams[0];

    }

    // =================================================
    // FALLBACK : RECONSTRUIRE LE STREAM
    // =================================================

    if (!remoteStream) {

        remoteStream =
            this.remoteStreams.get(socketId);

        if (!(remoteStream instanceof MediaStream)) {

            remoteStream =
                new MediaStream();

        }

        const alreadyExists =
            remoteStream
                .getTracks()
                .some(
                    track =>
                        track.id === event.track.id
                );

        if (!alreadyExists) {

            remoteStream.addTrack(
                event.track
            );

        }

    }

    // =================================================
    // SAUVEGARDER LE STREAM
    // =================================================

    this.remoteStreams.set(
        socketId,
        remoteStream
    );

    // =================================================
    // DEBUG DES PISTES
    // =================================================

    console.log(
        "🎥 Flux distant reçu :",
        socketId,
        remoteStream.getTracks().map(track => ({
            id: track.id,
            kind: track.kind,
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState
        }))
    );

    // =================================================
    // SURVEILLER LES PISTES
    // =================================================

    event.track.onended = () => {

        console.log(
            "⏹️ Piste distante terminée :",
            socketId,
            event.track.kind
        );

        const currentStream =
            this.remoteStreams.get(socketId);

        if (!currentStream) return;

        const remainingTracks =
            currentStream
                .getTracks()
                .filter(
                    track =>
                        track.id !== event.track.id
                );

        const newStream =
            new MediaStream(
                remainingTracks
            );

        this.remoteStreams.set(
            socketId,
            newStream
        );

        if (this.onRemoteStream) {

            this.onRemoteStream(
                socketId,
                newStream
            );

        }

    };

    // =================================================
    // ENVOYER AU FRONTEND
    // =================================================

    if (this.onRemoteStream) {

        this.onRemoteStream(
            socketId,
            remoteStream
        );

    }

};

    return peerConnection;
}

// =====================================================
// CREER UNE OFFER
// =====================================================
async createOffer(socketId) {

    // -------------------------------------------------
    // Sécurité : le flux local doit être disponible
    // -------------------------------------------------

    if (!(this.localStream instanceof MediaStream)) {

        console.log(
            "⏳ Flux local absent, initialisation..."
        );

        await this.startLocalStream();

    }

    // -------------------------------------------------
    // Créer / récupérer la PeerConnection
    // -------------------------------------------------

    const peerConnection =
        this.createPeerConnection(
            socketId
        );

    // -------------------------------------------------
    // S'assurer que caméra + micro sont bien ajoutés
    // -------------------------------------------------

    this.addLocalTracksToPeerConnection(
        peerConnection
    );

    console.log(
        "📡 Pistes envoyées à :",
        socketId,
        peerConnection
            .getSenders()
            .map(
                sender =>
                    sender.track?.kind
            )
    );

    // -------------------------------------------------
    // Créer l'offre
    // -------------------------------------------------

    const offer =
        await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });

    // -------------------------------------------------
    // Définir la description locale
    // -------------------------------------------------

    await peerConnection.setLocalDescription(
        offer
    );

    console.log(
        "📤 Offer créée pour :",
        socketId
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

    this.addLocalTracksToPeerConnection(
        peerConnection
    );

    // Créer une réponse
    const answer = await peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    });

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
destroy() {

    console.log(
        "🚨 DESTROY APPELÉ"
    );

    console.trace();

    this.stopScreenShare();

    this.closeAllConnections();

    this.stopLocalStream();

    this.onRemoteStream = null;

    this.onIceCandidate = null;

    this.onScreenShareEnded = null;

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

    console.log(
        "========== DEMARRAGE PARTAGE ECRAN =========="
    );

    // =================================================
    // EVITER DE DEMARRER DEUX PARTAGES
    // =================================================
    if (
        this.screenStream instanceof MediaStream &&
        this.isScreenSharing
    ) {

        console.log(
            "⚠️ Partage écran déjà actif"
        );

        return this.screenStream;

    }

    // =================================================
    // DEMANDER L'ECRAN AU NAVIGATEUR
    // =================================================
    let screenStream;

    try {

        screenStream =
            await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            });

    }

    catch (error) {

        console.warn(
            "⚠️ Partage d'écran annulé :",
            error
        );

        return null;

    }

    const screenTrack =
        screenStream.getVideoTracks()[0];

    if (!screenTrack) {

        screenStream
            .getTracks()
            .forEach(track => track.stop());

        throw new Error(
            "Aucune piste vidéo écran disponible."
        );

    }

    // =================================================
    // CONSERVER LA CAMERA
    // =================================================
    this.originalCameraTrack =
        this.videoTrack ||
        this.localStream?.getVideoTracks()[0] ||
        null;

    console.log(
        "📹 Caméra conservée :",
        this.originalCameraTrack
    );

    // =================================================
    // SAUVEGARDER LE FLUX ECRAN AVANT REPLACETRACK
    // =================================================
    this.screenStream =
        screenStream;

    this.isScreenSharing =
        true;

    // =================================================
    // REMPLACER LA CAMERA PAR L'ECRAN
    // CHEZ TOUS LES PARTICIPANTS
    // =================================================
    for (
        const [
            socketId,
            peerConnection
        ]
        of this.peerConnections.entries()
    ) {

        if (
            !peerConnection ||
            peerConnection.connectionState === "closed"
        ) {

            continue;

        }

        const videoSender =
            peerConnection
                .getSenders()
                .find(
                    sender =>
                        sender.track?.kind === "video"
                );

        if (!videoSender) {

            console.warn(
                "⚠️ Aucun sender vidéo pour :",
                socketId
            );

            continue;

        }

        try {

            await videoSender.replaceTrack(
                screenTrack
            );

            console.log(
                "🖥️ Écran envoyé à :",
                socketId
            );

        }

        catch (error) {

            console.error(
                "❌ Erreur replaceTrack écran :",
                socketId,
                error
            );

        }

    }

    // =================================================
    // ARRET DEPUIS LE NAVIGATEUR
    // =================================================
    screenTrack.onended = async () => {

        console.log(
            "🛑 Partage arrêté depuis le navigateur"
        );

        await this.stopScreenShare();

    };

    console.log(
        "✅ Partage écran actif"
    );

    return screenStream;

}


// =====================================================
// CALLBACK FIN PARTAGE ECRAN
// =====================================================
setScreenShareEndedCallback(callback) {

    this.onScreenShareEnded =
        callback;

}


// =====================================================
// ARRETER LE PARTAGE D'ECRAN
// =====================================================
async stopScreenShare() {

    console.log(
        "========== ARRET PARTAGE ECRAN =========="
    );

    // =================================================
    // CONSERVER LES REFERENCES AVANT NETTOYAGE
    // =================================================
    const screenStream =
        this.screenStream;

    const cameraTrack =
        this.originalCameraTrack ||
        this.videoTrack ||
        this.localStream?.getVideoTracks()[0] ||
        null;

    // =================================================
    // SI LE PARTAGE EST DEJA TERMINE
    // ON NETTOIE QUAND MEME LES ETATS
    // =================================================
    if (
        !screenStream &&
        !this.isScreenSharing
    ) {

        console.log(
            "ℹ️ Aucun partage d'écran actif"
        );

        return;

    }

    // =================================================
    // RESTAURER LA CAMERA CHEZ TOUS LES PARTICIPANTS
    // =================================================
    for (
        const [
            socketId,
            peerConnection
        ]
        of this.peerConnections.entries()
    ) {

        if (
            !peerConnection ||
            peerConnection.connectionState === "closed"
        ) {

            continue;

        }

        const videoSender =
            peerConnection
                .getSenders()
                .find(
                    sender =>
                        sender.track?.kind === "video"
                );

        if (!videoSender) {

            continue;

        }

        try {

            await videoSender.replaceTrack(
                cameraTrack || null
            );

            if (cameraTrack) {

                cameraTrack.enabled =
                    Boolean(
                        this.cameraEnabled
                    );

            }

            console.log(
                "📹 Caméra restaurée pour :",
                socketId
            );

        }

        catch (error) {

            console.error(
                "❌ Erreur restauration caméra :",
                socketId,
                error
            );

        }

    }

    // =================================================
    // ARRETER LE FLUX ECRAN
    // =================================================
    if (
        screenStream instanceof MediaStream
    ) {

        screenStream
            .getTracks()
            .forEach(track => {

                // Eviter de rappeler stopScreenShare
                // depuis onended.
                track.onended = null;

                if (
                    track.readyState !== "ended"
                ) {

                    track.stop();

                }

            });

    }

    // =================================================
    // NETTOYER LES ETATS
    // =================================================
    this.screenStream =
        null;

    this.isScreenSharing =
        false;

    this.originalCameraTrack =
        null;

    // =================================================
    // CALLBACK LOCAL
    // =================================================
    if (
        typeof this.onScreenShareEnded ===
        "function"
    ) {

        try {

            this.onScreenShareEnded();

        }

        catch (error) {

            console.error(
                "❌ Erreur callback fin partage :",
                error
            );

        }

    }

    console.log(
        "✅ Partage écran terminé"
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
