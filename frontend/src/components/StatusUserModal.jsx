import {
    FaBan,
    FaCheckCircle,
    FaTimes
} from "react-icons/fa"

// =========================
// MODAL ACTIVER / DÉSACTIVER
// =========================
function StatusUserModal({

    isOpen,

    user,

    activate,

    onClose,

    onConfirm

}) {

    // =========================
    // MODAL FERMÉ
    // =========================
    if (!isOpen) {

        return null

    }

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            flex
            justify-center
            items-center
            z-50
            "
        >

            <div
                className="
                bg-white
                rounded-3xl
                shadow-2xl
                overflow-hidden
                w-full
                max-w-lg
                "
            >

                {/* =========================
                    HEADER
                ========================== */}
                <div
                    className={`
                    p-6
                    text-white
                    flex
                    justify-between
                    items-center
                    ${
                        activate
                        ?
                        "bg-gradient-to-r from-green-600 to-emerald-500"
                        :
                        "bg-gradient-to-r from-orange-500 to-red-500"
                    }
                    `}
                >

                    <div className="flex items-center gap-3">
                        {
                            activate
                            ?
                            <FaCheckCircle className="text-2xl"/>
                            :
                            <FaBan className="text-2xl"/>
                        }
                        <h2 className="text-2xl font-bold">
                            {
                                activate
                                ?
                                "Activer l'utilisateur"
                                :
                                "Désactiver l'utilisateur"
                            }
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:rotate-90 transition"
                    >
                        <FaTimes/>
                    </button>
                </div>

                {/* =========================
                    CONTENU
                ========================== */}
                <div className="p-8">
                    <p className="text-lg">
                        Vous êtes sur le point de
                        <span className="font-bold">
                            {
                                activate
                                ?
                                " réactiver "
                                :
                                " désactiver "
                            }
                        </span>
                        cet utilisateur.
                    </p>

                    <div
                        className="
                        mt-6
                        bg-gray-100
                        rounded-2xl
                        p-5
                        "
                    >
                        <h3 className="text-xl font-bold">
                            {user?.name}
                        </h3>
                        <p className="text-gray-500">
                            {user?.email}
                        </p>
                        <span
                            className="
                            inline-block
                            mt-3
                            bg-purple-100
                            text-purple-600
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            {user?.role}
                        </span>
                    </div>
                    <p className="mt-6 text-gray-600 leading-8">
                        {
                            activate
                            ?
                            "Cet utilisateur pourra à nouveau accéder à la plateforme."
                            :
                            "Cet utilisateur sera immédiatement déconnecté et ne pourra plus se connecter tant qu'il ne sera pas réactivé."
                        }
                    </p>
                </div>

                {/* =========================
                    FOOTER
                ========================== */}
                <div
                    className="
                    px-8
                    pb-8
                    flex
                    justify-end
                    gap-4
                    "
                >
                    <button
                        onClick={onClose}
                        className="
                        bg-gray-200
                        px-6
                        py-3
                        rounded-2xl
                        hover:bg-gray-300
                        transition
                        "
                    >
                        Annuler
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`
                        px-6
                        py-3
                        rounded-2xl
                        text-white
                        flex
                        items-center
                        gap-3
                        transition
                        ${
                            activate
                            ?
                            "bg-green-600 hover:bg-green-700"
                            :
                            "bg-red-600 hover:bg-red-700"
                        }
                        `}
                    >
                        {
                            activate
                            ?
                            <FaCheckCircle/>
                            :
                            <FaBan/>
                        }
                        {
                            activate
                            ?
                            "Activer"
                            :
                            "Désactiver"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StatusUserModal