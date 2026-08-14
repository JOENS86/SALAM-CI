import express from "express";

import authMiddleware
    from "../middleware/authMiddleware.js";

import {

    sendNotification,

    getAdminNotificationHistory,

    getMyNotifications,

    markNotificationAsRead

} from "../controllers/notificationController.js";


const router = express.Router();


// =====================================================
// ENVOYER UNE NOTIFICATION
// =====================================================

router.post(

    "/send",

    authMiddleware,

    sendNotification

);


// =====================================================
// HISTORIQUE ADMIN
// =====================================================

router.get(

    "/admin/history",

    authMiddleware,

    getAdminNotificationHistory

);


// =====================================================
// MES NOTIFICATIONS
// =====================================================

router.get(

    "/",

    authMiddleware,

    getMyNotifications

);


// =====================================================
// MARQUER COMME LUE
// =====================================================

router.patch(

    "/:id/read",

    authMiddleware,

    markNotificationAsRead

);


export default router;