import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

function AddCourse() {

    // ==========================================
    // UTILISATEUR CONNECTÉ
    // ==========================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const navigate = useNavigate();

    // ==========================================
    // ETATS DU FORMULAIRE
    // ==========================================

    const [formData, setFormData] = useState({

        title: "",
        description: "",
        category: ""

    });

    // ==========================================
    // MINIATURE DU COURS
    // ==========================================

    const [thumbnail, setThumbnail] = useState(null);

    // ==========================================
    // APERÇU DE LA MINIATURE
    // ==========================================

    const [preview, setPreview] = useState("");

    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] = useState(false);

    // ==========================================
    // LISTE DES CATÉGORIES
    // ==========================================

    const [categories, setCategories] = useState([]);

    // ==========================================
    // CHAMP TEXTE
    // ==========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    // ==========================================
    // IMAGE
    // ==========================================

    const handleThumbnail = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setThumbnail(file);

        setPreview(URL.createObjectURL(file));

    };

    // ==========================================
    // ENREGISTRER LE COURS
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = new FormData();

            data.append("title", formData.title);

            data.append("description", formData.description);

            data.append("category", formData.category);

            data.append("teacher", user._id);

            if (thumbnail) {

                data.append("thumbnail", thumbnail);

            }

            const res = await API.post(

                "/courses/create",

                data

            );

            toast.success(

                res.data.message ||

                "Cours créé avec succès."

            );

            // Plus tard on remplacera cette ligne
            // par la page de gestion du contenu

            navigate("/teacher-courses");

        }

        catch (error) {

            console.log("Erreur complète :", error);

            console.log("Réponse backend :", error.response);
        
            console.log("Données :", error.response?.data);

            toast.error(

                error.response?.data?.message ||

                "Erreur lors de la création du cours."

            );

        }

        finally {

            setLoading(false);

        }

    }

// ==========================================
// CHARGER LES CATÉGORIES
// ==========================================

const loadCategories = async () => {

    try {

        const res = await API.get("/categories/list");

        setCategories(res.data);

    }

    catch (error) {

        console.log(error);

        toast.error("Impossible de charger les catégories.");

    }

};

useEffect(() => {

    loadCategories();

}, []);


  return (

<div className="max-w-7xl mx-auto p-10">

        {/* HEADER */}

    <div className="flex justify-between items-center mb-6">

      <button onClick={() => navigate("/teacher-courses")}
        className="
          flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition " >
        <FaArrowLeft />
            Retour
      </button>
    </div>


    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-5xl font-bold">
          Ajouter un cours
        </h1>

        <p className="mt-3 text-purple-100">
            Créez un nouveau cours. Vous pourrez ensuite ajouter les chapitres, les vidéos, les documents PDF et les quiz depuis l'espace de gestion du contenu.        
        </p>
    </div>

{/* ==========================================
    INFORMATION
========================================== */}

<div
    className="
        mt-8
        bg-blue-50
        border-l-4
        border-blue-500
        rounded-2xl
        p-6
    "
>

    <h3 className="text-lg font-bold text-blue-700">

        💡 Comment fonctionne la création d'un cours ?

    </h3>

    <p className="text-gray-700 mt-3 leading-7">

        Cette étape permet uniquement de créer les informations
        générales de votre cours.

        <br /><br />

        Une fois le cours créé, vous pourrez accéder à
        <strong> l'espace de gestion du contenu </strong>
        afin d'ajouter vos chapitres, vidéos, documents PDF,
        quiz et exercices.

    </p>

</div>

    <form
  onSubmit={handleSubmit}
  className="mt-10 space-y-8"
>

  {/* INFOS */}

  <div className="bg-white rounded-3xl shadow-md p-8">

    <h2 className="text-2xl font-bold mb-6">
      Informations du cours
    </h2>

    <div className="space-y-5">

        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Titre du cours"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
        />

      <textarea
        name="description"
        value={formData.description}
        placeholder="Description du cours"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-2xl p-4 h-40 focus:outline-none focus:border-purple-500"
      />

{/* =========================
    CATÉGORIE
========================= */}

<select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="
        w-full
        border
        border-gray-300
        rounded-2xl
        p-4
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
    "
>
    <option value="">
        Sélectionner une catégorie
    </option>

    {categories.map((category) => (
        <option
            key={category._id}
            value={category.name}
        >
            {category.name}
        </option>
    ))}
</select>

    </div>

  </div>


{/* ======================================
    MINIATURE DU COURS
====================================== */}

  <div className="bg-white rounded-3xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">
          Miniature du cours
      </h2>

      <div className="
            border-2
            border-dashed
            border-purple-300
            rounded-2xl
            p-8
            text-center "
      >

          <p className="font-semibold text-lg">
            Choisissez une image représentative du cours
          </p>

          <p className="text-gray-500 mt-2 mb-6">
            Cette image sera affichée dans le catalogue
            et dans les résultats de recherche.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnail}
          />

{
    preview && (

        <div className="mt-8">

            <img
                src={preview}
                alt="Miniature du cours"
                className="
                    w-full
                    h-72
                    object-cover
                    rounded-2xl
                    shadow-lg
                "
            />

        </div>

    )
}

    </div>
</div>

  {/* BOUTON */}

  <div className="flex justify-end">

  <button
    type="submit"
    disabled={loading}
    className="
        bg-gradient-to-r
        from-purple-600
        to-indigo-600
        text-white
        px-10
        py-4
        rounded-2xl
        shadow-lg
        transition
        hover:scale-105
        disabled:opacity-60
        disabled:cursor-not-allowed
        disabled:hover:scale-100
    "
>

    {
        loading
            ? "Création du cours..."
            : "Créer le cours"
    }

</button>

  </div>
</form>

</div>

  )
}

export default AddCourse