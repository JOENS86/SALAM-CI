import { useEffect, useState, useRef } from "react";

import {
  FaArrowLeft,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaHandPaper,
  FaPhoneSlash,
  FaPaperPlane,
  FaUsers,
  FaDesktop,
  FaComments,
  FaTimes
} from "react-icons/fa";

import {useNavigate, useParams} from "react-router-dom";
import conferenceService from "../../services/conferenceService";
import socket from "../../socket/socket";
import webrtcService from "../../services/webrtcService";
import MainVideo from "../../components/conference/MainVideo";


function ConferenceLive() {

  const navigate = useNavigate();
  const { id } = useParams();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  // =====================================================
  // CONFERENCE
  // =====================================================
  const [conference, setConference] = useState(null);

  const [loading, setLoading] = useState(true);

  const [conferenceEnded, setConferenceEnded] = useState(false);


  // =====================================================
  // PARTICIPANTS
  // =====================================================
  const [participants, setParticipants] = useState([]);

  const participantsRef = useRef([]);

  useEffect(() => {

    participantsRef.current = participants;

  }, [participants]);


  // =====================================================
  // ETATS MEDIA DES PARTICIPANTS
  // =====================================================
  const [participantMediaStates, setParticipantMediaStates] =
    useState({});

  const participantMediaStatesRef = useRef({});

  useEffect(() => {

    participantMediaStatesRef.current =
      participantMediaStates;

  }, [participantMediaStates]);


  // =====================================================
  // FLUX VIDEO
  // =====================================================
  const [mainStream, setMainStream] = useState(null);

  const [thumbnailStreams, setThumbnailStreams] =
    useState([]);


  // =====================================================
  // PARTICIPANT PRINCIPAL
  // =====================================================
  const [mainParticipant, setMainParticipant] =
    useState(null);


  // =====================================================
  // PARTAGE D'ECRAN
  // =====================================================
  const [screenShareOwner, setScreenShareOwner] =
    useState(null);

  const screenShareOwnerRef = useRef(null);

  useEffect(() => {

    screenShareOwnerRef.current =
      screenShareOwner;

  }, [screenShareOwner]);


  // =====================================================
  // AUTORISATION PARTAGE ECRAN
  // =====================================================
  const [screenShareAllowed, setScreenShareAllowed] =
    useState(false);


  // =====================================================
  // MICRO / CAMERA LOCAL
  // =====================================================
  const [micOn, setMicOn] = useState(false);

  const [camOn, setCamOn] = useState(false);


  // =====================================================
  // CHAT
  // =====================================================
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);


  // =====================================================
  // LEVER LA MAIN
  // =====================================================
  const [handRaised, setHandRaised] = useState(false);

  const [raisedHands, setRaisedHands] = useState([]);

  const [handNotification, setHandNotification] =
    useState(null);


  // =====================================================
  // FIN DE CONFERENCE
  // =====================================================
  const [showEndConfirm, setShowEndConfirm] =
    useState(false);

  const [endingConference, setEndingConference] =
    useState(false);


  // =====================================================
  // SIDEBAR
  // =====================================================
  const [showSidebar, setShowSidebar] =
    useState(false);


  // =====================================================
  // ROLE UTILISATEUR
  // =====================================================
  const isTeacher =
    user.role === "teacher";

  const isAdmin =
    user.role === "admin";


  // =====================================================
  // HOTE / CREATEUR
  // =====================================================
  const isConferenceStarter =
    Boolean(conference?.startedBy) &&
    String(
      conference.startedBy?._id ||
      conference.startedBy
    ) === String(user._id);


  const isHost =
    Boolean(isConferenceStarter) &&
    (isTeacher || isAdmin);


  // =====================================================
  // PARTAGE D'ECRAN LOCAL
  // =====================================================
  const [sharingScreen, setSharingScreen] =
    useState(false);


  // =====================================================
  // CONTROLES GLOBAUX ETUDIANTS
  // =====================================================
  const [allStudentsMicOn, setAllStudentsMicOn] =
    useState(false);

  const [allStudentsCamOn, setAllStudentsCamOn] =
    useState(false);

// =====================================================
// CHARGER LA CONFERENCE
// =====================================================
const loadConference = async () => {

  try {

    setLoading(true);

    const result =
      await conferenceService.getConferenceById(id);

    if (!result?.conference) {

      console.error(
        "❌ Conférence introuvable"
      );

      setConference(null);

      return;
    }

    setConference(
      result.conference
    );

  }

  catch (error) {

    console.error(
      "❌ Erreur chargement conférence :",
      error
    );

    setConference(null);

  }

  finally {

    setLoading(false);

  }

};


useEffect(() => {

  if (!id) return;

  loadConference();

}, [id]);


// =====================================================
// SOCKET.IO + WEBRTC
// =====================================================
useEffect(() => {

  if (!conference?._id) {
    return;
  }

  let mounted = true;

  let localStream = null;


  // =====================================================
  // PARTICIPANT LOCAL
  // =====================================================

  const getLocalParticipant = () => {

    return {

      socketId: socket.id,

      name:
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim() || "Vous",

      role: user.role,

      photo: user.photo,

      isLocal: true

    };

  };


  // =====================================================
  // INITIALISATION CONFERENCE
  // =====================================================
  const initConference = async () => {

    try {

      console.log(
        "🎥 Initialisation de la conférence..."
      );


      // =================================================
      // OBTENIR LE FLUX LOCAL
      // =================================================

      localStream =
        await webrtcService.startLocalStream();


      if (!mounted) {

        localStream
          ?.getTracks()
          ?.forEach(track => track.stop());

        return;

      }


      // =================================================
      // CONFIGURATION INITIALE DES MEDIA
      // =================================================

      if (isHost) {

        webrtcService.setMicrophoneEnabled(true);

        webrtcService.setCameraEnabled(true);

        setMicOn(true);

        setCamOn(true);

      }

      else {

        webrtcService.setMicrophoneEnabled(false);

        webrtcService.setCameraEnabled(false);

        setMicOn(false);

        setCamOn(false);

      }


      // =================================================
      // PARTICIPANT LOCAL
      // =================================================

      const localParticipant =
        getLocalParticipant();


      // =================================================
      // MA MINIATURE
      // =================================================

      setThumbnailStreams([

        {

          socketId: socket.id,

          stream: localStream,

          participant: localParticipant,

          isLocal: true,

          cameraEnabled: isHost

        }

      ]);


      // =================================================
      // SI JE SUIS HOTE
      // =================================================

      if (isHost) {

        setMainStream(localStream);

        setMainParticipant({

          ...localParticipant,

          cameraEnabled: true

        });

      }

      // =================================================
      // SI JE SUIS ETUDIANT
      // =================================================

      else {

        setMainStream(null);

        setMainParticipant(null);

      }


      // =================================================
      // INFORMER LE SERVEUR DE MON ETAT MEDIA
      // =================================================

      socket.emit(
        "participant:microphone:state",
        {

          roomId: conference._id,

          enabled: isHost

        }
      );


      socket.emit(
        "participant:camera:state",
        {

          roomId: conference._id,

          enabled: isHost

        }
      );


      console.log(
        "✅ Initialisation conférence terminée"
      );

    }

    catch (error) {

      console.error(
        "❌ ERREUR INIT CONFERENCE :",
        error
      );

    }

  };


  // =====================================================
  // FLUX DISTANT RECU
  // =====================================================
  webrtcService.setRemoteStreamCallback(
    (socketId, stream) => {

      if (
        !mounted ||
        !socketId ||
        !stream
      ) {

        return;

      }


      console.log(
        "📹 FLUX DISTANT REÇU :",
        socketId
      );


      // =================================================
      // RECHERCHER LE PARTICIPANT
      // =================================================

      const participant =
        participantsRef.current.find(
          item =>
            item.socketId === socketId
        );


      if (!participant) {

        console.warn(
          "⚠️ Participant introuvable pour le flux :",
          socketId
        );

        return;

      }


      // =================================================
      // ETAT MEDIA
      // =================================================

      const mediaState =
        participantMediaStatesRef.current[
          socketId
        ] || {};


      const cameraEnabled =
        typeof mediaState.camera === "boolean"
          ? mediaState.camera
          : true;


      // =================================================
      // PARTICIPANT DISTANT PRINCIPAL
      // =================================================

      const remoteParticipant = {

        ...participant,

        isLocal: false,

        cameraEnabled

      };


      // =================================================
      // LE DISTANT PASSE EN GRAND
      // =================================================

      setMainStream(stream);

      setMainParticipant(
        remoteParticipant
      );


      // =================================================
      // MOI = MINIATURE
      // =================================================

      const currentLocalStream =
        webrtcService.getStream();


      if (currentLocalStream) {

        setThumbnailStreams([

          {

            socketId: socket.id,

            stream: currentLocalStream,

            participant:
              getLocalParticipant(),

            isLocal: true,

            cameraEnabled:
              webrtcService.cameraEnabled

          }

        ]);

      }


      console.log(
        "📺 Participant distant en grand :",
        remoteParticipant.name
      );

    }
  );


  // =====================================================
  // FIN PARTAGE ECRAN
  // =====================================================

  webrtcService.setScreenShareEndedCallback(() => {

    if (!mounted) {
      return;
    }


    console.log(
      "🛑 Partage écran terminé"
    );


    setSharingScreen(false);

    setScreenShareOwner(null);


    const currentLocalStream =
      webrtcService.getStream();


    // =================================================
    // RESTAURER LE FLUX PRINCIPAL
    // =================================================

    const remoteParticipant =
      participantsRef.current.find(
        participant =>
          participant.socketId !== socket.id
      );


    if (remoteParticipant) {

      const remoteStream =
        webrtcService.getRemoteStream(
          remoteParticipant.socketId
        );


      if (remoteStream) {

        const mediaState =
          participantMediaStatesRef.current[
            remoteParticipant.socketId
          ] || {};


        setMainStream(
          remoteStream
        );


        setMainParticipant({

          ...remoteParticipant,

          isLocal: false,

          cameraEnabled:
            typeof mediaState.camera === "boolean"
              ? mediaState.camera
              : true

        });

        return;

      }

    }


    // =================================================
    // PERSONNE D'AUTRE
    // =================================================

    if (currentLocalStream) {

      setMainStream(
        currentLocalStream
      );


      setMainParticipant({

        ...getLocalParticipant(),

        cameraEnabled:
          webrtcService.cameraEnabled

      });

    }

  });


  // =====================================================
  // ICE CALLBACK
  // =====================================================

  webrtcService.setIceCandidateCallback(
    (socketId, candidate) => {

      if (
        !mounted ||
        !socketId ||
        !candidate
      ) {

        return;

      }


      socket.emit(
        "webrtc:iceCandidate",
        {

          roomId: conference._id,

          sender: socket.id,

          target: socketId,

          candidate

        }
      );

    }
  );


  // =====================================================
  // PARTICIPANTS
  // =====================================================

  const handleParticipants = ({
    participants: receivedParticipants = [],
    count = 0
  } = {}) => {

    if (!mounted) {
      return;
    }


    const participantList =
      Array.isArray(receivedParticipants)
        ? receivedParticipants
        : [];


    console.log(
      "👥 Participants reçus :",
      participantList
    );


    console.log(
      "🔢 Nombre participants :",
      count
    );


    setParticipants(
      participantList
    );


    // =================================================
    // INITIALISER LES ETATS MEDIA MANQUANTS
    // =================================================

    setParticipantMediaStates(prev => {

      const updated = {
        ...prev
      };


      participantList.forEach(
        participant => {

          if (
            !participant?.socketId
          ) {

            return;

          }


          if (
            !updated[
              participant.socketId
            ]
          ) {

            updated[
              participant.socketId
            ] = {

              microphone: false,

              camera: false,

              screenShare: false

            };

          }

        }
      );


      return updated;

    });

  };


  // =====================================================
  // AUTORISATION PARTAGE ECRAN
  // =====================================================

  const handleScreenSharePermission = ({
    enabled
  } = {}) => {

    const allowed =
      Boolean(enabled);


    console.log(
      "🖥️ Autorisation partage écran :",
      allowed
    );


    setScreenShareAllowed(
      allowed
    );


    setParticipantMediaStates(prev => ({

      ...prev,

      [socket.id]: {

        ...prev[socket.id],

        screenShare: allowed

      }

    }));


    // =================================================
    // AUTORISATION RETIREE
    // =================================================

    if (
      !allowed &&
      webrtcService.isScreenSharing
    ) {

      webrtcService.stopScreenShare();

      setSharingScreen(false);

      setScreenShareOwner(null);


      const currentLocalStream =
        webrtcService.getStream();


      setMainStream(
        currentLocalStream
      );

    }

  };


  // =====================================================
  // ETAT PARTAGE ECRAN
  // =====================================================

  const handleScreenShareState = ({
    socketId,
    enabled
  } = {}) => {

    if (!socketId) {
      return;
    }


    console.log(
      "🖥️ Etat partage écran :",
      socketId,
      enabled
    );


    if (enabled) {

      setScreenShareOwner(
        socketId
      );


      const remoteStream =
        webrtcService.getRemoteStream(
          socketId
        );


      if (remoteStream) {

        setMainStream(
          remoteStream
        );


        const participant =
          participantsRef.current.find(
            item =>
              item.socketId === socketId
          );


        if (participant) {

          setMainParticipant({

            ...participant,

            isLocal:
              socketId === socket.id,

            cameraEnabled: true

          });

        }

      }

    }

    else {

      setScreenShareOwner(
        null
      );


      // =================================================
      // SI C'EST MOI QUI ARRETE
      // =================================================

      if (
        socketId === socket.id
      ) {

        const remoteParticipant =
          participantsRef.current.find(
            participant =>
              participant.socketId !== socket.id
          );


        if (remoteParticipant) {

          const remoteStream =
            webrtcService.getRemoteStream(
              remoteParticipant.socketId
            );


          if (remoteStream) {

            const mediaState =
              participantMediaStatesRef.current[
                remoteParticipant.socketId
              ] || {};


            setMainStream(
              remoteStream
            );


            setMainParticipant({

              ...remoteParticipant,

              isLocal: false,

              cameraEnabled:
                typeof mediaState.camera === "boolean"
                  ? mediaState.camera
                  : true

            });

            return;

          }

        }


        const currentLocalStream =
          webrtcService.getStream();


        setMainStream(
          currentLocalStream
        );


        setMainParticipant({

          ...getLocalParticipant(),

          cameraEnabled:
            webrtcService.cameraEnabled

        });

      }

    }

  };


  // =====================================================
  // CHAT HISTORIQUE
  // =====================================================

  const handleChatHistory = history => {

    if (!mounted) {
      return;
    }


    setMessages(
      Array.isArray(history)
        ? history
        : []
    );

  };


  // =====================================================
  // NOUVEAU MESSAGE
  // =====================================================

  const handleNewMessage = newMessage => {

    if (!mounted) {
      return;
    }


    setMessages(prev => [

      ...prev,

      newMessage

    ]);

  };


  // =====================================================
  // NOUVEAU PARTICIPANT
  // =====================================================

  const handleUserJoined = async ({
    participant
  } = {}) => {

    if (
      !participant?.socketId ||
      participant.socketId === socket.id
    ) {

      return;

    }


    console.log(
      "🟢 Participant rejoint :",
      participant
    );


    // =================================================
    // SEUL L'HOTE CREER L'OFFER
    // =================================================

    if (!isHost) {
      return;
    }


    try {

      if (
        webrtcService.hasPeerConnection(
          participant.socketId
        )
      ) {

        console.log(
          "ℹ️ Connexion WebRTC déjà existante :",
          participant.socketId
        );

        return;

      }


      // =================================================
      // CREER CONNEXION PEER
      // =================================================

      webrtcService.createPeerConnection(
        participant.socketId
      );


      // =================================================
      // CREER OFFER
      // =================================================

      const offer =
        await webrtcService.createOffer(
          participant.socketId
        );


      if (!mounted) {
        return;
      }


      // =================================================
      // ENVOYER OFFER
      // =================================================

      socket.emit(
        "webrtc:offer",
        {

          roomId: conference._id,

          sender: socket.id,

          target:
            participant.socketId,

          offer

        }
      );


      console.log(
        "📤 Offer WebRTC envoyée à :",
        participant.socketId
      );

    }

    catch (error) {

      console.error(
        "❌ Erreur création WebRTC :",
        error
      );

    }

  };


  // =====================================================
  // PARTICIPANT PARTI
  // =====================================================

  const handleUserLeft = ({
    participant
  } = {}) => {

    const leftSocketId =
      participant?.socketId;


    if (!leftSocketId) {
      return;
    }


    console.log(
      "🔴 Participant parti :",
      leftSocketId
    );


    // =================================================
    // FERMER WEBRTC
    // =================================================

    webrtcService.closePeerConnection(
      leftSocketId
    );


    // =================================================
    // SUPPRIMER ETAT MEDIA
    // =================================================

    setParticipantMediaStates(prev => {

      const updated = {
        ...prev
      };


      delete updated[
        leftSocketId
      ];


      return updated;

    });


    // =================================================
    // PARTAGE D'ECRAN
    // =================================================

    if (
      screenShareOwnerRef.current ===
      leftSocketId
    ) {

      setScreenShareOwner(
        null
      );

    }


    // =================================================
    // TROUVER UN AUTRE PARTICIPANT
    // =================================================

    const remainingParticipant =
      participantsRef.current.find(
        item =>
          item.socketId !== socket.id &&
          item.socketId !== leftSocketId
      );


    // =================================================
    // UN AUTRE PARTICIPANT EXISTE
    // =================================================

    if (remainingParticipant) {

      const remoteStream =
        webrtcService.getRemoteStream(
          remainingParticipant.socketId
        );


      if (remoteStream) {

        const mediaState =
          participantMediaStatesRef.current[
            remainingParticipant.socketId
          ] || {};


        setMainStream(
          remoteStream
        );


        setMainParticipant({

          ...remainingParticipant,

          isLocal: false,

          cameraEnabled:
            typeof mediaState.camera === "boolean"
              ? mediaState.camera
              : true

        });

      }


      return;

    }


    // =================================================
    // PLUS PERSONNE
    // =================================================

    const currentLocalStream =
      webrtcService.getStream();


    if (currentLocalStream) {

      setMainStream(
        currentLocalStream
      );


      setMainParticipant({

        ...getLocalParticipant(),

        cameraEnabled:
          webrtcService.cameraEnabled

      });

    }


    // =================================================
    // PLUS BESOIN DE MINIATURE
    // =================================================

    setThumbnailStreams([]);

  };


  // =====================================================
  // OFFER
  // =====================================================

  const handleOffer = async ({
    sender,
    offer
  } = {}) => {

    if (
      !sender ||
      sender === socket.id ||
      !offer
    ) {

      return;

    }


    try {

      console.log(
        "📥 Offer reçue de :",
        sender
      );


      // =================================================
      // REPONDRE A L'OFFER
      // =================================================

      const answer =
        await webrtcService.handleOffer(
          sender,
          offer
        );


      if (!mounted) {
        return;
      }


      socket.emit(
        "webrtc:answer",
        {

          roomId: conference._id,

          sender: socket.id,

          target: sender,

          answer

        }
      );


      console.log(
        "📤 Answer envoyée à :",
        sender
      );

    }

    catch (error) {

      console.error(
        "❌ Erreur traitement offer :",
        error
      );

    }

  };


  // =====================================================
  // ANSWER
  // =====================================================

  const handleAnswer = async ({
    sender,
    answer
  } = {}) => {

    if (
      !sender ||
      sender === socket.id ||
      !answer
    ) {

      return;

    }


    try {

      await webrtcService.handleAnswer(
        sender,
        answer
      );


      console.log(
        "✅ Answer traitée :",
        sender
      );

    }

    catch (error) {

      console.error(
        "❌ Erreur traitement answer :",
        error
      );

    }

  };


  // =====================================================
  // ICE
  // =====================================================

  const handleIceCandidate = async ({
    sender,
    candidate
  } = {}) => {

    if (
      !sender ||
      sender === socket.id ||
      !candidate
    ) {

      return;

    }


    try {

      await webrtcService.addIceCandidate(
        sender,
        candidate
      );

    }

    catch (error) {

      console.error(
        "❌ Erreur ICE :",
        error
      );

    }

  };


  // =====================================================
  // CONTROLE MICRO INDIVIDUEL
  // =====================================================

  const handleRemoteMicrophone = ({
    enabled
  } = {}) => {

    const result =
      webrtcService.setMicrophoneEnabled(
        Boolean(enabled)
      );


    const finalState =
      Boolean(result);


    setMicOn(
      finalState
    );


    console.log(
      "🎤 Micro contrôlé par l'hôte :",
      finalState
    );

  };


  // =====================================================
  // CONTROLE CAMERA INDIVIDUEL
  // =====================================================

  const handleRemoteCamera = ({
    enabled
  } = {}) => {

    const result =
      webrtcService.setCameraEnabled(
        Boolean(enabled)
      );


    const finalState =
      Boolean(result);


    setCamOn(
      finalState
    );


    console.log(
      "📹 Caméra contrôlée par l'hôte :",
      finalState
    );

  };


  // =====================================================
  // CONTROLE GLOBAL MICRO
  // =====================================================

  const handleGlobalMicrophone = ({
    enabled
  } = {}) => {

    // L'hôte ne doit pas appliquer sa propre commande
    if (isHost) {
      return;
    }


    const result =
      webrtcService.setMicrophoneEnabled(
        Boolean(enabled)
      );


    setMicOn(
      Boolean(result)
    );

  };


  // =====================================================
  // CONTROLE GLOBAL CAMERA
  // =====================================================

  const handleGlobalCamera = ({
    enabled
  } = {}) => {

    // L'hôte ne doit pas appliquer sa propre commande
    if (isHost) {
      return;
    }


    const result =
      webrtcService.setCameraEnabled(
        Boolean(enabled)
      );


    setCamOn(
      Boolean(result)
    );

  };


  // =====================================================
  // ETAT MEDIA PARTICIPANT
  // =====================================================

  const handleParticipantMediaState = ({
    socketId,
    microphone,
    camera
  } = {}) => {

    if (!socketId) {
      return;
    }


    setParticipantMediaStates(prev => {

      const current =
        prev[socketId] || {};


      return {

        ...prev,

        [socketId]: {

          ...current,

          ...(typeof microphone === "boolean"
            ? {
                microphone
              }
            : {}),

          ...(typeof camera === "boolean"
            ? {
                camera
              }
            : {})

        }

      };

    });

  };


  // =====================================================
  // LEVER LA MAIN
  // =====================================================

  const handleHandList = hands => {

    setRaisedHands(
      Array.isArray(hands)
        ? hands
        : []
    );

  };


  // =====================================================
  // NOTIFICATION LEVER LA MAIN
  // =====================================================

  const handleHandNotification = ({
    name,
    raised
  } = {}) => {

    if (!isHost) {
      return;
    }


    setHandNotification({

      name,

      raised

    });


    setTimeout(() => {

      if (mounted) {

        setHandNotification(
          null
        );

      }

    }, 4000);

  };


  // =====================================================
  // CONFERENCE TERMINEE
  // =====================================================

  const handleConferenceEnded = ({
    conference: endedConference
  } = {}) => {

    if (!mounted) {
      return;
    }


    console.log(
      "🔴 CONFERENCE TERMINEE"
    );


    setConferenceEnded(
      true
    );


    if (endedConference) {

      setConference(
        endedConference
      );

    }


    // =================================================
    // COUPER MICRO
    // =================================================

    webrtcService.setMicrophoneEnabled(
      false
    );

    setMicOn(false);


    // =================================================
    // COUPER CAMERA
    // =================================================

    webrtcService.setCameraEnabled(
      false
    );

    setCamOn(false);


    // =================================================
    // ARRETER PARTAGE ECRAN
    // =================================================

    if (
      webrtcService.isScreenSharing
    ) {

      webrtcService.stopScreenShare();

    }


    setSharingScreen(false);

    setScreenShareOwner(null);


    // =================================================
    // BAISSER MAIN
    // =================================================

    setHandRaised(false);


    // =================================================
    // NETTOYER MINIATURES
    // =================================================

    setThumbnailStreams([]);


    console.log(
      "✅ Ecran de fin affiché"
    );

  };


  // =====================================================
  // ENREGISTRER LES LISTENERS
  // =====================================================

  socket.on(
    "conference:participants",
    handleParticipants
  );

  socket.on(
    "participant:screenShare",
    handleScreenSharePermission
  );

  socket.on(
    "participant:screenShareState",
    handleScreenShareState
  );

  socket.on(
    "chat:history",
    handleChatHistory
  );

  socket.on(
    "chat:newMessage",
    handleNewMessage
  );

  socket.on(
    "conference:userJoined",
    handleUserJoined
  );

  socket.on(
    "conference:userLeft",
    handleUserLeft
  );

  socket.on(
    "webrtc:offer",
    handleOffer
  );

  socket.on(
    "webrtc:answer",
    handleAnswer
  );

  socket.on(
    "webrtc:iceCandidate",
    handleIceCandidate
  );

  socket.on(
    "participant:microphone",
    handleRemoteMicrophone
  );

  socket.on(
    "participant:camera",
    handleRemoteCamera
  );

  socket.on(
    "participant:mediaState",
    handleParticipantMediaState
  );

  socket.on(
    "teacher:microphone:all",
    handleGlobalMicrophone
  );

  socket.on(
    "teacher:camera:all",
    handleGlobalCamera
  );

  socket.on(
    "hand:list",
    handleHandList
  );

  socket.on(
    "hand:notification",
    handleHandNotification
  );

  socket.on(
    "conference:ended",
    handleConferenceEnded
  );


  // =====================================================
  // REJOINDRE LA SALLE
  // =====================================================

  socket.emit(
    "conference:joinRoom",
    {

      roomId: conference._id,

      user

    }
  );


  // =====================================================
  // RECUPERER HISTORIQUE CHAT
  // =====================================================

  socket.emit(
    "chat:getHistory",
    conference._id
  );


  // =====================================================
  // INITIALISER WEBRTC
  // =====================================================

  initConference();


  // =====================================================
  // CLEANUP
  // =====================================================

  return () => {

    mounted = false;


    // =================================================
    // RETIRER LES LISTENERS EXACTS
    // =================================================

    socket.off(
      "conference:participants",
      handleParticipants
    );

    socket.off(
      "participant:screenShare",
      handleScreenSharePermission
    );

    socket.off(
      "participant:screenShareState",
      handleScreenShareState
    );

    socket.off(
      "chat:history",
      handleChatHistory
    );

    socket.off(
      "chat:newMessage",
      handleNewMessage
    );

    socket.off(
      "conference:userJoined",
      handleUserJoined
    );

    socket.off(
      "conference:userLeft",
      handleUserLeft
    );

    socket.off(
      "webrtc:offer",
      handleOffer
    );

    socket.off(
      "webrtc:answer",
      handleAnswer
    );

    socket.off(
      "webrtc:iceCandidate",
      handleIceCandidate
    );

    socket.off(
      "participant:microphone",
      handleRemoteMicrophone
    );

    socket.off(
      "participant:camera",
      handleRemoteCamera
    );

    socket.off(
      "participant:mediaState",
      handleParticipantMediaState
    );

    socket.off(
      "teacher:microphone:all",
      handleGlobalMicrophone
    );

    socket.off(
      "teacher:camera:all",
      handleGlobalCamera
    );

    socket.off(
      "hand:list",
      handleHandList
    );

    socket.off(
      "hand:notification",
      handleHandNotification
    );

    socket.off(
      "conference:ended",
      handleConferenceEnded
    );


    // =================================================
    // NETTOYER CALLBACKS WEBRTC
    // =================================================

    webrtcService.setRemoteStreamCallback(
      null
    );

    webrtcService.setIceCandidateCallback(
      null
    );

    webrtcService.setScreenShareEndedCallback(
      null
    );


    // =================================================
    // ARRETER LE FLUX LOCAL
    // =================================================

    if (localStream) {

      localStream
        .getTracks()
        .forEach(track => {

          track.stop();

        });

    }


    setThumbnailStreams([]);

  };

}, [conference]);

// =====================================================
// ENVOYER UN MESSAGE
// =====================================================
const sendMessage = () => {

  if (!message.trim()) return;

  socket.emit(

      "chat:send",

      {

          roomId: conference._id,

          user: {

              id: user._id,

              firstName: user.firstName,

              lastName: user.lastName,

              photo: user.photo,

              role: user.role

          },

          message

      }

  );

  setMessage("");

};


// =====================================================
// MICRO UTILISATEUR
// =====================================================
const toggleMicrophone = () => {

  if (
    conferenceEnded ||
    !conference
  ) {
    return;
  }


  // ===================================================
  // INVERSER LE MICRO REEL
  // ===================================================

  const enabled =
    Boolean(
      webrtcService.toggleMicrophone()
    );


  // ===================================================
  // METTRE A JOUR MON INTERFACE
  // ===================================================

  setMicOn(
    enabled
  );


  // ===================================================
  // INFORMER LES AUTRES PARTICIPANTS
  // ===================================================

  socket.emit(
    "participant:microphone:state",
    {

      roomId:
        conference._id,

      enabled

    }
  );


  console.log(
    "🎤 Mon micro :",
    enabled
      ? "ACTIVÉ"
      : "COUPÉ"
  );

};


// =====================================================
// CAMERA UTILISATEUR
// =====================================================

const toggleCamera = () => {

  if (
    conferenceEnded ||
    !conference
  ) {
    return;
  }


  // ===================================================
  // ETUDIANT :
  // LA CAMERA DOIT AVOIR ETE AUTORISEE
  // ===================================================

  if (
    !isHost &&
    user.role === "student" &&
    !camOn
  ) {

    console.warn(
      "⚠️ La caméra doit être autorisée par l'hôte."
    );

    return;

  }


  // ===================================================
  // INVERSER LA CAMERA REELLE
  // ===================================================

  const enabled =
    Boolean(
      webrtcService.toggleCamera()
    );


  // ===================================================
  // METTRE A JOUR MON INTERFACE
  // ===================================================

  setCamOn(
    enabled
  );


  // ===================================================
  // INFORMER LES AUTRES
  // ===================================================

  socket.emit(
    "participant:camera:state",
    {

      roomId:
        conference._id,

      enabled

    }
  );


  console.log(
    "📹 Ma caméra :",
    enabled
      ? "ACTIVÉE"
      : "COUPÉE"
  );

};


// =====================================================
// CONTROLE GLOBAL MICRO ETUDIANTS
// =====================================================
const toggleAllStudentsMicrophone = () => {

  if (
    !isHost ||
    !conference
  ) {
    return;
  }


  // ===================================================
  // NOUVEL ETAT
  // ===================================================

  const enabled =
    !allStudentsMicOn;


  console.log(
    "🎤 CONTROLE GLOBAL MICRO :",
    enabled
      ? "ACTIVER TOUS"
      : "COUPER TOUS"
  );


  // ===================================================
  // ENVOYER AU SERVEUR
  // ===================================================

  socket.emit(
    "teacher:microphone:all",
    {

      roomId:
        conference._id,

      enabled

    }
  );


  // ===================================================
  // ETAT DU BOUTON ENSEIGNANT
  // ===================================================

  setAllStudentsMicOn(
    enabled
  );


  // ===================================================
  // MISE A JOUR LOCALE DE LA LISTE
  // ===================================================

  setParticipantMediaStates(
    prev => {

      const updated = {
        ...prev
      };


      participants.forEach(
        participant => {

          if (
            participant.socketId !== socket.id &&
            participant.role === "student"
          ) {

            updated[
              participant.socketId
            ] = {

              ...updated[
                participant.socketId
              ],

              microphone:
                enabled

            };

          }

        }
      );


      return updated;

    }
  );

};


// =====================================================
// CONTROLE GLOBAL CAMERA ETUDIANTS
// =====================================================

const toggleAllStudentsCamera = () => {

  if (
    !isHost ||
    !conference
  ) {
    return;
  }


  // ===================================================
  // NOUVEL ETAT
  // ===================================================

  const enabled =
    !allStudentsCamOn;


  console.log(
    "📹 CONTROLE GLOBAL CAMERA :",
    enabled
      ? "ACTIVER TOUTES"
      : "COUPER TOUTES"
  );


  // ===================================================
  // ENVOYER AU SERVEUR
  // ===================================================

  socket.emit(
    "teacher:camera:all",
    {

      roomId:
        conference._id,

      enabled

    }
  );


  // ===================================================
  // ETAT DU BOUTON ENSEIGNANT
  // ===================================================

  setAllStudentsCamOn(
    enabled
  );


  // ===================================================
  // MISE A JOUR DE LA LISTE
  // ===================================================

  setParticipantMediaStates(
    prev => {

      const updated = {
        ...prev
      };


      participants.forEach(
        participant => {

          if (
            participant.socketId !== socket.id &&
            participant.role === "student"
          ) {

            updated[
              participant.socketId
            ] = {

              ...updated[
                participant.socketId
              ],

              camera:
                enabled

            };

          }

        }
      );


      return updated;

    }
  );

};

// =====================================================
// CONTROLE MICRO D'UN PARTICIPANT PAR L'ENSEIGNANT
// =====================================================
const controlParticipantMicrophone = (
  targetSocketId,
  enabled
) => {

  if (
    !isHost ||
    !conference ||
    !targetSocketId
  ) {
    return;
  }


  const finalState =
    Boolean(enabled);


  console.log(
    "🎤 CONTROLE MICRO PARTICIPANT :",
    targetSocketId,
    finalState
      ? "ACTIVER"
      : "COUPER"
  );


  // ===================================================
  // ENVOYER LA COMMANDE A L'ETUDIANT
  // ===================================================

  socket.emit(
    "participant:microphone",
    {

      roomId:
        conference._id,

      targetSocketId,

      enabled:
        finalState

    }
  );


  // ===================================================
  // MISE A JOUR IMMEDIATE DE L'INTERFACE
  // ===================================================

  setParticipantMediaStates(
    prev => ({

      ...prev,

      [targetSocketId]: {

        ...prev[
          targetSocketId
        ],

        microphone:
          finalState

      }

    })
  );

};


// =====================================================
// CONTROLE CAMERA D'UN PARTICIPANT PAR L'ENSEIGNANT
// =====================================================
const controlParticipantCamera = (
  targetSocketId,
  enabled
) => {

  if (
    !isHost ||
    !conference ||
    !targetSocketId
  ) {
    return;
  }


  const finalState =
    Boolean(enabled);


  console.log(
    "📹 CONTROLE CAMERA PARTICIPANT :",
    targetSocketId,
    finalState
      ? "ACTIVER"
      : "COUPER"
  );


  // ===================================================
  // ENVOYER LA COMMANDE A L'ETUDIANT
  // ===================================================

  socket.emit(
    "participant:camera",
    {

      roomId:
        conference._id,

      targetSocketId,

      enabled:
        finalState

    }
  );


  // ===================================================
  // MISE A JOUR IMMEDIATE DE L'INTERFACE
  // ===================================================

  setParticipantMediaStates(
    prev => ({

      ...prev,

      [targetSocketId]: {

        ...prev[
          targetSocketId
        ],

        camera:
          finalState

      }

    })
  );

};

// =====================================================
// CONTROLE PARTAGE ECRAN D'UN ETUDIANT
// =====================================================
const controlParticipantScreenShare = (
  targetSocketId,
  enabled
) => {

  if (!isHost) return;

  console.log(
    "🖥️ Contrôle partage écran :",
    targetSocketId,
    enabled
      ? "AUTORISER"
      : "INTERDIRE"
  );

  socket.emit(
    "participant:screenShare",
    {
      roomId: conference._id,
      targetSocketId,
      enabled
    }
  );

  setParticipantMediaStates(prev => ({

    ...prev,

    [targetSocketId]: {

      ...prev[targetSocketId],

      screenShare: Boolean(enabled)

    }

  }));

};

// =====================================================
// PARTAGE D'ECRAN
// =====================================================
const toggleScreenShare = async () => {

  if (conferenceEnded) {
    return;
  }

  // =====================================================
  // ETUDIANT : VERIFIER L'AUTORISATION
  // =====================================================
  if (
    !isHost &&
    user.role === "student" &&
    !screenShareAllowed
  ) {

    console.warn(
      "⚠️ Partage d'écran non autorisé."
    );

    return;
  }

  try {

    // ===================================================
    // DEMARRER LE PARTAGE
    // ===================================================
    if (!sharingScreen) {

      console.log(
        "🖥️ Démarrage du partage d'écran..."
      );

      const screenStream =
        await webrtcService.startScreenShare();

      if (!screenStream) {

        console.warn(
          "⚠️ Aucun flux d'écran obtenu."
        );

        return;
      }

      // -----------------------------------------------
      // L'ECRAN PARTAGE DEVIENT LE GRAND FLUX
      // -----------------------------------------------
      setMainStream(
        screenStream
      );

      setScreenShareOwner(
        socket.id
      );

      setSharingScreen(
        true
      );

      // -----------------------------------------------
      // INFORMER LES AUTRES PARTICIPANTS
      // -----------------------------------------------
      socket.emit(
        "participant:screenShareState",
        {
          roomId: conference._id,
          socketId: socket.id,
          enabled: true
        }
      );

      console.log(
        "✅ Partage d'écran démarré"
      );

      return;
    }


    // ===================================================
    // ARRETER LE PARTAGE
    // ===================================================

    console.log(
      "🛑 Arrêt du partage d'écran..."
    );

    await webrtcService.stopScreenShare();

    setSharingScreen(
      false
    );

    setScreenShareOwner(
      null
    );

    // -----------------------------------------------
    // INFORMER LES AUTRES
    // -----------------------------------------------
    socket.emit(
      "participant:screenShareState",
      {
        roomId: conference._id,
        socketId: socket.id,
        enabled: false
      }
    );

    // ===================================================
    // RESTAURER LE FLUX LOCAL
    //
    // Si je suis seul :
    //       ma caméra revient en grand.
    //
    // Si un participant est présent :
    //       son flux doit rester en grand.
    // ===================================================

    const remoteParticipant =
      participantsRef.current.find(
        participant =>
          participant.socketId !== socket.id
      );

    if (remoteParticipant) {

      const remoteStream =
        webrtcService.getRemoteStream(
          remoteParticipant.socketId
        );

      if (remoteStream) {

        setMainStream(
          remoteStream
        );

        const mediaState =
          participantMediaStatesRef.current[
            remoteParticipant.socketId
          ] || {};

        setMainParticipant({

          ...remoteParticipant,

          isLocal: false,

          cameraEnabled:
            Boolean(mediaState.camera)

        });

      }

    } else {

      // -----------------------------------------------
      // PERSONNE D'AUTRE DANS LA SALLE
      // -----------------------------------------------
      const localStream =
        webrtcService.getStream();

      setMainStream(
        localStream
      );

      setMainParticipant({

        socketId: socket.id,

        name:
          `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim() || "Vous",

        role: user.role,

        photo: user.photo,

        isLocal: true,

        cameraEnabled:
          webrtcService.cameraEnabled

      });

    }

    console.log(
      "✅ Partage d'écran arrêté"
    );

  }

  catch (error) {

    console.error(
      "❌ ERREUR PARTAGE D'ÉCRAN :",
      error
    );

    setSharingScreen(
      false
    );

    setScreenShareOwner(
      null
    );

  }

};


// =====================================================
// LEVER LA MAIN
// =====================================================
const toggleRaiseHand = () => {

  if (conferenceEnded) return;

  if (!handRaised) {

    socket.emit("hand:raise", {

      roomId: conference._id,

      user

    });

  } else {

    socket.emit("hand:lower", {

      roomId: conference._id

    });

  }

  setHandRaised(!handRaised);

};

// =====================================================
// TERMINER LA CONFERENCE
// =====================================================
const endConference = async () => {

  if (!conference) return;

  // -------------------------------------------------
  // Vérifier que celui qui termine est bien
  // celui qui a démarré la conférence
  // -------------------------------------------------

  if (!isConferenceStarter) {

      console.warn(
          "⚠️ Seul celui qui a démarré la conférence peut la terminer."
      );

      return;
  }

  try {

      console.log(
          "🔴 TERMINER LA CONFERENCE :",
          conference._id
      );

      // =================================================
      // TERMINER CÔTÉ BACKEND
      // =================================================

      await conferenceService.endConference(
          conference._id
      );

      // =================================================
      // INFORMER TOUS LES PARTICIPANTS
      // =================================================

      socket.emit(
          "conference:end",
          {
              roomId: conference._id
          }
      );

      console.log(
          "✅ Fin de conférence envoyée aux participants"
      );

      // =================================================
      // FERMER LA MODALE
      // =================================================

      setShowEndConfirm(false);

  }

  catch (error) {

      console.error(
          "❌ Erreur lors de la fin de la conférence :",
          error
      );

      alert(
          error?.response?.data?.message ||
          "Impossible de terminer la conférence."
      );

  }

};

// =====================================================
// QUITTER LA CONFERENCE
// =====================================================
const leaveConference = () => {

  socket.emit(

      "conference:leaveRoom",

      {

          roomId: conference._id,

          user

      }

  );

  webrtcService.destroy();

  navigate("/conference-room");

};


  if (loading) {

    return (
      <div className="h-screen flex items-center justify-center">

        <h2 className="text-2xl font-bold">
          Chargement de la conférence...
        </h2>

      </div>
    );

  }

  if (!conference) {

    return (
      <div className="h-screen flex items-center justify-center">

        <h2 className="text-2xl text-red-500 font-bold">
          Conférence introuvable.
        </h2>

      </div>
    );

  }

// =====================================================
// ECRAN DE FIN POUR L'ETUDIANT
// =====================================================
if (conferenceEnded) {

  return (

    <div
      className="
        fixed
        inset-0
        bg-gray-700
        flex
        items-center
        justify-center
        p-8
      "
    >

      <div
        className="
          w-full
          max-w-5xl
          flex
          flex-col
          items-center
        "
      >

        {/* ==========================================
            VIDEO DU PROFESSEUR
        ========================================== */}

        <div
          className="
            relative
            w-full
            max-w-4xl
            h-[500px]
            bg-gray-900
            rounded-3xl
            overflow-hidden
            shadow-2xl
            grayscale
          "
        >

          <MainVideo
            stream={mainStream}
            muted={true}
          />

          {/* VOILE GRIS */}

          <div
            className="
              absolute
              inset-0
              bg-black/30
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                bg-gray-900/90
                px-10
                py-7
                rounded-2xl
                text-center
                shadow-2xl
              "
            >

              <h2
                className="
                  text-white
                  text-3xl
                  font-bold
                "
              >
                Fin de la conférence
              </h2>

              <p
                className="
                  text-gray-300
                  mt-3
                  text-lg
                "
              >
                Cette conférence est maintenant terminée.
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            NOM DU PROFESSEUR
        ========================================== */}

        <h2
          className="
            text-white
            text-2xl
            font-bold
            mt-6
            text-center
          "
        >
          {conference.teacher?.name || "Administration"}
        </h2>

        <p
          className="
            text-gray-400
            mt-2
            text-center
          "
        >
          {conference.course?.title || "Conférence générale"}
        </p>

        {/* ==========================================
            BOUTON QUITTER
        ========================================== */}

        <button
          onClick={leaveConference}
          className="
            mt-8
            px-8
            py-3
            bg-red-500
            hover:bg-red-600
            text-white
            rounded-full
            font-semibold
            transition
          "
        >
          Quitter
        </button>

      </div>

    </div>

  );

}


  return (
      <>

{/* =====================================================
    MODALE CONFIRMATION FIN DE CONFERENCE
===================================================== */}
{showEndConfirm && (

<div
  className="
    fixed
    inset-0
    bg-black/60
    flex
    items-center
    justify-center
    z-[9999]
    p-6
  "
>

  <div
    className="
      bg-white
      w-full
      max-w-md
      rounded-3xl
      shadow-2xl
      p-8
      text-center
    "
  >

    {/* ICONE */}

    <div
      className="
        w-16
        h-16
        mx-auto
        rounded-full
        bg-red-100
        text-red-500
        flex
        items-center
        justify-center
        text-3xl
        mb-5
      "
    >
      <FaPhoneSlash />
    </div>

    {/* TITRE */}

    <h2
      className="
        text-2xl
        font-bold
        text-gray-800
      "
    >
      Terminer la conférence ?
    </h2>

    {/* MESSAGE */}

    <p
      className="
        text-gray-500
        mt-3
        leading-relaxed
      "
    >
      Voulez-vous vraiment terminer cette conférence ?
      <br />
      Tous les participants seront déconnectés de la session.
    </p>

    {/* BOUTONS */}

    <div
      className="
        flex
        gap-4
        mt-8
      "
    >

      {/* ANNULER */}

      <button
        onClick={() => setShowEndConfirm(false)}
        disabled={endingConference}
        className="
          flex-1
          py-3
          rounded-xl
          bg-gray-200
          text-gray-700
          font-semibold
          hover:bg-gray-300
          transition
          disabled:opacity-50
        "
      >
        Annuler
      </button>

      {/* CONFIRMER */}

      <button
        onClick={endConference}
        disabled={endingConference}
        className="
          flex-1
          py-3
          rounded-xl
          bg-red-500
          text-white
          font-semibold
          hover:bg-red-600
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        {endingConference
          ? "Terminaison..."
          : "Terminer"
        }

      </button>

    </div>

  </div>

</div>

)}

           {handNotification && isHost && (
              <div
                  className="
                      fixed
                      top-5
                      right-5
                      bg-yellow-400
                      text-black
                      px-5
                      py-3
                      rounded-xl
                      shadow-xl
                      z-[9999]
                      animate-bounce
                  "
              >
                  {handNotification.raised
                      ? `✋ ${handNotification.name} a levé la main`
                      : `🙋 ${handNotification.name} a baissé la main`}
              </div>
            )}

        <div className="h-screen bg-[#071326] flex flex-col">

{/* =====================================================
    HEADER
===================================================== */}

<div
  className="
    relative
    h-20
    bg-[#16233d]
    flex
    items-center
    justify-between
    px-6
    text-white
  "
>

  {/* ================================================
      BOUTON QUITTER
      Visible uniquement pour les participants
  ================================================= */}

  <div className="flex items-center">

    {!isConferenceStarter && (

      <button
        onClick={leaveConference}
        className="
          flex
          items-center
          gap-2
          hover:text-red-400
          transition
        "
      >
        <FaArrowLeft />
        Quitter
      </button>

    )}

  </div>


  {/* ================================================
      TITRE CENTRE
  ================================================= */}

  <div
    className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-1/2
      text-center
      whitespace-nowrap
    "
  >

    <h1 className="text-2xl font-bold">

      {conference.title}

    </h1>

    <p className="text-gray-300 text-sm">

    {conference.teacher?.name || "Administration"}

    </p>

  </div>


  {/* ================================================
      PARTICIPANTS
  ================================================= */}

  <div className="flex items-center gap-2">

    <FaUsers />

    <span>

      {participants.length} participants

    </span>

  </div>

</div>

      {/* CONTENU */}

      <div className="relative flex flex-1 min-h-0 overflow-hidden">

        {/* VIDEO */}
        <div className="flex-1 flex flex-col">

        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div
            className={`
              relative
              h-[min(68vh,620px)]
              w-[min(92%,1100px)]
              aspect-video
              bg-[#16233d]
              rounded-3xl
              overflow-hidden
              shadow-2xl
              flex
              flex-col
              items-center
              justify-center
              ${
                conferenceEnded
                ? "grayscale"
                : ""
              }
           `}
          >
{conferenceEnded ? (

// =====================================================
// CONFERENCE TERMINEE
// =====================================================
<>

  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700/80 z-30">

    <div className="w-full h-full absolute inset-0 flex items-center justify-center">

{mainStream &&
  mainParticipant?.cameraEnabled !== false ? (

    <MainVideo
        stream={mainStream}
        muted={isHost}
    />

  ) : (

    <div
        className="
            w-full
            h-full
            flex
            flex-col
            items-center
            justify-center
            bg-[#111827]
            text-white
        "
    >

        <div
            className="
                w-24
                h-24
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                text-4xl
                font-bold
            "
        >
            {(mainParticipant?.name || "P")
                .charAt(0)
                .toUpperCase()}
        </div>

        <span className="mt-4 text-lg font-semibold">
            {mainParticipant?.name || "Participant"}
        </span>

    </div>

)}

    </div>

    <div className="relative z-40 flex flex-col items-center justify-center">

      <div className="
        bg-gray-800/90
        px-8
        py-5
        rounded-2xl
        shadow-2xl
        text-center
      ">

        <h2 className="
          text-white
          text-3xl
          font-bold
        ">
          Fin de la conférence
        </h2>

        <p className="
          text-gray-300
          mt-2
        ">
          Cette conférence est maintenant terminée.
        </p>

      </div>

    </div>

  </div>

</>

) : (

  <>
{/* =====================================================
    ZONE VIDEO PRINCIPALE
    LOGIQUE TYPE GOOGLE MEET
===================================================== */}
<div className="absolute inset-0">

  {/* ===================================================
      FLUX PRINCIPAL
      - Si quelqu'un partage son écran → écran en grand
      - Sinon → participant distant en grand
      - Si personne n'est présent → moi en grand
      - Si caméra coupée → avatar
  =================================================== */}

  {mainStream ? (

    <MainVideo
      stream={mainStream}
      muted={mainParticipant?.isLocal === true}
    />

  ) : (

    <div
      className="
        absolute
        inset-0
        flex
        flex-col
        items-center
        justify-center
        bg-[#111827]
        text-white
      "
    >

      <div
        className="
          w-28
          h-28
          rounded-full
          bg-blue-600
          flex
          items-center
          justify-center
          text-4xl
          font-bold
        "
      >
        {(mainParticipant?.name || "P")
          .charAt(0)
          .toUpperCase()}
      </div>

      <span
        className="
          mt-4
          text-xl
          font-semibold
        "
      >
        {mainParticipant?.name ||
          "En attente d'un participant..."}
      </span>

    </div>

  )}


  {/* =====================================================
      MINIATURES
      -----------------------------------------------------
      La miniature représente TOUJOURS ma propre caméra
      lorsqu'un participant distant est présent.

      Exemple :
      PC professeur :
        GRAND  → étudiant
        PETIT  → professeur

      Téléphone étudiant :
        GRAND  → professeur
        PETIT  → étudiant
  ===================================================== */}

  <div
    className="
      absolute
      bottom-5
      right-5
      z-30
      flex
      flex-col
      gap-3
    "
  >

    {thumbnailStreams
      .filter(Boolean)
      .map((item) => {

        /* =================================================
           IMPORTANT :
           Si cette miniature correspond actuellement
           au flux principal, on ne l'affiche pas ici.
        ================================================= */

        if (
          item.socketId ===
          mainParticipant?.socketId
        ) {
          return null;
        }

        const mediaState =
          participantMediaStates[
            item.socketId
          ] || {};

        const cameraEnabled =
          item.isLocal
            ? camOn
            : Boolean(
                mediaState.camera ??
                item.cameraEnabled
              );

        const participantName =
          item.isLocal
            ? "Vous"
            : (
                item.participant?.name ||
                "Participant"
              );

        const avatarName =
          item.isLocal
            ? (
                `${user.firstName || ""} ${
                  user.lastName || ""
                }`.trim() || "Vous"
              )
            : participantName;

        return (

          <div
            key={item.socketId}
            className="
              relative
              w-48
              h-32
              rounded-2xl
              overflow-hidden
              bg-[#111827]
              border
              border-white/30
              shadow-2xl
            "
          >

            {/* =========================================
                CAMERA ACTIVE
            ========================================= */}

            {item.stream && cameraEnabled ? (

              <video
                ref={(element) => {

                  if (!element) {
                    return;
                  }

                  if (
                    element.srcObject !==
                    item.stream
                  ) {

                    element.srcObject =
                      item.stream;

                  }

                  element
                    .play()
                    .catch(() => {});

                }}
                autoPlay
                playsInline
                muted={item.isLocal}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              /* =======================================
                 CAMERA DESACTIVEE
                 → AVATAR
              ======================================= */

              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-[#111827]
                  text-white
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-blue-600
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-bold
                  "
                >
                  {avatarName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <span
                  className="
                    mt-2
                    text-sm
                    font-medium
                  "
                >
                  {participantName}
                </span>

              </div>

            )}

            {/* =========================================
                NOM
            ========================================= */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                z-20
                bg-black/60
                text-white
                text-xs
                font-semibold
                px-3
                py-2
                truncate
              "
            >
              {participantName}
            </div>

          </div>

        );

      })}

  </div>


  {/* =====================================================
      NOM DU PARTICIPANT PRINCIPAL
  ===================================================== */}

  <h2
    className="
      absolute
      bottom-20
      left-1/2
      -translate-x-1/2
      z-20
      text-white
      text-2xl
      font-bold
      text-center
      drop-shadow-lg
    "
  >

    {screenShareOwner ? (

      screenShareOwner === socket.id

        ? "Vous partagez votre écran"

        : (
            `${mainParticipant?.name || "Participant"} partage son écran`
          )

    ) : (

      mainParticipant?.name ||
      conference.teacher?.name ||
      "Administration"

    )}

  </h2>


  {/* =====================================================
      COURS
  ===================================================== */}

  <p
    className="
      absolute
      bottom-12
      left-1/2
      -translate-x-1/2
      z-20
      text-gray-300
      text-sm
      text-center
      drop-shadow-lg
    "
  >
    {conference.course?.title ||
      "Conférence générale"}
  </p>


  {/* =====================================================
      EN DIRECT
  ===================================================== */}

  <span
    className="
      absolute
      top-5
      left-5
      z-20
      bg-red-500
      text-white
      px-4
      py-2
      rounded-full
      animate-pulse
      text-sm
      font-semibold
    "
  >
    🔴 EN DIRECT
  </span>

</div>

  </>

  )}
         </div>

          </div>

          {/* CONTROLES */}
          <div
            className="
              shrink-0
              min-h-[88px]
              h-24
              bg-[#16233d]
              flex
              justify-center
              items-center
              gap-4
              px-4
            "
          >

            <button
              onClick={toggleMicrophone}
              className="
              w-14
              h-14
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              hover:scale-110
              transition
              "
            >
              {
                micOn
                  ? <FaMicrophone />
                  : <FaMicrophoneSlash />
              }
            </button>

            <button
              onClick={toggleCamera}
              className="
              w-14
              h-14
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              hover:scale-110
              transition
              "
            >
              {
                camOn
                  ? <FaVideo />
                  : <FaVideoSlash />
              }
            </button>

            <button
              onClick={toggleScreenShare}
              disabled={
                conferenceEnded ||
                (!isHost && !screenShareAllowed)
              }
              title={
                !isHost && !screenShareAllowed
                  ? "Le partage d'écran doit être autorisé par l'hôte"
                  : sharingScreen
                    ? "Arrêter le partage d'écran"
                    : "Partager l'écran"
              }
              className={`
                w-14
                h-14
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                hover:scale-110
                transition
                ${
                  !isHost && !screenShareAllowed
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : sharingScreen
                      ? "bg-green-500 text-white hover:scale-110"
                      : "bg-white hover:scale-110"
                }
              `}
            >
               <FaDesktop />
            </button>

            {/* DISCUSSION */}
            <button
              onClick={() => setShowSidebar(prev => !prev)}
              title={
                showSidebar
                  ? "Fermer la discussion"
                  : "Ouvrir la discussion"
              }
              aria-label={
                showSidebar
                  ? "Fermer la discussion"
                  : "Ouvrir la discussion"
              }
              className={`
                w-14
                h-14
                rounded-full
                flex
                items-center
                justify-center
                hover:scale-110
                transition
                ${
                  showSidebar
                    ? "bg-[#7c3aed] text-white"
                    : "bg-white text-gray-800"
                }
              `}
            >
              <FaComments />
            </button>

            {!isHost && (
              <button
                onClick={toggleRaiseHand}
                className={`
                  w-14
                  h-14
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition
                  hover:scale-110
                  ${
                    handRaised
                    ? "bg-yellow-500 text-white"
                    : "bg-white"
                  }
               `}
              >
                <FaHandPaper />
              </button>
               )}

{/* =====================================================
    CONTROLES GLOBAUX ENSEIGNANT
===================================================== */}
{isHost && (

<>

  {/* MICRO GLOBAL */}

  <button
    onClick={toggleAllStudentsMicrophone}
    title={
      allStudentsMicOn
        ? "Couper les micros des étudiants"
        : "Activer les micros des étudiants"
    }
    className={`
      px-4
      h-12
      rounded-full
      flex
      items-center
      gap-2
      transition
      font-semibold
      ${
        allStudentsMicOn
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }
    `}
  >

    {allStudentsMicOn
      ? <FaMicrophoneSlash />
      : <FaMicrophone />
    }

    <span>
      {allStudentsMicOn
        ? "Couper les micros"
        : "Activer les micros"
      }
    </span>

  </button>


  {/* CAMERA GLOBALE */}
  <button
    onClick={toggleAllStudentsCamera}
    title={
      allStudentsCamOn
        ? "Couper les caméras des étudiants"
        : "Activer les caméras des étudiants"
    }
    className={`
      px-4
      h-12
      rounded-full
      flex
      items-center
      gap-2
      transition
      font-semibold
      ${
        allStudentsCamOn
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }
    `}
  >

    {allStudentsCamOn
      ? <FaVideoSlash />
      : <FaVideo />
    }

    <span>
      {allStudentsCamOn
        ? "Couper les caméras"
        : "Activer les caméras"
      }
    </span>

  </button>

</>

)}

{isConferenceStarter ? (
<button
  onClick={() => setShowEndConfirm(true)}
  disabled={endingConference}
  className="
    px-6
    py-3
    bg-red-500
    text-white
    rounded-full
    flex
    items-center
    gap-2
    hover:bg-red-600
    transition
    font-semibold
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  <FaPhoneSlash />

  {endingConference
    ? "Terminaison..."
    : "Terminer"
  }

</button>

) : (

<button
  onClick={leaveConference}
  className="
    px-6
    py-3
    bg-red-500
    text-white
    rounded-full
    flex
    items-center
    gap-2
    hover:bg-red-600
    transition
  "
>
  <FaPhoneSlash />
  Quitter
</button>

)}

          </div>

        </div>

        {/* =====================================================
            PANNEAU DISCUSSION / PARTICIPANTS
            Caché par défaut et coulissant depuis la droite.
            Il ne réduit pas la zone vidéo lorsqu'il est fermé.
        ===================================================== */}

        {/* Fond cliquable sur petit écran */}
        {showSidebar && (
          <button
            type="button"
            aria-label="Fermer la discussion"
            onClick={() => setShowSidebar(false)}
            className="
              absolute
              inset-0
              bg-black/20
              z-40
              md:hidden
            "
          />
        )}

        <aside
          className={`
            absolute
            top-0
            right-0
            bottom-0
            z-50
            w-full
            max-w-[380px]
            bg-white
            border-l
            border-gray-200
            flex
            flex-col
            shadow-2xl
            transition-transform
            duration-300
            ease-in-out
            ${
              showSidebar
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >

          {/* CHAT HEADER */}
          <div className="p-5 border-b flex items-center justify-between shrink-0">

            <h2 className="font-bold text-lg">
              Discussion
            </h2>

            <button
              type="button"
              onClick={() => setShowSidebar(false)}
              title="Fermer"
              aria-label="Fermer la discussion"
              className="
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-800
                transition
              "
            >
              <FaTimes />
            </button>

          </div>

          {/* CHAT */}
          <div
            className="
            flex-1
            min-h-0
            overflow-y-auto
            p-4
            space-y-4
            "
          >

            {
              messages.map((msg, index) => (

                <div key={index}>

                  <p className="font-semibold">

                    {msg.sender.firstName} {msg.sender.lastName}

                  </p>

                  <p className="text-xs text-gray-500">

                    {msg.sender.role}

                  </p>

                  <div
                    className="
                    bg-gray-100
                    p-3
                    rounded-xl
                    mt-1
                    "
                  >
                  {msg.message}
                  </div>

                </div>

              ))
            }

          </div>

          {/* ENVOI MESSAGE */}
          <div
            className="
            p-4
            border-t
            flex
            gap-2
            "
          >

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Votre message..."
              className="
              flex-1
              border
              rounded-xl
              px-3
              py-2
              outline-none
              "
            />

            <button
              onClick={sendMessage}
              className="
              bg-[#071326]
              text-white
              px-4
              rounded-xl
              "
            >
              <FaPaperPlane />
            </button>

          </div>

          {/* PARTICIPANTS */}
          <div className="border-t p-5">

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold mb-4">
              Participants ({participants.length})
            </h2>

            {isHost && raisedHands.length > 0 && (              <span
                className="
                  bg-yellow-400
                  text-black
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                "
              >
              ✋ {raisedHands.length}
              </span>
            )}
          </div>

<div className="space-y-3">

{participants.map((participant) => {

const mediaState =
  participantMediaStates[participant.socketId] || {
    microphone: false,
    camera: false
  };

  return (
    <div
      key={participant.socketId}
      className="
        flex
        items-center
        justify-between
        gap-3
        p-2
        rounded-xl
        hover:bg-gray-50
      "
    >

{/* INFORMATIONS PARTICIPANT */}
<div className="flex items-center gap-3 min-w-0">

  <div
    className="
      w-10
      h-10
      rounded-full
      bg-gray-200
      flex
      items-center
      justify-center
      overflow-hidden
      flex-shrink-0
    "
  >
    {participant.photo ? (
      <img
        src={participant.photo}
        alt={`${participant.name || ""}`}
        className="w-full h-full object-cover"
      />
    ) : (
      <FaUsers className="text-gray-500" />
    )}
  </div>

  <div className="min-w-0">

    <p className="font-semibold text-gray-800 truncate">
      {participant.name}
    </p>

    <p className="text-xs text-gray-500 capitalize">
      {participant.role}
    </p>

  </div>

</div>

      {/* CONTROLES ENSEIGNANT */}
    {isHost &&
        participant.socketId !== socket.id && (

        <div className="flex items-center gap-1">

          {/* bouton micro */}
<button
  onClick={() =>
    controlParticipantMicrophone(
      participant.socketId,
      !mediaState.microphone
    )
  }
  title={
    mediaState.microphone
      ? "Couper le micro"
      : "Activer le micro"
  }
  className={`
    w-8
    h-8
    rounded-full
    flex
    items-center
    justify-center
    transition
    ${
      mediaState.microphone
        ? "bg-green-100 text-green-600 hover:bg-green-200"
        : "bg-red-100 text-red-600 hover:bg-red-200"
    }
  `}
>
  {mediaState.microphone
    ? <FaMicrophone size={13} />
    : <FaMicrophoneSlash size={13} />
  }
</button>

          {/* bouton caméra */}
<button
  onClick={() =>
    controlParticipantCamera(
      participant.socketId,
      !mediaState.camera
    )
  }
  title={
    mediaState.camera
      ? "Couper la caméra"
      : "Activer la caméra"
  }
  className={`
    w-8
    h-8
    rounded-full
    flex
    items-center
    justify-center
    transition
    ${
      mediaState.camera
        ? "bg-green-100 text-green-600 hover:bg-green-200"
        : "bg-red-100 text-red-600 hover:bg-red-200"
    }
  `}
>
  {mediaState.camera
    ? <FaVideo size={13} />
    : <FaVideoSlash size={13} />
  }
</button>

        </div>

      )}

      {/* AUTORISATION PARTAGE ECRAN */}
{isHost &&
      participant.socketId !== socket.id &&
      participant.role === "student" && (

  <button
    onClick={() =>
      controlParticipantScreenShare(
        participant.socketId,
        !mediaState.screenShare
      )
    }
    title={
      mediaState.screenShare
        ? "Interdire le partage d'écran"
        : "Autoriser le partage d'écran"
    }
    className={`
      w-8
      h-8
      rounded-full
      flex
      items-center
      justify-center
      transition

      ${
        mediaState.screenShare
          ? "bg-green-100 text-green-600 hover:bg-green-200"
          : "bg-red-100 text-red-600 hover:bg-red-200"
      }
    `}
  >
    <FaDesktop size={13} />
  </button>

)}

    </div>
  );

})}
            </div>
          </div>
        </aside>
        </div>
        </div>
        </>
   );
}

export default ConferenceLive
