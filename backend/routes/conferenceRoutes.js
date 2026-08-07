import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {

    startConference,
    endConference,
    getConferenceById,
    getAllConferences,
    getLiveConferences,
    getUpcomingConferences,
    getHistoryConferences,
    getTeacherConferences,
    getStudentConferences,
    joinConference,
    leaveConference,
    getParticipants,
    testEmail

} from "../controllers/conferenceController.js";

const router = express.Router();

// Mail
router.get(

    "/test-email",

    testEmail

);

// =====================================================
// ENSEIGNANT
// =====================================================

// Mes conférences

router.get(

    "/teacher",

    authMiddleware,

    getTeacherConferences

);

// Démarrer une conférence

router.put(

    "/:id/start",

    authMiddleware,

    startConference

);

// Terminer une conférence

router.put(

    "/:id/end",

    authMiddleware,

    endConference

);

// =====================================================
// ETUDIANT
// =====================================================

// Voir ses conférences

router.get(

    "/student",

    authMiddleware,

    getStudentConferences

);

// Rejoindre

router.post(

    "/:id/join",

    authMiddleware,

    joinConference

);

// Quitter

router.post(

    "/:id/leave",

    authMiddleware,

    leaveConference

);


// =====================================================
// TOUTES LES CONFERENCES
// =====================================================

router.get(

    "/",

    authMiddleware,

    getAllConferences

);

// =====================================================
// CONFERENCES EN DIRECT
// =====================================================

router.get(

    "/live",

    authMiddleware,

    getLiveConferences

);

// =====================================================
// CONFERENCES PROGRAMMEES
// =====================================================

router.get(

    "/upcoming",

    authMiddleware,

    getUpcomingConferences

);

// =====================================================
// HISTORIQUE
// =====================================================

router.get(

    "/history",

    authMiddleware,

    getHistoryConferences

);


// =====================================================
// COMMUN
// =====================================================
// Détails
router.get(

    "/:id",

    authMiddleware,

    getConferenceById

);

// Participants

router.get(

    "/:id/participants",

    authMiddleware,

    getParticipants

);



export default router;