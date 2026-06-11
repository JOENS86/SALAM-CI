import { useState } from "react"

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
} from "react-icons/fa"

import { useNavigate } from "react-router-dom"

function ConferenceLive() {

  const navigate = useNavigate()

  const user =
    JSON.parse(localStorage.getItem("user")) || {}

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState([
    {
      sender: "Professeur Moussa Traoré",
      text: "Bienvenue à tous dans cette conférence."
    },
    {
      sender: "Étudiant Koné",
      text: "Merci professeur."
    }
  ])

  const participants = [
    "Professeur Moussa Traoré",
    "Étudiant Koné",
    "Étudiante Traoré",
    "Étudiant Sow",
    user?.name || "Moi"
  ]

  const sendMessage = () => {

    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        sender: user?.name || "Moi",
        text: message
      }
    ])

    setMessage("")
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
              Mathématiques Appliquées
            </h1>

            <p className="text-gray-300 text-sm">
              Professeur Moussa Traoré
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
              h-[500px]
              bg-[#16233d]
              rounded-3xl
              flex
              flex-col
              items-center
              justify-center
              shadow-2xl
              "
            >

              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                alt=""
                className="w-32"
              />

              <h2 className="text-white text-3xl font-bold mt-5">
                Professeur Moussa Traoré
              </h2>

              <p className="text-gray-400 mt-2">
                Enseignant
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
                participants.map((participant, index) => (

                  <div
                    key={index}
                    className="
                    flex
                    items-center
                    gap-3
                    "
                  >

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      alt=""
                      className="w-10 h-10"
                    />

                    <span>
                      {participant}
                    </span>

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