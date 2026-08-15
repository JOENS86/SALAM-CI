// ============================================================
// IMPORTS
// ============================================================
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

// ============================================================
// COMPOSANT
// ============================================================
function AddChapterModal({
    isOpen,
    onClose,
    courseId,
    onChapterCreated
}) {

    // ========================================================
    // ETATS DU FORMULAIRE
    // ========================================================
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // ============================================================
    // ETAT DE CHARGEMENT
    // ============================================================
    const [loading, setLoading] = useState(false);

// ============================================================
// CREATION DU CHAPITRE
// ============================================================
const handleCreateChapter = async () => {

    // Vérification du titre
    if (!title.trim()) {

        alert("Veuillez saisir le titre du chapitre.");

        return;

    }

    try {

        setLoading(true);

        // Envoi au backend
        await axios.post(

            "https://salam-ci-backend.onrender.com/api/chapters",

            {

                title,

                description,

                course: courseId,

            }

        );

        // Réinitialisation du formulaire
        setTitle("");

        setDescription("");

        // Fermeture de la fenêtre
        onClose();

        // Rafraîchir la liste des chapitres
        if (onChapterCreated) {

            onChapterCreated();

        }

    } catch (error) {

        console.error(error);

        alert("Erreur lors de la création du chapitre.");

    } finally {

        setLoading(false);

    }

};

    // ========================================================
    // Si la fenêtre est fermée
    // on n'affiche rien.
    // ========================================================
    if (!isOpen) return null;

    return (

        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >

            {/* ==========================
                CONTENU DE LA MODAL
            =========================== */}

            <div
                className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            >

                {/* HEADER */}

                <div
                    className="flex justify-between items-center border-b px-8 py-5"
                >

                    <h2 className="text-2xl font-bold">

                        Ajouter un chapitre

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >

                        <FaTimes size={20} />

                    </button>

                </div>

                {/* BODY */}

                <div className="p-8 space-y-6">

                    {/* TITRE */}

                    <div>

                        <label className="font-semibold">

                            Titre du chapitre

                        </label>

                        <input

                            type="text"

                            value={title}

                            onChange={(e) => setTitle(e.target.value)}

                            className="w-full border rounded-xl px-4 py-3 mt-2"

                            placeholder="Ex : Introduction à React"

                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div>

                        <label className="font-semibold">

                            Description

                        </label>

                        <textarea

                            rows="5"

                            value={description}

                            onChange={(e) => setDescription(e.target.value)}

                            className="w-full border rounded-xl px-4 py-3 mt-2"

                            placeholder="Description du chapitre..."

                        />

                    </div>

                </div>

                {/* FOOTER */}

                <div
                    className="border-t px-8 py-5 flex justify-end gap-4"
                >

                    <button

                        onClick={onClose}

                        className="px-6 py-3 rounded-xl border"

                    >

                        Annuler

                    </button>

                    <button
                      onClick={handleCreateChapter}
                      disabled={loading}
                      className="
                        bg-purple-600
                        hover:bg-purple-700
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        disabled:opacity-50
                    "
                    >
                      {loading ? "Création..." : "Créer"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AddChapterModal;