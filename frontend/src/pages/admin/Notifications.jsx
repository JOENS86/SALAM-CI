import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
    FaBell,
    FaPaperPlane,
    FaUsers,
    FaEnvelope,
    FaCheckCircle,
    FaClock,
    FaTrash
} from "react-icons/fa";

import { toast } from "react-toastify";

import notificationService from "../../services/notificationService";


function Notifications() {

    // =====================================================
    // FORMULAIRE
    // =====================================================

    const [notification, setNotification] = useState({

        title: "",

        message: "",

        target: "all",

        sendInternal: true,

        sendEmail: true

    });


    // =====================================================
    // ETATS
    // =====================================================

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    
    const [loadingHistory, setLoadingHistory] = useState(true);
    
    const [deletingHistory, setDeletingHistory] = useState(false);


    // =====================================================
    // CHARGER HISTORIQUE
    // =====================================================

    const loadHistory = async () => {

        try {

            setLoadingHistory(true);

            const response =
                await notificationService.getAdminHistory();

            if (response.success) {

                setHistory(
                    response.notifications || []
                );

            }

        }

        catch (error) {

            console.error(
                "❌ Erreur chargement historique :",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Impossible de charger l'historique."
            );

        }

        finally {

            setLoadingHistory(false);

        }

    };


    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================

    useEffect(() => {

        loadHistory();

    }, []);


    // =====================================================
    // CHANGEMENT INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setNotification(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // CHECKBOX
    // =====================================================

    const handleCheckbox = (e) => {

        const {
            name,
            checked
        } = e.target;

        setNotification(prev => ({

            ...prev,

            [name]: checked

        }));

    };


    // =====================================================
    // ENVOYER
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =================================================
        // VALIDATION
        // =================================================

        if (!notification.title.trim()) {

            toast.error(
                "Veuillez saisir un titre."
            );

            return;

        }


        if (!notification.message.trim()) {

            toast.error(
                "Veuillez saisir un message."
            );

            return;

        }


        if (
            !notification.sendInternal &&
            !notification.sendEmail
        ) {

            toast.error(
                "Sélectionnez au moins un mode d'envoi."
            );

            return;

        }


        // =================================================
        // ENVOI
        // =================================================

        try {

            setLoading(true);


            const response =
                await notificationService.sendNotification({

                    title:
                        notification.title.trim(),

                    message:
                        notification.message.trim(),

                    target:
                        notification.target,

                    sendInternal:
                        notification.sendInternal,

                    sendEmail:
                        notification.sendEmail

                });


            // =================================================
            // SUCCES
            // =================================================

            if (response.success) {

                const stats =
                    response.stats || {};


                toast.success(
                    response.message ||
                    "Notification envoyée avec succès."
                );


                // =================================================
                // AFFICHER LE RESULTAT
                // =================================================

                console.log(
                    "📨 Notification envoyée :",
                    stats
                );


                // =================================================
                // VIDER LE FORMULAIRE
                // =================================================

                setNotification({

                    title: "",

                    message: "",

                    target: "all",

                    sendInternal: true,

                    sendEmail: true

                });


                // =================================================
                // ACTUALISER HISTORIQUE
                // =================================================

                await loadHistory();

            }

            else {

                toast.error(

                    response.message ||
                    "Impossible d'envoyer la notification."

                );

            }

        }

        catch (error) {

            console.error(
                "❌ Erreur envoi notification :",
                error
            );

            toast.error(

                error.response?.data?.message ||

                "Une erreur est survenue lors de l'envoi."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =====================================================
    // NOM DESTINATAIRE
    // =====================================================

    const getRecipientName = (user) => {

        if (!user) {

            return "Utilisateur";

        }

        if (user.name) {

            return user.name;

        }

        return [

            user.firstName,

            user.lastName

        ]

            .filter(Boolean)

            .join(" ") ||

            user.email ||

            "Utilisateur";

    };


    // =====================================================
    // TYPE CIBLE
    // =====================================================

    const getRoleLabel = (role) => {

        switch (role) {

            case "student":
                return "Étudiant";

            case "teacher":
                return "Enseignant";

            case "admin":
                return "Administrateur";

            default:
                return "Utilisateur";

        }

    };


// =====================================================
// SUPPRIMER L'HISTORIQUE ADMIN
// =====================================================
const handleDeleteHistory = async () => {

    if (history.length === 0) {

        return;

    }

    try {

        setDeletingHistory(true);

        const response =
            await notificationService.deleteAdminHistory();

        if (response.success) {

            setHistory([]);

            toast.success(
                "Historique des notifications supprimé."
            );

        } else {

            toast.error(
                response.message ||
                "Impossible de supprimer l'historique."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Erreur suppression historique :",
            error
        );

        toast.error(

            error.response?.data?.message ||

            "Impossible de supprimer l'historique."

        );

    }

    finally {

        setDeletingHistory(false);

    }

};

    return (

        <AdminLayout>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-10">

                <div className="flex items-center gap-4">

                    <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-purple-100
                        text-purple-600
                        flex
                        items-center
                        justify-center
                    ">

                        <FaBell className="text-2xl" />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold">

                            Notifications

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Envoyez des notifications aux utilisateurs

                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                CONTENU
            ================================================= */}

            <div className="grid lg:grid-cols-3 gap-8">


                {/* =================================================
                    FORMULAIRE
                ================================================= */}

                <div className="
                    lg:col-span-2
                    bg-white
                    rounded-3xl
                    shadow-sm
                    p-8
                ">

                    <div className="flex items-center gap-3 mb-6">

                        <FaPaperPlane
                            className="text-purple-600"
                        />

                        <h2 className="text-2xl font-bold">

                            Nouvelle notification

                        </h2>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >


                        {/* TITRE */}

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">

                                Titre

                            </label>

                            <input

                                type="text"

                                name="title"

                                placeholder="Ex : Conférence programmée"

                                value={
                                    notification.title
                                }

                                onChange={
                                    handleChange
                                }

                                disabled={loading}

                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-2xl
                                    p-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                    disabled:bg-gray-100
                                "

                            />

                        </div>


                        {/* MESSAGE */}

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">

                                Message

                            </label>

                            <textarea

                                name="message"

                                placeholder="Écrivez votre message..."

                                value={
                                    notification.message
                                }

                                onChange={
                                    handleChange
                                }

                                disabled={loading}

                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-2xl
                                    p-4
                                    h-40
                                    resize-none
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                    disabled:bg-gray-100
                                "

                            />

                        </div>


                        {/* DESTINATAIRES */}

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-2
                            ">

                                Destinataires

                            </label>

                            <select

                                name="target"

                                value={
                                    notification.target
                                }

                                onChange={
                                    handleChange
                                }

                                disabled={loading}

                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-2xl
                                    p-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-500
                                    disabled:bg-gray-100
                                "

                            >

                                <option value="all">

                                    Tous les utilisateurs

                                </option>

                                <option value="students">

                                    Étudiants

                                </option>

                                <option value="teachers">

                                    Enseignants

                                </option>

                                <option value="admins">

                                    Administrateurs

                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            MODES D'ENVOI
                        ================================================= */}

                        <div>

                            <label className="
                                block
                                font-semibold
                                mb-3
                            ">

                                Modes d'envoi

                            </label>


                            <div className="
                                grid
                                md:grid-cols-2
                                gap-4
                            ">


                                {/* NOTIFICATION INTERNE */}

                                <label className={`
                                    flex
                                    items-center
                                    gap-4
                                    p-4
                                    border
                                    rounded-2xl
                                    cursor-pointer
                                    transition
                                    ${
                                        notification.sendInternal
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-gray-200"
                                    }
                                `}>

                                    <input

                                        type="checkbox"

                                        name="sendInternal"

                                        checked={
                                            notification.sendInternal
                                        }

                                        onChange={
                                            handleCheckbox
                                        }

                                        disabled={loading}

                                        className="
                                            w-5
                                            h-5
                                            accent-purple-600
                                        "

                                    />

                                    <FaBell
                                        className="text-purple-600"
                                    />

                                    <div>

                                        <p className="font-semibold">

                                            Notification interne

                                        </p>

                                        <p className="
                                            text-sm
                                            text-gray-500
                                        ">

                                            Dans la plateforme

                                        </p>

                                    </div>

                                </label>


                                {/* EMAIL */}

                                <label className={`
                                    flex
                                    items-center
                                    gap-4
                                    p-4
                                    border
                                    rounded-2xl
                                    cursor-pointer
                                    transition
                                    ${
                                        notification.sendEmail
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-gray-200"
                                    }
                                `}>

                                    <input

                                        type="checkbox"

                                        name="sendEmail"

                                        checked={
                                            notification.sendEmail
                                        }

                                        onChange={
                                            handleCheckbox
                                        }

                                        disabled={loading}

                                        className="
                                            w-5
                                            h-5
                                            accent-purple-600
                                        "

                                    />

                                    <FaEnvelope
                                        className="text-purple-600"
                                    />

                                    <div>

                                        <p className="font-semibold">

                                            Email

                                        </p>

                                        <p className="
                                            text-sm
                                            text-gray-500
                                        ">

                                            Envoyer par email

                                        </p>

                                    </div>

                                </label>

                            </div>

                        </div>


                        {/* =================================================
                            BOUTON
                        ================================================= */}

                        <button

                            type="submit"

                            disabled={loading}

                            className="
                                bg-gradient-to-r
                                from-purple-600
                                to-indigo-600
                                text-white
                                px-8
                                py-4
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                gap-3
                                font-semibold
                                hover:scale-[1.02]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:hover:scale-100
                            "

                        >

                            {loading ? (

                                <>
                                    <span className="
                                        w-5
                                        h-5
                                        border-2
                                        border-white
                                        border-t-transparent
                                        rounded-full
                                        animate-spin
                                    " />

                                    Envoi en cours...

                                </>

                            ) : (

                                <>
                                    <FaPaperPlane />

                                    Envoyer la notification

                                </>

                            )}

                        </button>

                    </form>

                </div>


                {/* =================================================
                    HISTORIQUE
                ================================================= */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    p-8
                    h-fit
                ">

<div className="
    flex
    items-center
    justify-between
    mb-6
">

    <div className="
        flex
        items-center
        gap-3
    ">

        <FaClock
            className="text-purple-600"
        />

        <h2 className="text-2xl font-bold">

            Historique

        </h2>

    </div>


    <div className="
        flex
        items-center
        gap-3
    ">

        {/* COMPTEUR */}
        <span className="
            bg-purple-100
            text-purple-700
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
        ">

            {history.length}

        </span>


        {/* BOUTON SUPPRIMER */}
        <button

            type="button"

            onClick={handleDeleteHistory}

            disabled={
                history.length === 0 ||
                deletingHistory
            }

            title="Supprimer l'historique"

            className="
                w-9
                h-9
                rounded-xl
                flex
                items-center
                justify-center
                text-gray-400
                hover:text-red-600
                hover:bg-red-50
                transition
                disabled:opacity-30
                disabled:cursor-not-allowed
            "

        >

            {deletingHistory ? (

                <span className="
                    w-4
                    h-4
                    border-2
                    border-gray-300
                    border-t-red-500
                    rounded-full
                    animate-spin
                " />

            ) : (

                <FaTrash />

            )}

        </button>

    </div>

</div>


                    {/* CHARGEMENT */}

                    {loadingHistory ? (

                        <div className="
                            py-10
                            text-center
                            text-gray-500
                        ">

                            Chargement...

                        </div>

                    ) : history.length === 0 ? (

                        <div className="
                            py-10
                            text-center
                            text-gray-400
                        ">

                            <FaBell className="
                                text-4xl
                                mx-auto
                                mb-3
                            " />

                            <p>

                                Aucune notification envoyée.

                            </p>

                        </div>

                    ) : (

                        <div className="
                            space-y-5
                            max-h-[600px]
                            overflow-y-auto
                            pr-2
                        ">

                            {history.map(
                                (item) => (

                                    <div
                                        key={item._id}
                                        className="
                                            border-b
                                            pb-5
                                            last:border-b-0
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            gap-3
                                        ">

                                            <div className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-purple-100
                                                text-purple-600
                                                flex
                                                items-center
                                                justify-center
                                                flex-shrink-0
                                            ">

                                                <FaBell />

                                            </div>


                                            <div className="min-w-0">

                                                <h3 className="
                                                    font-semibold
                                                    truncate
                                                ">

                                                    {item.title}

                                                </h3>

                                                <p className="
                                                    text-gray-500
                                                    text-sm
                                                    mt-1
                                                ">

                                                    {item.message}

                                                </p>

                                                <div className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                    mt-3
                                                ">

                                                    <span className="
                                                        bg-gray-100
                                                        text-gray-600
                                                        px-2
                                                        py-1
                                                        rounded-lg
                                                        text-xs
                                                    ">

                                                        <FaUsers
                                                            className="
                                                                inline
                                                                mr-1
                                                            "
                                                        />

                                                        {getRecipientName(
                                                            item.recipient
                                                        )}

                                                    </span>

                                                    {item.recipient?.role && (

                                                        <span className="
                                                            bg-purple-50
                                                            text-purple-600
                                                            px-2
                                                            py-1
                                                            rounded-lg
                                                            text-xs
                                                        ">

                                                            {
                                                                getRoleLabel(
                                                                    item.recipient.role
                                                                )
                                                            }

                                                        </span>

                                                    )}

                                                    {item.emailSent && (

                                                        <span className="
                                                            bg-green-50
                                                            text-green-600
                                                            px-2
                                                            py-1
                                                            rounded-lg
                                                            text-xs
                                                        ">

                                                            <FaCheckCircle
                                                                className="
                                                                    inline
                                                                    mr-1
                                                                "
                                                            />

                                                            Email envoyé

                                                        </span>

                                                    )}

                                                </div>

                                                <p className="
                                                    text-gray-400
                                                    text-xs
                                                    mt-2
                                                ">

                                                    {formatDate(
                                                        item.createdAt
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>

    );

}

export default Notifications;