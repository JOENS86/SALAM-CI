// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {

    FaTimes,
    FaUpload

} from "react-icons/fa";

// ============================================================
// COMPONENT
// ============================================================
function AddPdfModal({

    isOpen,
    onClose,
    chapterId,
    onPdfCreated,
    pdf

}) {

    // ========================================================
    // ETATS
    // ========================================================

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [pdfFile, setPdfFile] = useState(null);

    const [loading, setLoading] = useState(false);


// ========================================================
// ENREGISTRER
// ========================================================
const handleSubmit = async () => {

    // =====================================
    // VALIDATION
    // =====================================

    if (!title.trim()) {

        toast.warning("Veuillez saisir le titre du document.");

        return;

    }

    // Lors d'un ajout, le PDF est obligatoire
    if (!pdf && !pdfFile) {

        toast.warning("Veuillez sélectionner un fichier PDF.");

        return;

    }

    try {

        setLoading(true);

        // =====================================
        // CREATION DU FORMDATA
        // =====================================

        const formData = new FormData();

        formData.append("title", title);

        formData.append("description", description);

        formData.append("chapter", chapterId);

        if (pdfFile) {

            formData.append("pdf", pdfFile);

        }

        // =====================================
        // MODIFICATION
        // =====================================

        if (pdf) {

            await axios.put(

                `https://salam-ci-backend.onrender.com/api/pdfs/${pdf._id}`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            toast.success("Document modifié avec succès.");

        }

        // =====================================
        // AJOUT
        // =====================================

        else {

            await axios.post(

                "https://salam-ci-backend.onrender.com/api/pdfs",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            toast.success("Document ajouté avec succès.");

        }

        // =====================================
        // RAFRAICHIR LA LISTE
        // =====================================

        onPdfCreated();

        // =====================================
        // REINITIALISER LE FORMULAIRE
        // =====================================

        setTitle("");

        setDescription("");

        setPdfFile(null);

        // =====================================
        // FERMER LA MODAL
        // =====================================

        onClose();

    }

    catch (error) {

        console.error(error);

        toast.error(

            error.response?.data?.message ||

            "Erreur lors de l'enregistrement."

        );

    }

    finally {

        setLoading(false);

    }

};

// ========================================================
// REMPLISSAGE AUTOMATIQUE
// SI MODIFICATION
// ========================================================

useEffect(() => {

    if (!isOpen) return;

    if (pdf) {

        setTitle(pdf.title);

        setDescription(pdf.description);

        setPdfFile(null);

    }

    else {

        setTitle("");

        setDescription("");

        setPdfFile(null);

    }

}, [pdf, isOpen]);

    // ========================================================
    // FERMEE
    // ========================================================

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">

                {/* HEADER */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold">

                    {
                      pdf
                      ? "Modifier le document"
                      : "Ajouter un document PDF"
                    }

                    </h2>

                    <button onClick={onClose}>

                        <FaTimes size={22} />

                    </button>

                </div>

                {/* BODY */}

                <div className="p-8 space-y-6">

                    {/* TITRE */}

                    <div>

                        <label className="font-semibold">

                            Titre

                        </label>

                        <input

                            type="text"

                            value={title}

                            onChange={(e)=>setTitle(e.target.value)}

                            className="w-full border rounded-xl p-3 mt-2"

                            placeholder="Ex : Support du chapitre"

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

                            onChange={(e)=>setDescription(e.target.value)}

                            className="w-full border rounded-xl p-3 mt-2"

                            placeholder="Description du document"

                        />

                    </div>

                    {/* PDF */}

                    <div>

                        <label className="font-semibold">

                            Document PDF

                        </label>

                        <input

                            type="file"

                            accept=".pdf"

                            onChange={(e)=>setPdfFile(e.target.files[0])}

                            className="w-full mt-3"

                        />

                    </div>

                </div>

                {/* FOOTER */}

                <div className="border-t p-6 flex justify-end gap-4">

                    <button

                        onClick={onClose}

                        className="border rounded-xl px-6 py-3"

                    >

                        Annuler

                    </button>

                    <button

onClick={handleSubmit}

disabled={loading}

className="
    bg-red-600
    hover:bg-red-700
    disabled:bg-gray-400
    text-white
    rounded-xl
    px-6
    py-3
    flex
    items-center
    gap-2
    transition
"

>

<FaUpload />

{

    loading

        ? "Enregistrement..."

        : pdf

            ? "Modifier"

            : "Créer"

}

</button>

                </div>

            </div>

        </div>

    );

}

export default AddPdfModal;