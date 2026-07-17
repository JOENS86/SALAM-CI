import { FaLock, FaTimes } from "react-icons/fa"

// =========================
// MODAL ACTION INTERDITE
// =========================
function ForbiddenActionModal({

    isOpen,

    title,

    message,

    onClose

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
                animate-scaleIn
                "
            >

                {/* =========================
                    HEADER
                ========================== */}

                <div
                    className="
                    bg-gradient-to-r
                    from-amber-500
                    to-orange-500
                    text-white
                    p-6
                    flex
                    justify-between
                    items-center
                    "
                >

                    <div className="flex items-center gap-3">

                        <FaLock className="text-2xl" />

                        <h2 className="text-2xl font-bold">

                            Action interdite

                        </h2>

                    </div>

                    <button

                        onClick={onClose}

                        className="hover:rotate-90 transition"

                    >

                        <FaTimes />

                    </button>

                </div>

                {/* =========================
                    CONTENU
                ========================== */}

                <div className="p-8 text-center">

                    <h3 className="text-2xl font-bold">

                        {title}

                    </h3>

                    <p className="mt-5 text-gray-600 leading-8">

                        {message}

                    </p>

                </div>

                {/* =========================
                    FOOTER
                ========================== */}

                <div className="pb-8 flex justify-center">

                    <button

                        onClick={onClose}

                        className="
                        bg-gradient-to-r
                        from-purple-600
                        to-indigo-600
                        text-white
                        px-8
                        py-3
                        rounded-2xl
                        hover:scale-105
                        transition
                        "

                    >

                        Compris

                    </button>

                </div>

            </div>

        </div>

    )

}

export default ForbiddenActionModal