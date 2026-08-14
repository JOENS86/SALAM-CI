import User from "../models/User.js";
import Notification from "../models/Notification.js";
import notificationService from "../services/notificationService.js";
import emailService from "../services/emailService.js";

// =====================================================
// ENVOYER UNE NOTIFICATION ADMIN
// =====================================================

export const sendNotification = async (req, res) => {

    try {

        // =====================================================
        // VERIFIER L'ADMIN
        // =====================================================

        if (req.user?.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Accès réservé aux administrateurs."
            });

        }

        // =====================================================
        // RECUPERER LES DONNEES
        // =====================================================

        const {
            title,
            message,
            target = "all",
            sendEmail = true,
            sendInternal = true
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!title?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Le titre de la notification est obligatoire."
            });

        }

        if (!message?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Le message est obligatoire."
            });

        }

        // =====================================================
        // VERIFIER LA CIBLE
        // =====================================================

        const allowedTargets = [
            "all",
            "students",
            "teachers",
            "admins"
        ];

        if (!allowedTargets.includes(target)) {

            return res.status(400).json({
                success: false,
                message: "Destinataire invalide."
            });

        }

        // =====================================================
        // DETERMINER LE ROLE
        // =====================================================

        let userFilter = {};

        if (target === "students") {
            userFilter.role = "student";
        }

        else if (target === "teachers") {
            userFilter.role = "teacher";
        }

        else if (target === "admins") {
            userFilter.role = "admin";
        }

        // =====================================================
        // RECUPERER LES DESTINATAIRES
        // =====================================================

        const users = await User.find(userFilter)
            .select("_id name firstName lastName email role");

        if (!users.length) {

            return res.status(404).json({
                success: false,
                message: "Aucun utilisateur correspondant à cette cible."
            });

        }

        // =====================================================
        // COMPTEURS
        // =====================================================

        let notificationsSent = 0;

        // =====================================================
        // CREATION DES NOTIFICATIONS INTERNES
        //
        // Cette partie est effectuée immédiatement.
        // =====================================================

        const createdNotifications = [];

        if (sendInternal) {

            for (const user of users) {

                const notification =
                    await notificationService.create({

                        recipient: user._id,

                        sender: req.user._id,

                        title: title.trim(),

                        message: message.trim(),

                        type: "message"

                    });

                createdNotifications.push({

                    notificationId: notification._id,

                    user

                });

                notificationsSent++;

            }

        }

        // =====================================================
        // REPONSE IMMEDIATE AU FRONTEND
        //
        // IMPORTANT :
        // On ne fait PAS attendre les emails.
        // =====================================================

        res.status(201).json({

            success: true,

            message: "Notification envoyée avec succès.",

            stats: {

                recipients: users.length,

                notificationsSent,

                emailPending: sendEmail

            }

        });

        // =====================================================
        // ENVOI DES EMAILS EN ARRIERE-PLAN
        //
        // Le frontend n'attend plus cette partie.
        // =====================================================
        if (sendEmail) {

            setImmediate(async () => {

                let emailsSent = 0;
                let emailErrors = 0;

                for (const item of createdNotifications.length
                    ? createdNotifications
                    : users.map(user => ({
                        notificationId: null,
                        user
                    }))
                ) {

                    const user = item.user;

                    if (!user.email) {

                        console.warn(
                            `⚠️ Aucun email pour ${user.name || user._id}`
                        );

                        continue;

                    }

                    try {

                        await emailService.sendMail({

                            to: user.email,

                            subject: title.trim(),

                            html: `

                                <!DOCTYPE html>

                                <html lang="fr">

                                <head>

                                    <meta charset="UTF-8">

                                    <meta
                                        name="viewport"
                                        content="width=device-width, initial-scale=1.0"
                                    >

                                    <title>${title.trim()}</title>

                                </head>

                                <body
                                    style="
                                        margin:0;
                                        padding:0;
                                        background:#f3f4f6;
                                        font-family:Arial,Helvetica,sans-serif;
                                    "
                                >

                                    <div
                                        style="
                                            max-width:650px;
                                            margin:30px auto;
                                            background:#ffffff;
                                            border-radius:16px;
                                            overflow:hidden;
                                            box-shadow:0 10px 30px rgba(0,0,0,0.08);
                                        "
                                    >

                                        <!-- HEADER -->

                                        <div
                                            style="
                                                background:linear-gradient(
                                                    135deg,
                                                    #7c3aed,
                                                    #4f46e5
                                                );
                                                padding:30px;
                                                color:white;
                                                text-align:center;
                                            "
                                        >

                                            <h1
                                                style="
                                                    margin:0;
                                                    font-size:28px;
                                                "
                                            >
                                                SALAM CI
                                            </h1>

                                            <p
                                                style="
                                                    margin:8px 0 0;
                                                    font-size:14px;
                                                    opacity:0.9;
                                                "
                                            >
                                                Plateforme de formation en ligne
                                            </p>

                                        </div>

                                        <!-- CONTENU -->

                                        <div
                                            style="
                                                padding:35px;
                                            "
                                        >

                                            <h2
                                                style="
                                                    margin-top:0;
                                                    color:#111827;
                                                    font-size:22px;
                                                "
                                            >
                                                ${title.trim()}
                                            </h2>

                                            <p
                                                style="
                                                    color:#4b5563;
                                                    font-size:15px;
                                                    line-height:1.8;
                                                    white-space:pre-line;
                                                "
                                            >
                                                ${message.trim()}
                                            </p>

                                            <div
                                                style="
                                                    margin-top:30px;
                                                    padding:18px;
                                                    background:#f5f3ff;
                                                    border-left:4px solid #7c3aed;
                                                    border-radius:8px;
                                                "
                                            >

                                                <p
                                                    style="
                                                        margin:0;
                                                        color:#4b5563;
                                                        font-size:13px;
                                                    "
                                                >
                                                    Cette notification vous a été
                                                    envoyée depuis la plateforme
                                                    SALAM CI.
                                                </p>

                                            </div>

                                        </div>

                                        <!-- FOOTER -->

                                        <div
                                            style="
                                                padding:20px;
                                                text-align:center;
                                                background:#f9fafb;
                                                color:#9ca3af;
                                                font-size:12px;
                                            "
                                        >

                                            © ${new Date().getFullYear()} SALAM CI

                                            <br>

                                            Plateforme intelligente
                                            d'E-learning

                                        </div>

                                    </div>

                                </body>

                                </html>

                            `

                        });

                        emailsSent++;

                        // =================================================
                        // MARQUER L'EMAIL COMME ENVOYE
                        // =================================================
                        if (item.notificationId) {

                            await Notification.findByIdAndUpdate(

                                item.notificationId,

                                {
                                    emailSent: true
                                }

                            );

                        }

                        console.log(
                            `✅ Email envoyé à ${user.email}`
                        );

                    }

                    catch (emailError) {

                        emailErrors++;

                        console.error(
                            `❌ Erreur email pour ${user.email} :`,
                            emailError.message
                        );

                    }

                }

                // =====================================================
                // RESULTAT EMAILS
                // =====================================================
                console.log(
                    "=========================================="
                );

                console.log(
                    "📧 ENVOI EMAIL TERMINE"
                );

                console.log(
                    `✅ Emails envoyés : ${emailsSent}`
                );

                console.log(
                    `❌ Erreurs email : ${emailErrors}`
                );

                console.log(
                    "=========================================="
                );

            });

        }

    }

    catch (error) {

        console.error(
            "❌ Erreur envoi notification :",
            error
        );

        // =====================================================
        // SI LA REPONSE N'A PAS ENCORE ETE ENVOYEE
        // =====================================================
        if (!res.headersSent) {

            return res.status(500).json({

                success: false,

                message:
                    "Une erreur est survenue lors de l'envoi de la notification."

            });

        }

    }

};


// =====================================================
// HISTORIQUE DES NOTIFICATIONS ENVOYEES PAR L'ADMIN
// =====================================================
export const getAdminNotificationHistory = async (
    req,
    res
) => {

    try {

        // =====================================================
        // VERIFIER L'ADMIN
        // =====================================================
        if (req.user?.role !== "admin") {

            return res.status(403).json({

                success: false,

                message:
                    "Accès réservé aux administrateurs."

            });

        }

        // =====================================================
        // RECUPERER L'HISTORIQUE
        // =====================================================
        const notifications =
            await Notification.find({

                sender: req.user._id

            })

            .populate(
                "recipient",
                "name firstName lastName email role"
            )

            .sort({

                createdAt: -1

            })

            .limit(100);

        // =====================================================
        // REPONSE
        // =====================================================
        return res.json({

            success: true,

            notifications

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur historique notifications :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer l'historique."

        });

    }

};

// =====================================================
// RECUPERER MES NOTIFICATIONS
// =====================================================

export const getMyNotifications = async (
    req,
    res
) => {

    try {

        const notifications =
            await notificationService.getUserNotifications(
                req.user._id
            );

        const unreadCount =
            notifications.filter(
                notification => !notification.isRead
            ).length;

        return res.json({

            success: true,

            notifications,

            unreadCount

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur récupération notifications :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les notifications."

        });

    }

};


// =====================================================
// MARQUER UNE NOTIFICATION COMME LUE
// =====================================================

export const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification introuvable."

            });

        }


        // =================================================
        // VERIFIER QUE LA NOTIFICATION APPARTIENT
        // BIEN A L'UTILISATEUR CONNECTE
        // =================================================

        if (
            notification.recipient.toString()
            !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas autorisé à modifier cette notification."

            });

        }


        notification.isRead = true;

        await notification.save();


        return res.json({

            success: true,

            message:
                "Notification marquée comme lue.",

            notification

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur lecture notification :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de modifier la notification."

        });

    }

};