import API from "./api";


// =====================================================
// SERVICE NOTIFICATIONS
// =====================================================

class NotificationService {


    // =====================================================
    // ENVOYER UNE NOTIFICATION ADMIN
    // =====================================================

    async sendNotification(data) {

        const response = await API.post(
            "/notifications/send",
            data
        );

        return response.data;

    }


    // =====================================================
    // HISTORIQUE ADMIN
    // =====================================================
    async getAdminHistory() {

        console.log("📡 APPEL HISTORIQUE ADMIN");
    
        const response = await API.get(
            "/notifications/admin/history"
        );
    
        console.log(
            "📥 REPONSE HISTORIQUE ADMIN :",
            response.data
        );
    
        return response.data;
    
    }


    // =====================================================
    // RECUPERER MES NOTIFICATIONS
    // =====================================================

    async getMyNotifications() {

        const response = await API.get(
            "/notifications"
        );

        return response.data;

    }


    // =====================================================
    // MARQUER UNE NOTIFICATION COMME LUE
    // =====================================================

    async markAsRead(notificationId) {

        const response = await API.patch(

            `/notifications/${notificationId}/read`

        );

        return response.data;

    }


    // =====================================================
    // SUPPRIMER TOUTES LES NOTIFICATIONS
    // =====================================================
    async deleteAllNotifications() {

        const response = await API.delete(
            "/notifications/all"
        );

        return response.data;

    }


    // =====================================================
    // SUPPRIMER L'HISTORIQUE DES NOTIFICATIONS ADMIN
    // =====================================================
    async deleteAdminHistory() {

        const response = await API.delete(
            "/notifications/admin/history"
        );

        return response.data;

    }

}


// =====================================================
// EXPORT
// =====================================================

export default new NotificationService();