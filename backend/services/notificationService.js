import Notification from "../models/Notification.js";

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
    
        return await Notification.create({
    
            recipient,
    
            sender,
    
            title,
    
            message,
    
            type,
    
            entityType,
    
            entityId
    
        });
    
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