import { useEffect, useRef, useState } from "react";

import {
    FaBell,
    FaVideo,
    FaUsers,
    FaBook,
    FaComment,
    FaHeart,
    FaCheckCircle,
    FaInfoCircle
} from "react-icons/fa";

import notificationService
    from "../services/notificationService";

import socketService
    from "../services/socketService";


// =====================================================
// ICONE SELON LE TYPE
// =====================================================

const getNotificationIcon = (type) => {

    switch (type) {

        case "conference_request":
        case "conference_approved":
        case "conference_rejected":
        case "conference_scheduled":
        case "conference_started":
        case "conference_completed":
        case "conference_cancelled":

            return <FaVideo />;


        case "community_post":
        case "community_comment":
        case "community_share":
        case "community_mention":

            return <FaUsers />;


        case "community_like":

            return <FaHeart />;


        case "course":
        case "quiz":
        case "exercise":
        case "certificate":

            return <FaBook />;


        case "message":

            return <FaComment />;


        case "system":

            return <FaInfoCircle />;


        default:

            return <FaBell />;

    }

};


// =====================================================
// COMPOSANT
// =====================================================

function NotificationBell() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [open, setOpen] =
        useState(false);

    const containerRef =
        useRef(null);


    // =====================================================
    // CHARGER LES NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {

        try {

            const data =
                await notificationService.getMyNotifications();

            if (data.success) {

                setNotifications(
                    data.notifications || []
                );

                setUnreadCount(
                    data.unreadCount || 0
                );

            }

        }

        catch (error) {

            console.error(
                "Erreur notifications :",
                error
            );

        }

    };


    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================
    useEffect(() => {

        loadNotifications();
    
        // =====================================================
        // VERIFIER L'UTILISATEUR
        // =====================================================
    
        if (!user?._id) {
    
            return;
    
        }
    
    
        // =====================================================
        // CONNEXION SOCKET
        // =====================================================
    
        const socket =
            socketService.connect();
    
    
        // =====================================================
        // ENREGISTRER L'UTILISATEUR
        // =====================================================
    
        socket.emit(
            "notification:register",
            user._id
        );
    
    
        // =====================================================
        // RECEVOIR UNE NOUVELLE NOTIFICATION
        // =====================================================
    
        const handleNewNotification =
            (notification) => {
    
                console.log(
                    "🔔 Nouvelle notification reçue :",
                    notification
                );
    
    
                // Ajouter en haut de la liste
    
                setNotifications(
                    previous => [
    
                        notification,
    
                        ...previous
    
                    ]
                );
    
    
                // Augmenter le compteur
    
                setUnreadCount(
                    previous =>
                        previous + 1
                );
    
            };
    
    
        socket.on(
            "notification:new",
            handleNewNotification
        );
    
    
        // =====================================================
        // NETTOYAGE
        // =====================================================
    
        return () => {
    
            socket.off(
                "notification:new",
                handleNewNotification
            );
    
        };
    
    }, []);


    // =====================================================
    // FERMER LE POPUP EN DEHORS
    // =====================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {

                setOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =====================================================
    // CLIQUER SUR UNE NOTIFICATION
    // =====================================================

    const handleNotificationClick = async (
        notification
    ) => {

        try {

            if (!notification.isRead) {

                await notificationService.markAsRead(
                    notification._id
                );

                setNotifications(
                    previous =>
                        previous.map(item =>
                            item._id === notification._id
                                ? {
                                    ...item,
                                    isRead: true
                                }
                                : item
                        )
                );

                setUnreadCount(
                    previous =>
                        Math.max(0, previous - 1)
                );

            }

        }

        catch (error) {

            console.error(
                "Erreur lecture notification :",
                error
            );

        }

    };


    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    return (

        <div
            ref={containerRef}
            className="relative"
        >

            {/* =================================================
                BOUTON CLOCHE
            ================================================= */}

            <button

                onClick={() =>
                    setOpen(previous => !previous)
                }

                className="
                    relative
                    text-gray-600
                    hover:text-purple-600
                    transition
                    text-xl
                "

            >

                <FaBell />

                {unreadCount > 0 && (

                    <span
                        className="
                            absolute
                            -top-2
                            -right-2
                            bg-red-500
                            text-white
                            text-[10px]
                            font-bold
                            rounded-full
                            min-w-[18px]
                            h-[18px]
                            px-1
                            flex
                            items-center
                            justify-center
                        "
                    >

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* =================================================
                POPUP
            ================================================= */}

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        top-10
                        w-[380px]
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        border
                        border-gray-100
                        z-50
                        overflow-hidden
                    "
                >

                    {/* HEADER */}

                    <div
                        className="
                            px-5
                            py-4
                            border-b
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h2 className="font-bold text-lg">

                                Notifications

                            </h2>

                            <p className="text-xs text-gray-500">

                                Toutes vos notifications

                            </p>

                        </div>


                        {unreadCount > 0 && (

                            <span
                                className="
                                    bg-purple-100
                                    text-purple-700
                                    text-xs
                                    font-semibold
                                    px-2
                                    py-1
                                    rounded-full
                                "
                            >

                                {unreadCount} non lue
                                {unreadCount > 1 ? "s" : ""}

                            </span>

                        )}

                    </div>


                    {/* LISTE */}

                    <div
                        className="
                            max-h-[420px]
                            overflow-y-auto
                        "
                    >

                        {notifications.length === 0 ? (

                            <div
                                className="
                                    p-10
                                    text-center
                                    text-gray-500
                                "
                            >

                                <FaCheckCircle
                                    className="
                                        mx-auto
                                        text-3xl
                                        text-green-500
                                        mb-3
                                    "
                                />

                                <p className="font-medium">

                                    Aucune notification

                                </p>

                                <p className="text-sm mt-1">

                                    Vous êtes à jour.

                                </p>

                            </div>

                        ) : (

                            notifications.map(
                                notification => (

                                    <button

                                        key={
                                            notification._id
                                        }

                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }

                                        className={`
                                            w-full
                                            text-left
                                            px-5
                                            py-4
                                            border-b
                                            flex
                                            gap-3
                                            hover:bg-gray-50
                                            transition
                                            ${
                                                !notification.isRead
                                                    ? "bg-purple-50"
                                                    : "bg-white"
                                            }
                                        `}

                                    >

                                        {/* ICONE */}

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-purple-100
                                                text-purple-600
                                                flex
                                                items-center
                                                justify-center
                                                flex-shrink-0
                                            "
                                        >

                                            {getNotificationIcon(
                                                notification.type
                                            )}

                                        </div>


                                        {/* CONTENU */}

                                        <div className="flex-1 min-w-0">

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-2
                                                "
                                            >

                                                <h3
                                                    className={`
                                                        text-sm
                                                        ${
                                                            !notification.isRead
                                                                ? "font-bold"
                                                                : "font-semibold"
                                                        }
                                                    `}
                                                >

                                                    {
                                                        notification.title
                                                    }

                                                </h3>


                                                {!notification.isRead && (

                                                    <span
                                                        className="
                                                            w-2
                                                            h-2
                                                            rounded-full
                                                            bg-purple-600
                                                            mt-1
                                                            flex-shrink-0
                                                        "
                                                    />

                                                )}

                                            </div>


                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                    line-clamp-2
                                                "
                                            >

                                                {
                                                    notification.message
                                                }

                                            </p>


                                            <p
                                                className="
                                                    text-[10px]
                                                    text-gray-400
                                                    mt-2
                                                "
                                            >

                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }

                                            </p>

                                        </div>

                                    </button>

                                )
                            )

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}

export default NotificationBell;