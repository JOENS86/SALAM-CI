import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    getCommunityPosts,
    createCommunityPost,
    toggleLike,
    addComment,
    deleteComment,
    deleteCommunityPost,
    getCommunityStats
} from "../controllers/communityController.js";

const router = express.Router();


// =====================================================
// PUBLICATIONS
// =====================================================

// Récupérer les publications
// GET /api/community
router.get(
    "/",
    authMiddleware,
    getCommunityPosts
);


// Créer une publication
// POST /api/community
router.post(
    "/",
    authMiddleware,
    createCommunityPost
);


// =====================================================
// STATISTIQUES
// =====================================================

// GET /api/community/stats
router.get(
    "/stats",
    authMiddleware,
    getCommunityStats
);


// =====================================================
// LIKE
// =====================================================

// Ajouter / retirer un like
// PATCH /api/community/:id/like
router.patch(
    "/:id/like",
    authMiddleware,
    toggleLike
);


// =====================================================
// COMMENTAIRES
// =====================================================

// Ajouter un commentaire
// POST /api/community/:id/comments
router.post(
    "/:id/comments",
    authMiddleware,
    addComment
);


// Supprimer un commentaire
// DELETE /api/community/:id/comments/:commentId
router.delete(
    "/:id/comments/:commentId",
    authMiddleware,
    deleteComment
);


// =====================================================
// SUPPRIMER UNE PUBLICATION
// =====================================================

// DELETE /api/community/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteCommunityPost
);


export default router;