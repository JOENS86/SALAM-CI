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
import RemoteVideo from "../../components/conference/RemoteVideo";
import MainVideo from "../../components/conference/MainVideo";


function ConferenceLive() {

  const navigate = useNavigate();

  const { id } = useParams();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [conference, setConference] = useState(null);

// =====================================================
// ETAT DE FIN DE CONFERENCE
// =====================================================
  const [conferenceEnded, setConferenceEnded] = useState(false);

  const [participants, setParticipants] = useState([]);

// =====================================================
// ETATS DES PARTICIPANTS
// =====================================================
const [participantMediaStates, setParticipantMediaStates] = useState({});

  const [loading, setLoading] = useState(true);

  const [micOn, setMicOn] = useState(true);

  const [camOn, setCamOn] = useState(true);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);

  const [handNotification, setHandNotification] = useState(null);

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endingConference, setEndingConference] = useState(false);

  // =====================================================
  // PANNEAU DISCUSSION / PARTICIPANTS
  // Caché par défaut et affiché avec une animation latérale
  // =====================================================
  const [showSidebar, setShowSidebar] = useState(false);

// =====================================================
// FLUX PRINCIPAL
// =====================================================
const [mainStream, setMainStream] = useState(null);

// =====================================================
// MINIATURES
// =====================================================
const [thumbnailStreams, setThumbnailStreams] = useState([]);


// =====================================================
// ROLE UTILISATEUR
// =====================================================
const isTeacher = user.role === "teacher";
const isAdmin = user.role === "admin";

// =====================================================
// VERIFIER SI L'UTILISATEUR A DEMARRE LA CONFERENCE
// =====================================================
const isConferenceStarter = conference?.startedBy &&
  String(
    conference.startedBy?._id ||
    conference.startedBy
  ) === String(user._id);

// =====================================================
// HOTE DE LA CONFERENCE
// =====================================================
const isHost =
  Boolean(isConferenceStarter) &&
  (isTeacher || isAdmin);


// =====================================================
// PARTAGE D'ECRAN
// =====================================================
const [sharingScreen, setSharingScreen] = useState(false);

// =====================================================
// MICRO CAMERA GLOBAL
// =====================================================
const [allStudentsMicOn, setAllStudentsMicOn] = useState(false);
const [allStudentsCamOn, setAllStudentsCamOn] = useState(false);

  // =====================================================
  // CHARGER LA CONFERENCE
  // =====================================================
  const loadConference = async () => {

    try {

      setLoading(true);

      const result = await conferenceService.getConferenceById(id);

      setConference(result.conference);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadConference();

  }, [id]);


// =====================================================
// SOCKET.IO + WEBRTC
// =====================================================
useEffect(() => {

  if (!conference) return;

  let mounted = true;

  // ==========================================
  // INITIALISATION CAMERA
  // ==========================================
  const initConference = async () => {

      try {

    const stream =
    await webrtcService.startLocalStream();

    if (!mounted) return;

    // =====================================================
    // ETAT INITIAL DES MEDIAS
    // =====================================================

    if (isHost) {

        // Le professeur démarre avec
        // micro + caméra activés

        webrtcService.setMicrophoneEnabled(true);
        webrtcService.setCameraEnabled(true);

        setMicOn(true);
        setCamOn(true);

    } else {

        // L'étudiant démarre avec
        // micro + caméra désactivés

        webrtcService.setMicrophoneEnabled(false);
        webrtcService.setCameraEnabled(false);

        setMicOn(false);
        setCamOn(false);

    }

    setMainStream(stream);

      }

      catch (error) {

          console.error(error);

      }

  };

  initConference();

// ==========================================
// CALLBACK REMOTE STREAM
// ==========================================
webrtcService.setRemoteStreamCallback((socketId, stream) => {

  console.log(
    "📹 Flux distant reçu :",
    socketId
  );

  // =====================================================
  // LA VIDEO DE L'AUTRE PARTICIPANT
  // DEVIENT LA VIDEO PRINCIPALE
  // =====================================================

  setMainStream(stream);

  // =====================================================
  // MA CAMERA RESTE EN MINIATURE
  // =====================================================

  const localStream = webrtcService.getStream();

  if (!localStream) return;

  setThumbnailStreams(prev => {

    const localSocketId = socket.id;

    const exists = prev.some(
      item => item.socketId === localSocketId
    );

    if (exists) {

      return prev.map(item => {

        if (item.socketId !== localSocketId) {
          return item;
        }

        return {
          ...item,
          stream: localStream
        };

      });

    }

    return [
      ...prev,
      {
        socketId: localSocketId,
        stream: localStream,
        participant: {
          socketId: localSocketId,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Vous"
        },
        isLocal: true
      }
    ];

  });

});


  // ====================================
  // Fin du Partage d'écran
  //=====================================
  webrtcService.setScreenShareEndedCallback(() => {

    console.log("Partage écran terminé");

    setSharingScreen(false);

    setMainStream(
        webrtcService.getStream()
    );

});

  // ==========================================
  // ICE CALLBACK
  // ==========================================
  webrtcService.setIceCandidateCallback(

      (socketId, candidate) => {

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

  // ==========================================
  // REJOINDRE LA SALLE
  // ==========================================
  socket.emit(

      "conference:joinRoom",

      {

          roomId: conference._id,

          user

      }

  );

  // ==========================================
  // CHAT
  // ==========================================
  socket.emit(

      "chat:getHistory",

      conference._id

  );

  // ==========================================
  // PARTICIPANTS
  // ==========================================
  socket.on(

      "conference:participants",

      ({ participants }) => {

          setParticipants(participants);

      }

  );

  // =====================================================
// ETAT MICRO / CAMERA DES PARTICIPANTS
// =====================================================
socket.on(
  "participant:mediaState",
  ({
    socketId,
    microphone,
    camera
  }) => {

    if (!socketId) return;

    setParticipantMediaStates(prev => ({

      ...prev,

      [socketId]: {

        ...prev[socketId],

        microphone: Boolean(microphone),

        camera: Boolean(camera)

      }

    }));

  }
);

  // ==========================================
  // HISTORIQUE CHAT
  // ==========================================
  socket.on(

      "chat:history",

      history => {

          setMessages(history);

      }

  );

  // ==========================================
  // NOUVEAU MESSAGE
  // ==========================================
  socket.on(

      "chat:newMessage",

      message => {

          setMessages(prev => [

              ...prev,

              message

          ]);

      }

  );

  // ==========================================
  // NOUVEAU PARTICIPANT
  // ==========================================
  socket.on(

      "conference:userJoined",

      async ({ participant }) => {

          if (participant.socketId === socket.id) return;

          if (!isHost) return;

          try {

              if (

                  webrtcService.hasPeerConnection(

                      participant.socketId

                  )

              ) return;

              webrtcService.createPeerConnection(

                  participant.socketId

              );

              const offer = await webrtcService.createOffer(

                  participant.socketId

              );

              socket.emit(

                  "webrtc:offer",

                  {

                      roomId: conference._id,

                      sender: socket.id,

                      target: participant.socketId,

                      offer

                  }

              );

          }

          catch (error) {

              console.error(error);

          }

      }

  );

  // ==========================================
  // PARTICIPANT PARTI
  // ==========================================
  socket.on(

      "conference:userLeft",

      ({ participant }) => {

          webrtcService.closePeerConnection(

              participant.socketId

          );

        setThumbnailStreams(prev =>

            prev.filter(

                item =>

                    item.socketId !== participant.socketId

            )

        );

      }

  );

  // ==========================================
  // OFFER
  // ==========================================
  socket.on(

      "webrtc:offer",

      async ({ sender, offer }) => {

          if (sender === socket.id) return;

          try {

              const answer =

                  await webrtcService.handleOffer(

                      sender,

                      offer

                  );

              socket.emit(

                  "webrtc:answer",

                  {

                      roomId: conference._id,

                      sender: socket.id,

                      target: sender,

                      answer

                  }

              );

          }

          catch (error) {

              console.error(error);

          }

      }

  );

  // ==========================================
  // ANSWER
  // ==========================================
  socket.on(

      "webrtc:answer",

      async ({ sender, answer }) => {

          if (sender === socket.id) return;

          await webrtcService.handleAnswer(

              sender,

              answer

          );

      }

  );

  // ==========================================
  // ICE
  // ==========================================
  socket.on(

      "webrtc:iceCandidate",

      async ({ sender, candidate }) => {

          if (sender === socket.id) return;

          await webrtcService.addIceCandidate(

              sender,

              candidate

          );

      }

  );


// ==========================================
// CONTROLE MICRO PAR L'ENSEIGNANT
// ==========================================
socket.on(
  "participant:microphone",
  ({ enabled }) => {

      console.log(
          "🎤 Commande micro reçue :",
          enabled ? "ACTIVER" : "COUPER"
      );

      const result =
          webrtcService.setMicrophoneEnabled(enabled);

      const finalState = Boolean(result);

      setMicOn(finalState);

      // Informer le serveur de l'état réellement appliqué
      if (conference) {

          socket.emit(
              "participant:microphone",
              {
                  roomId: conference._id,
                  enabled: finalState
              }
          );

      }

  }
);

// ==========================================
// CONTROLE CAMERA PAR L'ENSEIGNANT
// ==========================================
socket.on(
  "participant:camera",
  ({ enabled }) => {

      console.log(
          "📹 Commande caméra reçue :",
          enabled ? "ACTIVER" : "COUPER"
      );

      const result =
          webrtcService.setCameraEnabled(enabled);

      const finalState = Boolean(result);

      setCamOn(finalState);

      // Informer le serveur de l'état réellement appliqué
      if (conference) {

          socket.emit(
              "participant:camera",
              {
                  roomId: conference._id,
                  enabled: finalState
              }
          );

      }

  }
);


// =====================================================
// CONTROLE GLOBAL MICRO PAR L'ENSEIGNANT
// =====================================================
socket.on(
  "teacher:microphone:all",
  ({ enabled }) => {

      console.log(
          "🎤 Commande globale micro reçue :",
          enabled ? "ACTIVER" : "COUPER"
      );

      // ------------------------------------------
      // Appliquer uniquement aux étudiants
      // ------------------------------------------

      if (!isTeacher) {

          const result =
              webrtcService.setMicrophoneEnabled(
                  enabled
              );

          setMicOn(Boolean(result));

          console.log(
              "🎤 Micro étudiant :",
              result ? "ACTIVÉ" : "COUPÉ"
          );
      }

  }
);


// =====================================================
// CONTROLE GLOBAL CAMERA PAR L'ENSEIGNANT
// =====================================================

socket.on(
  "teacher:camera:all",
  ({ enabled }) => {

      console.log(
          "📹 Commande globale caméra reçue :",
          enabled ? "ACTIVER" : "COUPER"
      );

      // ------------------------------------------
      // Appliquer uniquement aux étudiants
      // ------------------------------------------

      if (!isTeacher) {

          const result =
              webrtcService.setCameraEnabled(
                  enabled
              );

          setCamOn(Boolean(result));

          console.log(
              "📹 Caméra étudiant :",
              result ? "ACTIVÉE" : "COUPÉE"
          );
      }

  }
);

   // ==========================================
  // LEVER LA MAIN
  // ==========================================
  socket.on("hand:list", (hands) => {
    setRaisedHands(hands);
});


   // ==========================================
  // Notification LEVER LA MAIN
  // ==========================================
  socket.on("hand:notification", ({ name, raised }) => {

    // Seul l'hôte reçoit visuellement la notification
    if (!isHost) return;

    setHandNotification({
      name,
      raised
    });

    setTimeout(() => {

      setHandNotification(null);

    }, 4000);

  });


// =====================================================
// CONFERENCE TERMINEE PAR LE CREATEUR
// =====================================================
socket.on(
  "conference:ended",
  ({ conference: endedConference } = {}) => {

    console.log(
      "🔴 CONFERENCE TERMINEE"
    );

    // =================================================
    // TOUS LES UTILISATEURS RESTENT SUR LA PAGE
    // ET AFFICHENT L'ECRAN DE FIN
    // =================================================

    setConferenceEnded(true);

    // =================================================
    // METTRE A JOUR LA CONFERENCE SI ELLE EST FOURNIE
    // =================================================

    if (endedConference) {

      setConference(endedConference);

    }

    // =================================================
    // DESACTIVER LE MICRO
    // =================================================

    webrtcService.setMicrophoneEnabled(false);

    setMicOn(false);

    // =================================================
    // DESACTIVER LA CAMERA
    // =================================================

    webrtcService.setCameraEnabled(false);

    setCamOn(false);

    // =================================================
    // ARRETER LE PARTAGE D'ECRAN
    // =================================================

    setSharingScreen(false);

    // =================================================
    // BAISSER LA MAIN
    // =================================================

    setHandRaised(false);

    // =================================================
    // NETTOYER LES MINIATURES
    // =================================================

    setThumbnailStreams([]);

    console.log(
      "✅ Ecran de fin affiché pour",
      user.role === "admin"
        ? "l'administrateur"
        : user.role === "teacher"
        ? "l'enseignant"
        : "l'étudiant"
    );

  }
);

  // ==========================================
  // CLEANUP
  // ==========================================
  return () => {

    mounted = false;

    setThumbnailStreams([]);

    socket.off("conference:participants");
    socket.off("conference:userJoined");
    socket.off("conference:userLeft");
    socket.off("chat:history");
    socket.off("chat:newMessage");
    socket.off("webrtc:offer");
    socket.off("webrtc:answer");
    socket.off("webrtc:iceCandidate");
    socket.off("participant:microphone");
    socket.off("participant:camera");
    socket.off("participant:mediaState");
    socket.off("teacher:microphone:all");
    socket.off("teacher:camera:all");
    socket.off("hand:list");
    socket.off("hand:notification");
    socket.off("conference:ended");

};

}, [conference, isTeacher]);


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
// MICRO
// =====================================================
const toggleMicrophone = () => {

  if (conferenceEnded) return;

  const enabled =
    webrtcService.toggleMicrophone();

  setMicOn(Boolean(enabled));

  if (conference) {

    socket.emit(
      "participant:microphone",
      {
        roomId: conference._id,
        enabled: Boolean(enabled)
      }
    );

  }

};


// =====================================================
// CAMERA
// =====================================================
const toggleCamera = () => {

  if (conferenceEnded) return;

  const enabled =
    webrtcService.toggleCamera();

  setCamOn(Boolean(enabled));

  if (conference) {

    socket.emit(
      "participant:camera",
      {
        roomId: conference._id,
        enabled: Boolean(enabled)
      }
    );

  }

};

// =====================================================
// CONTROLE GLOBAL MICRO DES ETUDIANTS
// =====================================================
const toggleAllStudentsMicrophone = () => {

  if (!isHost || !conference) return;

  // Inverser l'état global
  const enabled = !allStudentsMicOn;

  console.log(
    "🎤 CONTROLE GLOBAL MICRO :",
    enabled ? "ACTIVER TOUS LES ETUDIANTS" : "COUPER TOUS LES ETUDIANTS"
  );


  // =====================================================
  // ENVOYER LA COMMANDE AU SERVEUR
  // =====================================================

  socket.emit(
    "teacher:microphone:all",
    {
      roomId: conference._id,
      enabled
    }
  );


  // =====================================================
  // METTRE À JOUR L'ÉTAT DU BOUTON
  // =====================================================

  setAllStudentsMicOn(enabled);


  // =====================================================
  // METTRE À JOUR L'AFFICHAGE DES PARTICIPANTS
  // =====================================================

  setParticipantMediaStates(prev => {

    const updated = { ...prev };

    participants.forEach(participant => {

      // -----------------------------------------------
      // UNIQUEMENT LES ÉTUDIANTS
      // -----------------------------------------------

      if (
        participant.socketId !== socket.id &&
        participant.role === "student"
      ) {

        updated[participant.socketId] = {

          ...updated[participant.socketId],

          microphone: enabled

        };

      }

    });

    return updated;

  });

};


// =====================================================
// CONTROLE GLOBAL CAMERA DES ETUDIANTS
// =====================================================
const toggleAllStudentsCamera = () => {

  if (!isHost || !conference) return;

  // Inverser l'état global
  const enabled = !allStudentsCamOn;

  console.log(
    "📹 CONTROLE GLOBAL CAMERA :",
    enabled ? "ACTIVER TOUTES LES CAMERAS" : "COUPER TOUTES LES CAMERAS"
  );


  // =====================================================
  // ENVOYER LA COMMANDE AU SERVEUR
  // =====================================================

  socket.emit(
    "teacher:camera:all",
    {
      roomId: conference._id,
      enabled
    }
  );


  // =====================================================
  // METTRE À JOUR L'ÉTAT DU BOUTON
  // =====================================================

  setAllStudentsCamOn(enabled);


  // =====================================================
  // METTRE À JOUR L'AFFICHAGE DES PARTICIPANTS
  // =====================================================

  setParticipantMediaStates(prev => {

    const updated = { ...prev };

    participants.forEach(participant => {

      // -----------------------------------------------
      // UNIQUEMENT LES ÉTUDIANTS
      // -----------------------------------------------

      if (
        participant.socketId !== socket.id &&
        participant.role === "student"
      ) {

        updated[participant.socketId] = {

          ...updated[participant.socketId],

          camera: enabled

        };

      }

    });

    return updated;

  });

};

// =====================================================
// CONTROLE MICRO D'UN PARTICIPANT PAR L'ENSEIGNANT
// =====================================================
const controlParticipantMicrophone = (
  targetSocketId,
  enabled
) => {

  if (!isHost) return;

  console.log(
    "🎤 Contrôle micro participant :",
    targetSocketId,
    enabled ? "ACTIVER" : "COUPER"
  );

  socket.emit(
    "participant:microphone",
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
      microphone: enabled
    }
  }));

};
// =====================================================
// CONTROLE CAMERA D'UN PARTICIPANT PAR L'ENSEIGNANT
// =====================================================
const controlParticipantCamera = (
  targetSocketId,
  enabled
) => {

  if (!isHost) return;

  console.log(
    "📹 Contrôle caméra participant :",
    targetSocketId,
    enabled ? "ACTIVER" : "COUPER"
  );

  socket.emit(
    "participant:camera",
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
      camera: enabled
    }
  }));

};

// =====================================================
// PARTAGE D'ECRAN
// =====================================================
const toggleScreenShare = async () => {

  if (conferenceEnded) return;

  try {

    if (!sharingScreen) {

      const stream =
        await webrtcService.startScreenShare();

      if (!stream) return;

      if (isHost) {

        setMainStream(stream);

      }

      setSharingScreen(true);

      return;
    }

    webrtcService.stopScreenShare();

    if (isHost) {

      setMainStream(
        webrtcService.getStream()
      );

    }

    setSharingScreen(false);

  }

  catch (error) {

    console.error(
      "Erreur partage écran :",
      error
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

      <MainVideo
        stream={mainStream}
        muted={isHost}
      />

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

// =====================================================
// CONFERENCE EN DIRECT
// =====================================================
<>

  <MainVideo
    stream={mainStream}
    muted={isHost}
  />

  <div
    className="
      absolute
      bottom-5
      right-5
      flex
      flex-col
      gap-4
    "
  >

    {thumbnailStreams.map((item) => (
<RemoteVideo
    key={item.socketId}
    stream={item.stream}
    name={
        item.isLocal
            ? "Vous"
            : item.participant?.name
    }
    muted={item.isLocal}
    cameraEnabled={
        item.isLocal
            ? camOn
            : (
                participantMediaStates[item.socketId]?.camera
                ?? false
            )
    }
/>
    ))}

  </div>

{/* NOM DU PROFESSEUR */}
  <h2 className="
    text-white
    text-2xl
    font-bold
    mt-3
    text-center
  ">
{conference.teacher?.name || "Administration"}
  </h2>

{/* COURS */}
  <p className="
    text-gray-300
    text-base
    mt-2
    mb-4
    text-center
  ">
{conference.course?.title || "Conférence générale"}
  </p>

  <span className="
    mt-6
    bg-red-500
    text-white
    px-4
    py-2
    rounded-full
    animate-pulse
  ">
    🔴 EN DIRECT
  </span>

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
              title={
                sharingScreen
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
                  sharingScreen
                    ? "bg-green-500 text-white"
                    : "bg-white"
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
