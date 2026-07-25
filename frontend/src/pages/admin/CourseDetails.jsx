import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../services/api";
import { toast } from "react-toastify";

const CourseDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================
    // MODAL MODIFICATION
    // =========================
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

   // =========================
   // FORMULAIRE
   // =========================
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      category: "",
      teacher: ""
    });

    // =========================
    // LISTES
    // =========================
   const [categories, setCategories] = useState([]);
   const [teachers, setTeachers] = useState([]);

   
    const getCourse = async () => {
        try {
          const res = await API.get(`/courses/${id}`);
            console.log(res.data);
            setCourse(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

// =========================
// RÉCUPÉRER LES CATÉGORIES
// =========================
const getCategories = async () => {

    try {

        const res = await API.get("/categories/list");

        setCategories(res.data);

    } catch (error) {

        console.log(error);

    }

};

// =========================
// RÉCUPÉRER LES ENSEIGNANTS
// =========================
const getTeachers = async () => {

    try {

        const res = await API.get("/users/teachers");

        setTeachers(res.data);

    } catch (error) {

        console.log(error);

    }

};


// =========================
// MODIFIER LE COURS
// =========================
const updateCourse = async () => {

    try {

        setSaving(true);

        const res = await API.put(

            `/courses/${id}`,

            {

                title: formData.title,

                description: formData.description,

                category: formData.category,

                teacher: formData.teacher

            }

        );

        toast.success(res.data.message);

        setShowEditModal(false);

        getCourse();

    }

    catch (error) {

        console.log(error);

        toast.error(

            error.response?.data?.message ||
        
            "Erreur lors de la modification."
        
        );

    }

    finally {

        setSaving(false);

    }
};

  useEffect(() => {
    getCourse();
    getCategories();
    getTeachers();
  }, [id]);

   // =========================
   // REMPLIR LE FORMULAIRE
   // =========================
    useEffect(() => {
      if (course) {
        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          teacher: course.teacher?._id || ""
        });
    }
}, [course]);

// =========================
// PUBLIER LE COURS
// =========================
const publishCourse = async () => {

    try {

        const res = await API.patch(

            `/courses/${id}/publish`

        );

        toast.success(res.data.message);

        getCourse();

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Erreur."

        );

    }

};


// =========================
// SUSPENDRE LE COURS
// =========================
const suspendCourse = async () => {

    try {

        const res = await API.patch(

            `/courses/${id}/suspend`

        );

        toast.success(res.data.message);

        getCourse();

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Erreur."

        );

    }

};


// =========================
// SUPPRIMER LE COURS
// =========================
const deleteCourse = async () => {

    try {

        const res = await API.delete(

            `/courses/${id}`

        );

        toast.success(res.data.message);

        setShowDeleteModal(false);

        navigate("/admin/courses");

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Erreur lors de la suppression."

        );

    }

};


    if (loading) {
        return <div className="p-10">Chargement...</div>;
    }

    if (!course) {
        return <div className="p-10">Cours introuvable.</div>;
    }


    return (

        <div className="p-8 space-y-8">
    
            {/* =========================
                BOUTON RETOUR
            ========================= */}
    
            <button
                onClick={() => navigate(-1)}
                className="
                    inline-flex
                    items-center
                    gap-3
                    bg-white
                    px-5
                    py-3
                    rounded-2xl
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    text-gray-700
                    font-semibold
                "
            >
    
                <FaArrowLeft className="text-purple-600" />
    
                Retour aux cours
    
            </button>
    
    
            {/* =========================
                EN-TÊTE
            ========================= */}
    
            <div className="bg-white rounded-3xl shadow-sm p-8">
    
                <div className="flex flex-col lg:flex-row justify-between gap-8">
    
                    {/* Informations */}
    
                    <div className="flex-1">
    
                        <p className="text-purple-600 font-semibold">
    
                            {course.category}
    
                        </p>
    
                        <h1 className="text-5xl font-bold text-gray-800 mt-2">   
                            {course.title}
                        </h1>
    
                        <p className="text-gray-500 mt-5 leading-8">   
                            {course.description}
                        </p>
    
{/* =========================
    ACTIONS
========================= */}

<div className="flex flex-wrap gap-4 mt-8">

    {/* Modifier */}
    <button
        onClick={() => setShowEditModal(true)}
        className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            transition
            font-semibold "
    >
        ✏️ Modifier
    </button>

    {/* Publier */}
    <button
        onClick={publishCourse}
        className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-6
            py-3
            rounded-xl
            transition
            font-semibold"
    >
        🚀 Publier
    </button>

    {/* Suspendre */}
    <button
        onClick={suspendCourse}
        className="
            bg-yellow-500
            hover:bg-yellow-600
            text-white
            px-6
            py-3
            rounded-xl
            transition
            font-semibold"
    >
        ⛔ Suspendre
    </button>

    {/* Supprimer */}
    <button
        onClick={() => setShowDeleteModal(true)}
        className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-6
            py-3
            rounded-xl
            transition
            font-semibold"
    >
        🗑️ Supprimer
    </button>

</div>

                    </div>
    
    
                    {/* Badge */}
    
                    <div>
                        <span
                            className={`
                                px-5
                                py-3
                                rounded-full
                                font-semibold
    
                                ${
                                    course.status === "Publié"
                                        ? "bg-green-100 text-green-700"
                                        : course.status === "Suspendu"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }
                            `}
                        >
    
                            {course.status}
    
                        </span>
                    </div>
    
                </div>
    
            </div>
    
    
    
            {/* =========================
                STATISTIQUES
            ========================= */}
    
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <p className="text-gray-500">
    
                        Étudiants
    
                    </p>
    
                    <h2 className="text-4xl font-bold mt-3">
    
                        {course.studentsCount}
    
                    </h2>
    
                </div>
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <p className="text-gray-500">
    
                        Vues
    
                    </p>
    
                    <h2 className="text-4xl font-bold mt-3">
    
                        {course.views}
    
                    </h2>
    
                </div>
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <p className="text-gray-500">
    
                        Téléchargements
    
                    </p>
    
                    <h2 className="text-4xl font-bold mt-3">
    
                        {course.downloads}
    
                    </h2>
    
                </div>
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <p className="text-gray-500">
    
                        Enseignant
    
                    </p>
    
                    <h2 className="text-xl font-bold mt-3">
    
                        {course.teacher?.name || "Non renseigné"}
    
                    </h2>
    
                </div>
    
            </div>
    
    
    
            {/* =========================
                RESSOURCES
            ========================= */}
    
            <div className="grid lg:grid-cols-3 gap-6">
    
                {/* Image */}
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <h2 className="text-xl font-bold mb-5">
    
                        Image du cours
    
                    </h2>
    
                    {
    
                        course.thumbnail ?
    
                        <img
    
                            src={course.thumbnail}
    
                            alt={course.title}
    
                            className="rounded-2xl w-full h-60 object-cover"
    
                        />
    
                        :
    
                        <div className="h-60 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
    
                            Aucune image
    
                        </div>
    
                    }
    
                </div>
    
    
                {/* PDF */}
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <h2 className="text-xl font-bold">
    
                        Support PDF
    
                    </h2>
    
                    <p className="text-gray-500 mt-3">
    
                        {
    
                            course.pdf ?
    
                            "Le cours possède un document PDF."
    
                            :
    
                            "Aucun PDF disponible."
    
                        }
    
                    </p>
    
                    {
    
                        course.pdf &&
    
                        <a
    
                            href={course.pdf}
    
                            target="_blank"
    
                            rel="noreferrer"
    
                            className="
                                inline-block
                                mt-6
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                transition
                            "
    
                        >
    
                            Ouvrir le PDF
    
                        </a>
    
                    }
    
                </div>
    
    
                {/* Vidéo */}
    
                <div className="bg-white rounded-3xl shadow-sm p-6">
    
                    <h2 className="text-xl font-bold">
    
                        Vidéo
    
                    </h2>
    
                    <p className="text-gray-500 mt-3">
    
                        {
    
                            course.video ?
    
                            "Une vidéo est disponible."
    
                            :
    
                            "Aucune vidéo disponible."
    
                        }
    
                    </p>
    
                    {
    
                        course.video &&
    
                        <a
    
                            href={course.video}
    
                            target="_blank"
    
                            rel="noreferrer"
    
                            className="
                                inline-block
                                mt-6
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                transition
                            "
    
                        >
    
                            Regarder la vidéo
    
                        </a>
    
                    }
    
                </div>
    
            </div>
    
    
    
            {/* =========================
                INFORMATIONS
            ========================= */}
    
            <div className="bg-white rounded-3xl shadow-sm p-8">
    
                <h2 className="text-2xl font-bold mb-8">
    
                    Informations du cours
    
                </h2>
    
                <div className="grid md:grid-cols-2 gap-8">
    
                    <div>
    
                        <p className="text-gray-500">
    
                            Date de création
    
                        </p>
    
                    <h3 className="font-semibold mt-2">
                          {
                        course.createdAt
                        ? new Date(course.createdAt).toLocaleDateString("fr-FR")
                        : "Non disponible"
                          } 
                    </h3>
    
                    </div>
    
                    <div>
    
                        <p className="text-gray-500">
    
                            Date de publication
    
                        </p>
    
                        <h3 className="font-semibold mt-2">
    
                            {
    
                                course.publishedAt
    
                                ?
    
                                new Date(course.publishedAt)
    
                                .toLocaleDateString("fr-FR")
    
                                :
    
                                "Non publié"
    
                            }
    
                        </h3>
    
                    </div>
    
                </div>
    
            </div>
      
{/* =========================
    MODAL MODIFIER LE COURS
========================= */}
{
  showEditModal && (
    <div className=" fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
        <div className=" bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 ">

                {/* Titre */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                 Modifier le cours
              </h2>

                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-3xl text-gray-400 hover:text-red-500"
                >
                    ×
                </button>
            </div>

                {/* Formulaire */}
            <div className="space-y-6">
                <div>
                  <label className="font-semibold">
                        Titre
                  </label>

                        <input 
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }
                            className=" w-full mt-2 border rounded-xl p-3 "
                        />
                </div>

                    <div>
                      <label className="font-semibold">
                            Description
                      </label>

                        <textarea
                            rows="5"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            className=" w-full mt-2 border rounded-xl p-3 "
                        />
                    </div>

            </div>

            <div>
              <label className="font-semibold">
                Catégorie
              </label>
                  
              <select value={formData.category} onChange={(e) =>
                  setFormData({
                      ...formData,
                      category: e.target.value
                   })
                  }
                className=" w-full mt-2 border rounded-xl p-3 " >

              <option value="">
                Sélectionner une catégorie
              </option>
                {
                  categories.map((category) => (
                  <option
                    key={category._id}
                    value={category.name}
                  >
                    {category.name}
              </option>
                 ))
                }
              </select>
            </div>
            
            <div>
              <label className="font-semibold">
                Enseignant
              </label>

              <select value={formData.teacher} onChange={(e) =>
                  setFormData({
                    ...formData,
                    teacher: e.target.value
                  })
                }
                className=" w-full mt-2 border rounded-xl p-3 ">

               <option value=""> 
                  Sélectionner un enseignant
               </option>
                  {
                    teachers.map((teacher) => (
                <option
                  key={teacher._id}
                  value={teacher._id}
                >
                 {teacher.name}
                </option>

                  ))
                 }
              </select>
            </div>

                {/* Boutons */}

            <div className="flex justify-end gap-4 mt-10">
                <button
                  onClick={() => setShowEditModal(false)}
                  className=" px-6 py-3 rounded-xl bg-gray-200 "
                >
                   Annuler
                </button>

                <button
                  onClick={updateCourse}
                  disabled={saving}
                  className={` px-6 py-3 rounded-xl text-white transition-all
                  ${
                      saving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }
                 `}
                >
                  {
                    saving
                    ? "Enregistrement..."
                    : "Enregistrer"
                  }
                </button>
            </div>

        </div>
    </div>
    )
}

{/* =========================
    MODAL SUPPRESSION
========================= */}
{
    showDeleteModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Supprimer le cours
                </h2>

                <p className="text-gray-600 mb-8">
                    Êtes-vous sûr de vouloir supprimer ce cours ?
                    <br />
                    Cette action est irréversible.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={deleteCourse}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        Supprimer
                    </button>
                </div>

            </div>
        </div>

    )
}

        </div>  
    )

};

export default CourseDetails;