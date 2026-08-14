import Notification from "../models/Notification.js";
import { getIO } from "../socket/socketManager.js";

class NotificationService {

// =====================================================
// CREER UNE NOTIFICATION
// =====================================================

async create({

    recipient,

    sender = null,

    title,

    message,

    type,

    entityType = null,

    entityId = null

}) {

    // =====================================================
    // CREATION MONGODB
    // =====================================================

    const notification =
        await Notification.create({

            recipient,

            sender,

            title,

            message,

            type,

            entityType,

            entityId

        });


    // =====================================================
    // NOTIFICATION TEMPS REEL
    // =====================================================

    try {

        const io = getIO();

        if (io) {

            const recipientId =
                recipient.toString();

            io.to(
                `user:${recipientId}`
            ).emit(

                "notification:new",

                notification

            );

            console.log(
                `🔔 Notification temps réel envoyée à ${recipientId}`
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Erreur Socket notification :",
            error.message
        );

    }


    // =====================================================
    // RETOUR
    // =====================================================

    return notification;

}

    // =====================================================
    // RECUPERER LES NOTIFICATIONS
    // =====================================================

    async getUserNotifications(userId) {

        return await Notification

            .find({

                recipient: userId

            })

            .sort({

                createdAt: -1

            });

    }

    // =====================================================
    // MARQUER COMME LUE
    // =====================================================

    async markAsRead(notificationId) {

        return await Notification.findByIdAndUpdate(

            notificationId,

            {

                isRead: true

            },

            {

                new: true

            }

        );

    }

    // =====================================================
    // SUPPRIMER UNE NOTIFICATION
    // =====================================================

    async delete(notificationId) {

        return await Notification.findByIdAndDelete(

            notificationId

        );

    }

}

export default new NotificationService();