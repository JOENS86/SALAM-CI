import mongoose from "mongoose";

// =====================================================
// SOUS-DOCUMENT : COMMENTAIRE
// =====================================================

const commentSchema = new mongoose.Schema(

    {

        // =================================================
        // AUTEUR DU COMMENTAIRE
        // =================================================

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        // =================================================
        // CONTENU
        // =================================================

        content: {

            type: String,

            required: true,

            trim: true,

            maxlength: 1000

        }

    },

    {

        timestamps: true

    }

);


// =====================================================
// MODELE : PUBLICATION COMMUNAUTAIRE
// =====================================================

const communityPostSchema = new mongoose.Schema(

    {

        // =================================================
        // AUTEUR
        // =================================================

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },


        // =================================================
        // CONTENU DE LA PUBLICATION
        // =================================================

        content: {

            type: String,

            required: true,

            trim: true,

            maxlength: 5000

        },


        // =================================================
        // CATEGORIE
        // =================================================

        category: {

            type: String,

            required: true,

            trim: true,

            maxlength: 100

        },


        // =================================================
        // IMAGE OPTIONNELLE
        // =================================================

        image: {

            type: String,

            default: ""

        },


        // =================================================
        // LIKES
        // =================================================
        // On conserve les utilisateurs qui ont aimé
        // afin d'éviter les doubles likes.

        likes: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // =================================================
        // COMMENTAIRES
        // =================================================

        comments: [

            commentSchema

        ],


        // =================================================
        // NOMBRE DE PARTAGES
        // =================================================

        shares: {

            type: Number,

            default: 0

        }

    },

    {

        timestamps: true

    }

);


// =====================================================
// INDEX
// =====================================================

// Publications récentes

communityPostSchema.index({

    createdAt: -1

});


// Recherche par catégorie

communityPostSchema.index({

    category: 1,

    createdAt: -1

});


// =====================================================
// EXPORT
// =====================================================
export default mongoose.model(

    "CommunityPost",

    communityPostSchema

);