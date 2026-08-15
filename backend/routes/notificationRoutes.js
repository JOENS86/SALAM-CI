import express from "express";

import authMiddleware
    from "../middleware/authMiddleware.js";

    import {

        sendNotification,
    
        getAdminNotificationHistory,
    
        getMyNotifications,
    
        markNotificationAsRead,
    
        deleteAllMyNotifications,
    
        deleteAdminNotificationHistory
    
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
// SUPPRIMER L'HISTORIQUE ADMIN
// =====================================================
router.delete(

    "/admin/history",

    authMiddleware,

    deleteAdminNotificationHistory

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
// SUPPRIMER TOUTES MES NOTIFICATIONS
// =====================================================

router.delete(
    "/all",
    authMiddleware,
    deleteAllMyNotifications
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