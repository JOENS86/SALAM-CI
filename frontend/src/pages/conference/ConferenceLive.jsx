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
  FaDesktop
} from "react-icons/fa";

import {useNavigate, useParams} from "react-router-dom";
import conferenceService from "../../services/conferenceService";
import socket from "../../socket/socket";
import webrtcService from "../../services/webrtcService";

function ConferenceLive() {

  const navigate = useNavigate();

  const { id } = useParams();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [conference, setConference] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [micOn, setMicOn] = useState(true);

  const [camOn, setCamOn] = useState(true);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const remoteVideoRef = useRef(null);

  const localVideoRef = useRef(null);
  
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
// SOCKET.IO
// =====================================================
useEffect(() => {

  if (!conference) return;

  socket.emit(
      "conference:joinRoom",
      {
          roomId: conference._id,
          user
      }
  );

  socket.on(
      "conference:participants",
      ({ participants }) => {

          setParticipants(participants);

      }
  );

// =====================================================
// UN NOUVEAU PARTICIPANT REJOINT
// =====================================================
socket.on(

  "conference:userJoined",

  async ({ participant }) => {

      // Ignorer soi-même
      if (participant.socketId === socket.id) return;

      // Seul le professeur envoie une Offer
      if (user.role !== "teacher") return;

      console.log(

          "👤 Nouvel étudiant :", participant.name

      );

      try {

        if (
          webrtcService.hasPeerConnection(
              participant.socketId
          )
      
           ) {
      
            console.log(
              "Connexion déjà créée"
            );
      
            return;
      
             }
      
             webrtcService.createPeerConnection(
               participant.socketId
             );


          // Création de l'Offer
          const offer = await webrtcService.createOffer(

              participant.socketId

          );

          // Envoi de l'Offer
          socket.emit(

              "webrtc:offer",

              {

                  roomId: conference._id,

                  sender: socket.id,

                  target: participant.socketId,

                  offer

              }

          );

          console.log(

              "📤 Offer envoyée"

          );

      }

      catch (error) {

          console.error(

              "Erreur Offer :", error

          );

      }

  }

);


// ====================================
// ICE CANDIDATE RECU
// ====================================

socket.on(

  "webrtc:iceCandidate",

  async ({

      sender,

      target,

      candidate

  }) => {

      if (target !== socket.id) return;

      if (sender === socket.id) return;

      await webrtcService.addIceCandidate(

          sender,

          candidate

      );

  }

);

  // ============================
  // OUVRIR LA CAMERA
  // ============================
  const initCamera = async () => {

      try {

          const stream = await webrtcService.startLocalStream();

          if (localVideoRef.current) {

              localVideoRef.current.srcObject = stream;

              // ====================================
              // ECOUTER LES ICE CANDIDATES
              // ====================================

            webrtcService.setIceCandidateCallback(
              (socketId, candidate) => {

                socket.emit(
                    "webrtc:iceCandidate",
                  {
                    roomId: conference._id,
                    sender: socket.id,
                    socketId,
                    candidate
                  }
               );
              }

              );
            }

      }

      catch (error) {

          console.error(error);

      }

  };

  initCamera();

// =====================================================
// RECEPTION DU FLUX DISTANT
// =====================================================
webrtcService.setRemoteStreamCallback(

  (socketId, stream) => {

      console.log(

          "📹 Flux reçu :", socketId

      );

      if (remoteVideoRef.current) {

          remoteVideoRef.current.srcObject = stream;

      }

  }

);

// =====================================================
// RECEPTION D'UNE OFFER
// =====================================================
socket.on(

  "webrtc:offer",

  async ({

      sender,

      target,

      offer

  }) => {

      // Cette Offer n'est pas pour moi
      if (target !== socket.id) return;

      // J'ignore ma propre Offer
      if (sender === socket.id) return;

      console.log("📥 Offer reçue");

      try {

          const answer = await webrtcService.handleOffer(

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

          console.log("📤 Answer envoyée");

      }

      catch (error) {

          console.error(error);

      }

  }

);

// =====================================================
// ANSWER RECUE
// =====================================================
socket.on(

  "webrtc:answer",

  async ({

      sender,

      answer

  }) => {

      if (sender === socket.id) return;

      await webrtcService.handleAnswer(

          sender,

          answer

      );

  }

);
  
  return () => {

      socket.emit(
          "conference:leaveRoom",
          {
              roomId: conference._id,
              user
          }
      );

      socket.off("conference:participants");
      socket.off("webrtc:iceCandidate");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:userJoined");

  };

}, [conference]);

  // =====================================================
  // ENVOI MESSAGE (temporaire)
  // =====================================================
  const sendMessage = () => {

    if (!message.trim()) return;

    setMessages((prev) => [

      ...prev,

      {

        sender: user?.name || "Moi",

        text: message

      }

    ]);

    setMessage("");

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


  return (

    <div className="h-screen bg-[#071326] flex flex-col">

      {/* HEADER */}

      <div className="h-20 bg-[#16233d] flex items-center justify-between px-6 text-white">

        <div className="flex items-center gap-6">

          <button
            onClick={() => navigate("/conference-room")}
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

          <div>

            <h1 className="text-2xl font-bold">
            {conference.title}
            </h1>

            <p className="text-gray-300 text-sm">
            {conference.teacher?.name}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <FaUsers />

          <span>
            {participants.length} participants
          </span>

        </div>

      </div>

      {/* CONTENU */}

      <div className="flex flex-1">

        {/* VIDEO */}

        <div className="flex-1 flex flex-col">

          <div className="flex-1 flex items-center justify-center p-8">

            <div
              className="
              w-full
              max-w-5xl
              h-[530px]
              bg-[#16233d]
              rounded-3xl
              flex
              flex-col
              items-center
              justify-center
              shadow-2xl
              "
            >

            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="
                w-full
                h-full
                object-cover
                rounded-3xl"
            />

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="
                absolute
                bottom-5
                right-5
                w-72
                rounded-2xl
                shadow-2xl
                border-4
                border-white
                bg-black"
            />

              <h2 className="text-white text-2xl font-bold mt-3 text-center">
                {conference.teacher?.name}
              </h2>

              <p className="text-gray-300 text-base mt-2 mb-4 text-center">
                {conference.course?.title}
              </p>

              <span
                className="
                mt-6
                bg-red-500
                text-white
                px-4
                py-2
                rounded-full
                animate-pulse
                "
              >
                🔴 EN DIRECT
              </span>

            </div>

          </div>

          {/* CONTROLES */}

          <div
            className="
            h-24
            bg-[#16233d]
            flex
            justify-center
            items-center
            gap-5
            "
          >

            <button
              onClick={() => setMicOn(!micOn)}
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
              onClick={() => setCamOn(!camOn)}
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
              <FaDesktop />
            </button>

            <button
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
              <FaHandPaper />
            </button>

            <button
              onClick={() =>
                navigate("/conference-room")
              }
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

          </div>

        </div>

        {/* SIDEBAR */}

        <div
          className="
          w-[350px]
          bg-white
          border-l
          flex
          flex-col
          "
        >

          {/* CHAT HEADER */}

          <div className="p-5 border-b">

            <h2 className="font-bold text-lg">
              Discussion
            </h2>

          </div>

          {/* CHAT */}

          <div
            className="
            flex-1
            overflow-y-auto
            p-4
            space-y-4
            "
          >

            {
              messages.map((msg, index) => (

                <div key={index}>

                  <p className="font-semibold">
                    {msg.sender}
                  </p>

                  <div
                    className="
                    bg-gray-100
                    p-3
                    rounded-xl
                    mt-1
                    "
                  >
                    {msg.text}
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

            <h2 className="font-bold mb-4">
              Participants ({participants.length})
            </h2>

            <div className="space-y-3">

              {
                participants.map((participant) => (
                  <div 
                    key={participant._id}
                    className="
                      flex
                      items-center
                      gap-3"
                  >

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt=""
                    className="w-10 h-10"
                  />

                  <div>
                    <p className="font-medium">
                        {participant.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {participant.role}
                    </p>
                  </div>
                </div>
                ))
              }

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default ConferenceLive