import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaVideo,
    FaBookOpen
} from "react-icons/fa";

function StudentConferenceCard({

    conference,

    onJoin

}) {

    const isLive = conference.status === "live";

    const isScheduled = conference.status === "scheduled";

    return (

        <div
            className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
            "
        >

            {/* HEADER */}

            {

                conference.image ?

                (

                    <img

                        src={conference.image}

                        alt={conference.title}

                        className="w-full h-56 object-cover"

                    />

                )

                :

                (

                    <div
                        className="
                            h-56
                            bg-gradient-to-r
                            from-purple-600
                            via-fuchsia-600
                            to-pink-500
                            flex
                            items-center
                            justify-center
                            relative
                        "
                    >

                        <FaVideo className="text-white text-7xl" />

                        {

                            isLive &&

                            <span
                                className="
                                    absolute
                                    top-5
                                    right-5
                                    bg-red-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-bold
                                    animate-pulse
                                "
                            >

                                🔴 LIVE

                            </span>

                        }

                    </div>

                )

            }

            {/* BODY */}

            <div className="p-6">

                <h2 className="text-2xl font-bold">

                    {conference.title}

                </h2>

                <p className="text-gray-500 mt-2">

                    {conference.teacher?.name}

                </p>

                <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3">

                        <FaBookOpen className="text-purple-600"/>

                        <span>

                            {conference.course?.title}

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <FaCalendarAlt className="text-purple-600"/>

                        <span>

                            {

                                new Date(

                                    conference.date

                                ).toLocaleDateString("fr-FR")

                            }

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <FaClock className="text-purple-600"/>

                        <span>

                            {conference.time}

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <FaClock className="text-purple-600"/>

                        <span>

                            {conference.duration} minutes

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <FaUsers className="text-purple-600"/>

                        <span>

                            {

                                conference.currentParticipants ?? 0

                            }

                            /

                            {

                                conference.maxParticipants

                            }

                            {" "}participants

                        </span>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="mt-8 space-y-4">

                    <span

                        className={`

                            inline-block

                            px-5

                            py-2

                            rounded-full

                            text-sm

                            font-semibold

                            ${

                                isLive

                                ?

                                "bg-green-100 text-green-700"

                                :

                                isScheduled

                                ?

                                "bg-yellow-100 text-yellow-700"

                                :

                                "bg-gray-200 text-gray-700"

                            }

                        `}

                    >

                        {

                            isLive

                            ?

                            "En direct"

                            :

                            isScheduled

                            ?

                            "À venir"

                            :

                            "Terminée"

                        }

                    </span>

                    <button

                        disabled={!isLive}

                        onClick={onJoin}

                        className={`

                            w-full

                            py-4

                            rounded-2xl

                            font-bold

                            text-white

                            transition

                            ${

                                isLive

                                ?

                                "bg-purple-600 hover:bg-purple-700"

                                :

                                "bg-gray-300 cursor-not-allowed"

                            }

                        `}

                    >

                        {

                            isLive

                            ?

                            "Rejoindre la conférence"

                            :

                            "Conférence indisponible"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default StudentConferenceCard;