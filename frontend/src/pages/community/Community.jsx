import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHome,
    FaSearch,
    FaUsers,
    FaHeart,
    FaComment,
    FaShare,
    FaPlus,
    FaTrash,
    FaTimes
} from "react-icons/fa";

import API from "../../services/api";
import socketService from "../../services/socketService";

import NotificationBell from "../../components/NotificationBell";


function Community() {

    const navigate = useNavigate();

    // =====================================================
    // UTILISATEUR CONNECTE
    // =====================================================

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    // =====================================================
    // ETATS
    // =====================================================

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("");

    const [content, setContent] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [publishing, setPublishing] =
        useState(false);

    const [openComments, setOpenComments] =
        useState(null);

    const [commentText, setCommentText] =
        useState("");

    const [commenting, setCommenting] =
        useState(false);

    const [stats, setStats] = useState({

        posts: 0,

        members: 0,

        onlineMembers: 0

    });


    // =====================================================
    // CATEGORIES
    // =====================================================

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // =====================================================
    // RECUPERER LES PUBLICATIONS
    // =====================================================
    const loadPosts = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(

                    "/community",

                    {

                        params: {

                            search,

                            category:
                                selectedCategory

                        }

                    }

                );

            setPosts(
                response.data.posts || []
            );

        }

        catch (error) {

            console.error(
                "❌ Erreur récupération communauté :",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RECUPERER LES STATISTIQUES
    // =====================================================
    const loadStats = async () => {

        try {

            const response =
                await API.get(
                    "/community/stats"
                );

            setStats(
                response.data.stats || {

                    posts: 0,

                    members: 0,

                    onlineMembers: 0

                }
            );

        }

        catch (error) {

            console.error(
                "❌ Erreur statistiques communauté :",
                error
            );

        }

    };

    // =====================================================
    // RECUPERER LES CATEGORIES DEPUIS MONGODB
    // =====================================================
    const loadCategories = async () => {

      try {

          setCategoriesLoading(true);

          const response =
              await API.get("/categories/list");

          setCategories(
              Array.isArray(response.data)
                  ? response.data
                  : []
          );

      }

      catch (error) {

          console.error(
              "❌ Erreur récupération catégories :",
              error
          );

          setCategories([]);

      }

      finally {

          setCategoriesLoading(false);

      }

  };

    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================

    useEffect(() => {

      loadCategories();
  
      loadPosts();
  
      loadStats();
  
  }, [selectedCategory]);


    // =====================================================
    // RECHERCHE AVEC PETIT DELAI
    // =====================================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadPosts();

            }, 400);

        return () => {

            clearTimeout(timer);

        };

    }, [search]);


    // =====================================================
    // SOCKET
    // =====================================================

    useEffect(() => {

        const socket =
            socketService.connect();

        if (!socket) {

            return;

        }

        // =================================================
        // NOUVELLE PUBLICATION
        // =================================================

        const handleNewPost =
            (newPost) => {

                if (!newPost) {

                    return;

                }

                setPosts(
                    previousPosts => {

                        const exists =
                            previousPosts.some(

                                post =>
                                    post._id ===
                                    newPost._id

                            );

                        if (exists) {

                            return previousPosts;

                        }

                        return [

                            newPost,

                            ...previousPosts

                        ];

                    }
                );

                setStats(
                    previous => ({

                        ...previous,

                        posts:
                            previous.posts + 1

                    })
                );

            };


        // =================================================
        // POST MIS A JOUR
        // =================================================

        const handlePostUpdated =
            (updatedPost) => {

                if (!updatedPost) {

                    return;

                }

                setPosts(
                    previousPosts =>

                        previousPosts.map(

                            post =>

                                post._id ===
                                updatedPost._id

                                    ? updatedPost

                                    : post

                        )

                );

            };


        // =================================================
        // POST SUPPRIME
        // =================================================

        const handlePostDeleted =
            (postId) => {

                if (!postId) {

                    return;

                }

                setPosts(
                    previousPosts =>

                        previousPosts.filter(

                            post =>
                                post._id !==
                                postId

                        )

                );

                setStats(
                    previous => ({

                        ...previous,

                        posts:
                            Math.max(
                                0,
                                previous.posts - 1
                            )

                    })
                );

            };


        socket.on(
            "community:post:new",
            handleNewPost
        );

        socket.on(
            "community:post:updated",
            handlePostUpdated
        );

        socket.on(
            "community:post:deleted",
            handlePostDeleted
        );


        // =================================================
        // NETTOYAGE
        // =================================================

        return () => {

            socket.off(
                "community:post:new",
                handleNewPost
            );

            socket.off(
                "community:post:updated",
                handlePostUpdated
            );

            socket.off(
                "community:post:deleted",
                handlePostDeleted
            );

        };

    }, []);


    // =====================================================
    // CREER UNE PUBLICATION
    // =====================================================

    const handleCreatePost =
        async () => {

            if (!content.trim()) {

                return;

            }

            if (!category) {

                return;

            }

            try {

                setPublishing(true);

                const response =
                    await API.post(

                        "/community",

                        {

                            content:
                                content.trim(),

                            category

                        }

                    );

                const newPost =
                    response.data.post;

                setPosts(
                    previousPosts => [

                        newPost,

                        ...previousPosts

                    ]
                );

                setStats(
                    previous => ({

                        ...previous,

                        posts:
                            previous.posts + 1

                    })
                );

                setContent("");

                setCategory("");

            }

            catch (error) {

                console.error(
                    "❌ Erreur création publication :",
                    error
                );

            }

            finally {

                setPublishing(false);

            }

        };


    // =====================================================
    // LIKE
    // =====================================================

    const handleLike =
        async (postId) => {

            try {

                const response =
                    await API.patch(

                        `/community/${postId}/like`

                    );

                const {
                    liked,
                    likesCount
                } = response.data;

                setPosts(
                    previousPosts =>

                        previousPosts.map(

                            post => {

                                if (
                                    post._id !==
                                    postId
                                ) {

                                    return post;

                                }

                                const currentLikes =
                                    post.likes || [];

                                let updatedLikes;

                                if (liked) {

                                    updatedLikes = [

                                        ...currentLikes,

                                        user?._id

                                    ];

                                }

                                else {

                                    updatedLikes =
                                        currentLikes.filter(

                                            id =>

                                                id?.toString() !==
                                                user?._id?.toString()

                                        );

                                }

                                return {

                                    ...post,

                                    likes:
                                        updatedLikes,

                                    likesCount

                                };

                            }

                        )

                );

            }

            catch (error) {

                console.error(
                    "❌ Erreur like :",
                    error
                );

            }

        };


    // =====================================================
    // COMMENTAIRE
    // =====================================================

    const handleComment =
        async (postId) => {

            if (!commentText.trim()) {

                return;

            }

            try {

                setCommenting(true);

                const response =
                    await API.post(

                        `/community/${postId}/comments`,

                        {

                            content:
                                commentText.trim()

                        }

                    );

                const newComment =
                    response.data.comment;

                setPosts(
                    previousPosts =>

                        previousPosts.map(

                            post => {

                                if (
                                    post._id !==
                                    postId
                                ) {

                                    return post;

                                }

                                return {

                                    ...post,

                                    comments: [

                                        ...(post.comments || []),

                                        newComment

                                    ]

                                };

                            }

                        )

                );

                setCommentText("");

            }

            catch (error) {

                console.error(
                    "❌ Erreur commentaire :",
                    error
                );

            }

            finally {

                setCommenting(false);

            }

        };


    // =====================================================
    // SUPPRIMER UNE PUBLICATION
    // =====================================================

    const handleDeletePost =
        async (postId) => {

            const confirmed =
                window.confirm(

                    "Voulez-vous vraiment supprimer cette publication ?"

                );

            if (!confirmed) {

                return;

            }

            try {

                await API.delete(

                    `/community/${postId}`

                );

                setPosts(
                    previousPosts =>

                        previousPosts.filter(

                            post =>
                                post._id !==
                                postId

                        )

                );

                setStats(
                    previous => ({

                        ...previous,

                        posts:
                            Math.max(
                                0,
                                previous.posts - 1
                            )

                    })
                );

            }

            catch (error) {

                console.error(
                    "❌ Erreur suppression publication :",
                    error
                );

            }

        };


    // =====================================================
    // VERIFIER LIKE
    // =====================================================

    const hasLiked =
        (post) => {

            return (
                post.likes || []
            ).some(

                like =>

                    like?.toString() ===
                    user?._id?.toString()

            );

        };


    // =====================================================
    // DATE
    // =====================================================

    const formatDate =
        (date) => {

            if (!date) {

                return "";

            }

            return new Date(
                date
            ).toLocaleDateString(
                "fr-FR",
                {

                    day: "2-digit",

                    month: "2-digit",

                    year: "numeric",

                    hour: "2-digit",

                    minute: "2-digit"

                }
            );

        };


    // =====================================================
    // RENDU
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-100">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">


                    {/* LOGO */}

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                            className="
                                w-8
                                h-8
                                rounded-xl
                                bg-purple-600
                                text-white
                                flex
                                items-center
                                justify-center
                                hover:bg-purple-700
                                transition
                            "
                        >

                            <FaHome />

                        </button>


                        <div className="
                            w-12
                            h-12
                            bg-green-600
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            text-white
                        ">

                            <FaUsers />

                        </div>


                        <h1 className="font-bold text-xl">

                            SALAM CI

                        </h1>

                    </div>


                    {/* RECHERCHE */}

                    <div className="relative w-[400px]">

                        <FaSearch
                            className="
                                absolute
                                left-4
                                top-4
                                text-gray-400
                            "
                        />

                        <input

                            type="text"

                            value={search}

                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            placeholder="
                                Rechercher des discussions...
                            "

                            className="
                                w-full
                                bg-slate-100
                                rounded-xl
                                py-3
                                pl-11
                                pr-4
                                outline-none
                            "

                        />

                    </div>


                    {/* NOTIFICATION + PROFIL */}

                    <div className="flex items-center gap-5">

                        <NotificationBell />


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <div className="
                                w-10
                                h-10
                                bg-blue-500
                                rounded-full
                                text-white
                                flex
                                items-center
                                justify-center
                                font-medium
                            ">

                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                    ||
                                    "U"
                                }

                            </div>


                            <span className="font-medium">

                                {user?.name ||
                                    user?.email
                                }

                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                CONTENU
            ================================================= */}

            <div className="
                max-w-7xl
                mx-auto
                p-6
                grid
                grid-cols-12
                gap-6
            ">


                {/* =================================================
                    COLONNE PRINCIPALE
                ================================================= */}

                <div className="col-span-8">


                    {/* TITRE */}

                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    ">

                        <div>

                            <h1 className="text-3xl font-bold">

                                Communauté Active

                            </h1>


                            <p className="text-gray-500">

                                {stats.posts}
                                {" "}
                                publication
                                {stats.posts > 1
                                    ? "s"
                                    : ""
                                }
                                {" "}
                                dans la communauté

                            </p>

                        </div>


                        <button

                            onClick={() =>
                                document
                                    .getElementById(
                                        "community-composer"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }

                            className="
                                bg-green-600
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                flex
                                items-center
                                gap-2
                                hover:bg-green-700
                                transition
                            "

                        >

                            <FaPlus />

                            Nouvelle publication

                        </button>

                    </div>


                    {/* =================================================
                        COMPOSITEUR
                    ================================================= */}

                    <div
                        id="community-composer"
                        className="
                            bg-white
                            rounded-2xl
                            shadow-sm
                            p-4
                            mb-6
                        "
                    >

                        <div className="flex gap-3">

                            <div className="
                                w-12
                                h-12
                                bg-blue-500
                                rounded-full
                                text-white
                                flex
                                items-center
                                justify-center
                                font-bold
                                flex-shrink-0
                            ">

                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                    ||
                                    "U"
                                }

                            </div>


                            <div className="flex-1">

                                <textarea

                                    value={content}

                                    onChange={(e) =>
                                        setContent(
                                            e.target.value
                                        )
                                    }

                                    placeholder="
                                        Posez une question ou partagez quelque chose...
                                    "

                                    rows="3"

                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        resize-none
                                        focus:ring-2
                                        focus:ring-green-500
                                    "

                                />


                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                    mt-3
                                ">

                                    <select

                                        value={category}

                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value
                                            )
                                        }

                                        className="
                                            border
                                            rounded-xl
                                            px-4
                                            py-2
                                            outline-none
                                            text-gray-600
                                        "

                                    >

                                        <option value="">

                                            Choisir une catégorie

                                        </option>

                                        {categories.map(
                                            item => (

                                                <option
                                                    key={item._id}
                                                    value={item.name}
                                                >

                                                    {item.name}

                                                </option>

                                            )
                                        )}

                                    </select>


                                    <button

                                        onClick={
                                            handleCreatePost
                                        }

                                        disabled={
                                            publishing ||
                                            !content.trim() ||
                                            !category
                                        }

                                        className="
                                            bg-green-600
                                            text-white
                                            px-5
                                            py-2
                                            rounded-xl
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "

                                    >

                                        {publishing
                                            ? "Publication..."
                                            : "Publier"
                                        }

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FILTRE CATEGORIE
                    ================================================= */}

                    <div className="
                        flex
                        gap-2
                        flex-wrap
                        mb-6
                    ">

                        <button

                            onClick={() =>
                                setSelectedCategory("")
                            }

                            className={`
                                px-4
                                py-2
                                rounded-full
                                text-sm
                                ${
                                    !selectedCategory
                                        ? "bg-green-600 text-white"
                                        : "bg-white text-gray-600"
                                }
                            `}

                        >

                            Toutes

                        </button>


                        {categories.map(
                            item => (

                                <button

                                    key={item._id}

                                    onClick={() =>
                                        setSelectedCategory(
                                            item.name
                                        )
                                    }

                                    className={`
                                        px-4
                                        py-2
                                        rounded-full
                                        text-sm
                                        ${
                                            selectedCategory === item.name
                                                ? "bg-green-600 text-white"
                                                : "bg-white text-gray-600"
                                        }
                                    `}

                                >

                                    {item.name}

                                </button>

                            )
                        )}

                    </div>


                    {/* =================================================
                        CHARGEMENT
                    ================================================= */}

                    {loading && (

                        <div className="
                            bg-white
                            rounded-2xl
                            p-8
                            text-center
                            text-gray-500
                        ">

                            Chargement des publications...

                        </div>

                    )}


                    {/* =================================================
                        AUCUNE PUBLICATION
                    ================================================= */}

                    {!loading &&
                        posts.length === 0 && (

                            <div className="
                                bg-white
                                rounded-2xl
                                p-10
                                text-center
                                text-gray-500
                            ">

                                <FaUsers className="
                                    mx-auto
                                    text-4xl
                                    mb-4
                                " />

                                <p className="font-medium">

                                    Aucune publication trouvée.

                                </p>

                                <p className="text-sm mt-1">

                                    Soyez le premier à partager
                                    quelque chose avec la communauté.

                                </p>

                            </div>

                        )
                    }


                    {/* =================================================
                        PUBLICATIONS
                    ================================================= */}

                    {!loading &&
                        posts.map(
                            post => (

                                <div
                                    key={post._id}
                                    className="
                                        bg-white
                                        rounded-2xl
                                        shadow-sm
                                        p-5
                                        mb-5
                                    "
                                >


                                    {/* AUTEUR */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                            <div className="
                                                w-12
                                                h-12
                                                rounded-full
                                                bg-cyan-500
                                                text-white
                                                flex
                                                items-center
                                                justify-center
                                                font-bold
                                            ">

                                                {post.author?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                                    ||
                                                    "U"
                                                }

                                            </div>


                                            <div>

                                                <h3 className="font-bold">

                                                    {post.author?.name ||
                                                        "Utilisateur"
                                                    }

                                                </h3>


                                                <p className="
                                                    text-sm
                                                    text-gray-500
                                                ">

                                                    {post.author?.role ===
                                                        "teacher"
                                                        ? "Enseignant"
                                                        : post.author?.role ===
                                                            "admin"
                                                            ? "Administrateur"
                                                            : "Étudiant"
                                                    }

                                                    {" • "}

                                                    {post.category}

                                                </p>


                                                <p className="
                                                    text-xs
                                                    text-gray-400
                                                ">

                                                    {formatDate(
                                                        post.createdAt
                                                    )}

                                                </p>

                                            </div>

                                        </div>


                                        {/* SUPPRESSION */}

                                        {(
                                            post.author?._id?.toString()
                                            ===
                                            user?._id?.toString()
                                            ||
                                            user?.role === "admin"
                                        ) && (

                                            <button

                                                onClick={() =>
                                                    handleDeletePost(
                                                        post._id
                                                    )
                                                }

                                                className="
                                                    text-gray-400
                                                    hover:text-red-500
                                                "

                                                title="
                                                    Supprimer
                                                "

                                            >

                                                <FaTrash />

                                            </button>

                                        )}

                                    </div>


                                    {/* CONTENU */}

                                    <p className="
                                        mt-4
                                        text-gray-700
                                        whitespace-pre-line
                                    ">

                                        {post.content}

                                    </p>


                                    {/* IMAGE */}

                                    {post.image && (

                                        <img

                                            src={post.image}

                                            alt="Publication"

                                            className="
                                                mt-4
                                                rounded-xl
                                                max-h-96
                                                w-full
                                                object-cover
                                            "

                                        />

                                    )}


                                    {/* ACTIONS */}

                                    <div className="
                                        flex
                                        gap-8
                                        mt-5
                                        text-gray-500
                                        border-t
                                        pt-4
                                    ">


                                        {/* LIKE */}

                                        <button

                                            onClick={() =>
                                                handleLike(
                                                    post._id
                                                )
                                            }

                                            className={`
                                                flex
                                                items-center
                                                gap-2
                                                transition
                                                ${
                                                    hasLiked(post)
                                                        ? "text-red-500"
                                                        : "hover:text-red-500"
                                                }
                                            `}

                                        >

                                            <FaHeart />

                                            {post.likes?.length || 0}

                                        </button>


                                        {/* COMMENTAIRE */}

                                        <button

                                            onClick={() => {

                                                setOpenComments(

                                                    openComments ===
                                                    post._id
                                                        ? null
                                                        : post._id

                                                );

                                            }}

                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                hover:text-blue-500
                                            "

                                        >

                                            <FaComment />

                                            {post.comments?.length || 0}

                                        </button>


                                        {/* PARTAGER */}

                                        <button

                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                hover:text-green-600
                                            "

                                            onClick={() => {

                                                if (
                                                    navigator
                                                        .share
                                                ) {

                                                    navigator.share({

                                                        title:
                                                            post.author?.name,

                                                        text:
                                                            post.content

                                                    });

                                                }

                                            }}

                                        >

                                            <FaShare />

                                            Partager

                                        </button>

                                    </div>


                                    {/* =================================================
                                        COMMENTAIRES
                                    ================================================= */}

                                    {openComments ===
                                        post._id && (

                                        <div className="
                                            mt-4
                                            border-t
                                            pt-4
                                        ">


                                            {/* LISTE */}

                                            <div className="
                                                space-y-3
                                                mb-4
                                            ">

                                                {(
                                                    post.comments || []
                                                ).map(
                                                    comment => (

                                                        <div
                                                            key={
                                                                comment._id
                                                            }
                                                            className="
                                                                bg-slate-50
                                                                rounded-xl
                                                                p-3
                                                            "
                                                        >

                                                            <div className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            ">

                                                                <div className="
                                                                    w-8
                                                                    h-8
                                                                    rounded-full
                                                                    bg-blue-500
                                                                    text-white
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-sm
                                                                    font-bold
                                                                ">

                                                                    {comment.author?.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase()
                                                                        ||
                                                                        "U"
                                                                    }

                                                                </div>


                                                                <span className="font-semibold text-sm">

                                                                    {comment.author?.name ||
                                                                        "Utilisateur"
                                                                    }

                                                                </span>

                                                            </div>


                                                            <p className="
                                                                text-sm
                                                                text-gray-700
                                                                mt-2
                                                                ml-10
                                                            ">

                                                                {comment.content}

                                                            </p>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            {/* AJOUT */}

                                            <div className="
                                                flex
                                                gap-2
                                            ">

                                                <input

                                                    type="text"

                                                    value={
                                                        openComments ===
                                                        post._id
                                                            ? commentText
                                                            : ""
                                                    }

                                                    onChange={(e) =>
                                                        setCommentText(
                                                            e.target.value
                                                        )
                                                    }

                                                    onKeyDown={(e) => {

                                                        if (
                                                            e.key ===
                                                            "Enter"
                                                        ) {

                                                            handleComment(
                                                                post._id
                                                            );

                                                        }

                                                    }}

                                                    placeholder="
                                                        Écrire un commentaire...
                                                    "

                                                    className="
                                                        flex-1
                                                        border
                                                        rounded-xl
                                                        px-4
                                                        py-2
                                                        outline-none
                                                    "

                                                />


                                                <button

                                                    onClick={() =>
                                                        handleComment(
                                                            post._id
                                                        )
                                                    }

                                                    disabled={
                                                        commenting ||
                                                        !commentText.trim()
                                                    }

                                                    className="
                                                        bg-green-600
                                                        text-white
                                                        px-4
                                                        rounded-xl
                                                        disabled:opacity-50
                                                    "

                                                >

                                                    Envoyer

                                                </button>


                                                <button

                                                    onClick={() => {

                                                        setOpenComments(
                                                            null
                                                        );

                                                        setCommentText("");

                                                    }}

                                                    className="
                                                        text-gray-400
                                                        px-2
                                                    "

                                                >

                                                    <FaTimes />

                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            )
                        )
                    }

                </div>


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <div className="col-span-4 space-y-6">


                    {/* CATEGORIES */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        p-5
                    ">

                        <h2 className="
                            font-bold
                            text-xl
                            mb-4
                        ">

                            Catégories

                        </h2>


                        <div className="space-y-3">

                            {categories.map(
                                item => (

                                    <button

                                        key={item._id}

                                        onClick={() =>
                                            setSelectedCategory(
                                                item.name
                                            )
                                        }

                                        className="
                                            block
                                            text-left
                                            w-full
                                            hover:text-green-600
                                            transition
                                        "

                                    >

                                        {item.name}

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* MEMBRES */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        p-5
                    ">

                        <h2 className="
                            font-bold
                            text-xl
                            mb-4
                        ">

                            Membres actifs

                        </h2>


                        <div className="space-y-3">

                            <p className="text-gray-600">

                                🟢 {stats.onlineMembers}
                                {" "}
                                membre
                                {stats.onlineMembers > 1
                                    ? "s"
                                    : ""
                                }
                                {" "}
                                en ligne

                            </p>


                            <p className="text-gray-500 text-sm">

                                {stats.members}
                                {" "}
                                membres inscrits

                            </p>

                        </div>

                    </div>


                    {/* TENDANCES */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        p-5
                    ">

                        <h2 className="
                            font-bold
                            text-xl
                            mb-4
                        ">

                            Tendances

                        </h2>


                        <div className="space-y-3">

                            <p>#React</p>

                            <p>#Cybersécurité</p>

                            <p>#Python</p>

                            <p>#IA</p>

                            <p>#Réseaux</p>

                            <p>#SQL</p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Community;