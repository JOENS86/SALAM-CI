import express from "express"

import {

    createConference,
    getConferences,
    getConferenceStats,
    getConferenceById,
    publishConference,
    suspendConference,
    deleteConference

} from "../controllers/conferenceController.js"

const router = express.Router()

// =========================
// STATISTIQUES
// =========================
router.get(
    "/stats",
    getConferenceStats
)

// =========================
// LISTE DES CONFERENCES
// =========================
router.get(
    "/",
    getConferences
)

// =========================
// DETAILS
// =========================
router.get(
    "/:id",
    getConferenceById
)

// =========================
// CREATION
// =========================
router.post(
    "/",
    createConference
)

// =========================
// PUBLIER
// =========================
router.patch(
    "/:id/publish",
    publishConference
)

// =========================
// SUSPENDRE
// =========================
router.patch(
    "/:id/suspend",
    suspendConference
)

// =========================
// SUPPRIMER
// =========================
router.delete(
    "/:id",
    deleteConference
)

export default router