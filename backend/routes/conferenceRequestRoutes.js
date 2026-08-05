import express from "express";

import {

    createRequest,
    getTeacherRequests,
    getRequestById,
    getPendingRequests,
    approveRequest,
    rejectRequest,
    deleteRequest

} from "../controllers/conferenceRequestController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import { createConferenceSchema } from "../validators/conferenceValidator.js";

const router = express.Router();
console.log("conferenceRequestRoutes chargé");

// =====================================================
// ENSEIGNANT
// =====================================================

// Créer une demande de conférence
router.post(
    "/",
    authMiddleware,
    validate(createConferenceSchema),
    createRequest
);

// Voir toutes les demandes de l'enseignant
router.get(
    "/teacher",
    authMiddleware,
    getTeacherRequests
);

// =====================================================
// ADMIN
// =====================================================

// Voir toutes les demandes en attente
router.get(
    "/pending",
    authMiddleware,
    getPendingRequests
);

// Accepter une demande
router.put(
    "/:id/approve",
    authMiddleware,
    approveRequest
);

// Refuser une demande
router.put(
    "/:id/reject",
    authMiddleware,
    rejectRequest
);

// =====================================================
// SUPPRIMER UNE DEMANDE
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    deleteRequest
);

// =====================================================
// COMMUN
// =====================================================

// Détails d'une demande
// IMPORTANT : cette route doit toujours être la dernière
// sinon "/pending" sera interprété comme un id.
router.get(
    "/:id",
    authMiddleware,
    getRequestById
);

export default router;