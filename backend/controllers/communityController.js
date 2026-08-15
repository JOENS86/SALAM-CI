import CommunityPost from "../models/CommunityPost.js";
import User from "../models/User.js";
import notificationService from "../services/notificationService.js";

// =====================================================
// RECUPERER LES PUBLICATIONS
// =====================================================

export const getCommunityPosts = async (req, res) => {

    try {

        const {
            search = "",
            category = ""
        } = req.query;

        // =================================================
        // CONSTRUCTION DE LA REQUETE
        // =================================================

        const filter = {};

        // Recherche dans le contenu
        if (search.trim()) {

            filter.$or = [
        
                {
                    content: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
        
                {
                    category: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
        
            ];
        
        }

        // Filtre catégorie
        if (category.trim()) {

            filter.category = {
                $regex: `^${category.trim()}$`,
                $options: "i"
            };

        }

        // =================================================
        // RECUPERER LES PUBLICATIONS
        // =================================================

        const posts = await CommunityPost.find(filter)

            .populate(
                "author",
                "name email role"
            )

            .populate(
                "comments.author",
                "name email role"
            )

            .sort({
                createdAt: -1
            });

        // =================================================
        // REPONSE
        // =================================================

        return res.json({

            success: true,

            total: posts.length,

            posts

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur récupération publications :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les publications."

        });

    }

};


// =====================================================
// CREER UNE PUBLICATION
// =====================================================

export const createCommunityPost = async (req, res) => {

    try {

        const {
            content,
            category,
            image = ""
        } = req.body;

        // =================================================
        // VALIDATION
        // =================================================

        if (!content?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Le contenu de la publication est obligatoire."

            });

        }

        if (!category?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "La catégorie est obligatoire."

            });

        }

        // =================================================
        // CREATION
        // =================================================

        const post = await CommunityPost.create({

            author: req.user._id,

            content: content.trim(),

            category: category.trim(),

            image: image || ""

        });

        // =================================================
        // RECUPERER LA PUBLICATION COMPLETE
        // =================================================

        const populatedPost =
            await CommunityPost.findById(post._id)

                .populate(
                    "author",
                    "name email role"
                )

                .populate(
                    "comments.author",
                    "name email role"
                );

        // =================================================
        // NOTIFIER LES AUTRES UTILISATEURS
        // =================================================

        try {

            const users = await User.find({

                _id: {
                    $ne: req.user._id
                }

            }).select("_id");

            for (const user of users) {

                try {

                    await notificationService.create({

                        recipient: user._id,

                        sender: req.user._id,

                        title: "Nouvelle publication",

                        message:
                            `${req.user.name} a publié dans la communauté.`,

                        type: "community_post",

                        entityType: "communityPost",

                        entityId: post._id

                    });

                }

                catch (notificationError) {

                    console.error(
                        "❌ Erreur notification publication :",
                        notificationError.message
                    );

                }

            }

        }

        catch (notificationError) {

            console.error(
                "❌ Erreur notifications communauté :",
                notificationError.message
            );

        }

        // =================================================
        // REPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Publication créée avec succès.",

            post: populatedPost

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur création publication :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de créer la publication."

        });

    }

};


// =====================================================
// LIKER / RETIRER LE LIKE
// =====================================================

export const toggleLike = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const post =
            await CommunityPost.findById(id);

        // =================================================
        // VERIFIER EXISTENCE
        // =================================================

        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Publication introuvable."

            });

        }

        // =================================================
        // VERIFIER SI L'UTILISATEUR A DEJA LIKE
        // =================================================

        const userId =
            req.user._id.toString();

        const alreadyLiked =
            post.likes.some(

                like =>
                    like.toString() === userId

            );

        // =================================================
        // RETIRER LE LIKE
        // =================================================

        if (alreadyLiked) {

            post.likes =
                post.likes.filter(

                    like =>
                        like.toString() !== userId

                );

        }

        // =================================================
        // AJOUTER LE LIKE
        // =================================================

        else {

            post.likes.push(

                req.user._id

            );

            // =============================================
            // NOTIFICATION DE LIKE
            // =============================================

            if (
                post.author.toString()
                !==
                req.user._id.toString()
            ) {

                try {

                    await notificationService.create({

                        recipient: post.author,

                        sender: req.user._id,

                        title: "Nouvelle interaction",

                        message:
                            `${req.user.name} a aimé votre publication.`,

                        type: "community_like",

                        entityType: "communityPost",

                        entityId: post._id

                    });

                }

                catch (notificationError) {

                    console.error(
                        "❌ Erreur notification like :",
                        notificationError.message
                    );

                }

            }

        }

        await post.save();

        // =================================================
        // REPONSE
        // =================================================

        return res.json({

            success: true,

            liked: !alreadyLiked,

            likesCount: post.likes.length,

            postId: post._id

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur like :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de modifier le like."

        });

    }

};


// =====================================================
// AJOUTER UN COMMENTAIRE
// =====================================================
export const addComment = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const {
            content
        } = req.body;

        // =================================================
        // VALIDATION
        // =================================================

        if (!content?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Le commentaire est obligatoire."

            });

        }

        // =================================================
        // PUBLICATION
        // =================================================

        const post =
            await CommunityPost.findById(id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Publication introuvable."

            });

        }

        // =================================================
        // AJOUT COMMENTAIRE
        // =================================================

        post.comments.push({

            author: req.user._id,

            content: content.trim()

        });

        await post.save();

        // =================================================
        // RECUPERER LE COMMENTAIRE
        // =================================================

        const populatedPost =
            await CommunityPost.findById(post._id)

                .populate(
                    "author",
                    "name email role"
                )

                .populate(
                    "comments.author",
                    "name email role"
                );

        const newComment =
            populatedPost.comments[
                populatedPost.comments.length - 1
            ];

        // =================================================
        // NOTIFICATION
        // =================================================

        if (
            post.author.toString()
            !==
            req.user._id.toString()
        ) {

            try {

                await notificationService.create({

                    recipient: post.author,

                    sender: req.user._id,

                    title: "Nouveau commentaire",

                    message:
                        `${req.user.name} a commenté votre publication.`,

                    type: "community_comment",

                    entityType: "communityPost",

                    entityId: post._id

                });

            }

            catch (notificationError) {

                console.error(
                    "❌ Erreur notification commentaire :",
                    notificationError.message
                );

            }

        }

        // =================================================
        // REPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Commentaire ajouté avec succès.",

            comment: newComment,

            commentsCount:
                populatedPost.comments.length

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur commentaire :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible d'ajouter le commentaire."

        });

    }

};


// =====================================================
// SUPPRIMER UN COMMENTAIRE
// =====================================================
export const deleteComment = async (req, res) => {

    try {

        const {
            id,
            commentId
        } = req.params;

        const post =
            await CommunityPost.findById(id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Publication introuvable."

            });

        }

        // =================================================
        // RECHERCHER LE COMMENTAIRE
        // =================================================

        const comment =
            post.comments.id(commentId);

        if (!comment) {

            return res.status(404).json({

                success: false,

                message:
                    "Commentaire introuvable."

            });

        }

        // =================================================
        // AUTORISATION
        // =================================================

        const isCommentAuthor =
            comment.author.toString()
            ===
            req.user._id.toString();

        const isPostAuthor =
            post.author.toString()
            ===
            req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (
            !isCommentAuthor
            &&
            !isPostAuthor
            &&
            !isAdmin
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas autorisé à supprimer ce commentaire."

            });

        }

        // =================================================
        // SUPPRESSION
        // =================================================

        post.comments.pull(commentId);

        await post.save();

        return res.json({

            success: true,

            message:
                "Commentaire supprimé avec succès.",

            commentsCount:
                post.comments.length

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur suppression commentaire :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de supprimer le commentaire."

        });

    }

};


// =====================================================
// SUPPRIMER UNE PUBLICATION
// =====================================================
export const deleteCommunityPost = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const post =
            await CommunityPost.findById(id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Publication introuvable."

            });

        }

        // =================================================
        // AUTORISATION
        // =================================================

        const isAuthor =
            post.author.toString()
            ===
            req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isAuthor && !isAdmin) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas autorisé à supprimer cette publication."

            });

        }

        // =================================================
        // SUPPRESSION
        // =================================================

        await CommunityPost.findByIdAndDelete(id);

        return res.json({

            success: true,

            message:
                "Publication supprimée avec succès."

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur suppression publication :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de supprimer la publication."

        });

    }

};


// =====================================================
// STATISTIQUES COMMUNAUTE
// =====================================================
export const getCommunityStats = async (req, res) => {

    try {

        // =================================================
        // NOMBRE DE PUBLICATIONS
        // =================================================

        const postsCount =
            await CommunityPost.countDocuments();


        // =================================================
        // NOMBRE D'UTILISATEURS
        // =================================================

        const membersCount =
            await User.countDocuments({

                isActive: true

            });


        // =================================================
        // MEMBRES EN LIGNE
        // =================================================

        const onlineMembersCount =
            await User.countDocuments({

                isActive: true,

                isOnline: true

            });


        // =================================================
        // TENDANCES
        // Nombre de publications par catégorie
        // =================================================

        const trends =
            await CommunityPost.aggregate([

                {
                    $group: {

                        _id: "$category",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {

                        count: -1

                    }

                },

                {
                    $limit: 6

                }

            ]);


        // =================================================
        // FORMAT DES TENDANCES
        // =================================================

        const formattedTrends =
            trends.map(trend => ({

                name: trend._id,

                count: trend.count

            }));


        // =================================================
        // REPONSE
        // =================================================

        return res.json({

            success: true,

            stats: {

                posts: postsCount,

                members: membersCount,

                onlineMembers: onlineMembersCount,

                trends: formattedTrends

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur statistiques communauté :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les statistiques."

        });

    }

};

// =====================================================
// PARTAGER UNE PUBLICATION
// =====================================================
export const shareCommunityPost = async (req, res) => {

    try {

        const { id } = req.params;

        // =================================================
        // RECHERCHER LA PUBLICATION
        // =================================================

        const post =
            await CommunityPost.findById(id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Publication introuvable."

            });

        }

        // =================================================
        // INCREMENTER LE NOMBRE DE PARTAGES
        // =================================================

        post.shares =
            (post.shares || 0) + 1;

        await post.save();

        // =================================================
        // NOTIFICATION DE PARTAGE
        // =================================================

        if (
            post.author.toString()
            !==
            req.user._id.toString()
        ) {

            try {

                await notificationService.create({

                    recipient: post.author,

                    sender: req.user._id,

                    title: "Publication partagée",

                    message:
                        `${req.user.name} a partagé votre publication.`,

                    type: "community_share",

                    entityType: "communityPost",

                    entityId: post._id

                });

            }

            catch (notificationError) {

                console.error(
                    "❌ Erreur notification partage :",
                    notificationError.message
                );

            }

        }

        // =================================================
        // REPONSE
        // =================================================

        return res.json({

            success: true,

            message:
                "Publication partagée avec succès.",

            sharesCount:
                post.shares,

            postId:
                post._id

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur partage publication :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de partager la publication."

        });

    }

};