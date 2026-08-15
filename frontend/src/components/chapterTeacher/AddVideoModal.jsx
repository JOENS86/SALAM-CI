// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect } from "react";
import axios from "axios";

import {

    FaTimes,
    FaUpload

} from "react-icons/fa";

// ============================================================
// COMPONENT
// ============================================================
function AddVideoModal({

    isOpen,
    onClose,
    chapterId,
    onVideoCreated,
    video: editingVideo

}) {

    // ========================================================
    // ETATS
    // ========================================================

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [duration, setDuration] = useState("");

    const [order, setOrder] = useState("");

    const [videoFile, setVideoFile] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingVideo) {
    
            setTitle(editingVideo.title);
            setDescription(editingVideo.description);
            setDuration(editingVideo.duration);
            setOrder(editingVideo.order);
    
        } else {
    
            setTitle("");
            setDescription("");
            setDuration("");
            setOrder("");
            setVideoFile(null);
    
        }
    }, [editingVideo]);

    // ========================================================
    // FERMEE
    // ========================================================

    if (!isOpen) return null;

    // ========================================================
    // ENREGISTRER
    // ========================================================

    const handleSubmit = async () => {

        if (!title ) {

            successToast("Veuillez renseigner le titre et choisir une vidéo.");

            return;

        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("title", title);

            formData.append("description", description);

            formData.append("duration", duration);

            formData.append("order", order);

            formData.append("chapter", chapterId);

            if (videoFile) {
                formData.append("video", videoFile);
            }

            if(editingVideo){

                await axios.put(
            
                    `https://salam-ci-backend.onrender.com/api/videos/${editingVideo._id}`,

                    formData,
            
                    {
            
                        headers:{
                            "Content-Type":"multipart/form-data"
                        }
            
                    }
            
                );
            
            }else{
            
                await axios.post(
            
                    "https://salam-ci-backend.onrender.com/api/videos",
            
                    formData,
            
                    {
            
                        headers:{
                            "Content-Type":"multipart/form-data"
                        }
            
                    }
            
                );
            
            }

            setTitle("");

            setDescription("");

            setDuration("");

            setOrder("");

            setVideoFile(null);

            onClose();

            if (onVideoCreated) {

                onVideoCreated();

            }

        }

        catch (error) {

            console.log(error);

            errorToast("Erreur lors de l'ajout.");

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl">

                {/* ===================================== */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold">

                    {
                      editingVideo
                      ?
                      "Modifier la vidéo"
                       :
                      "Ajouter une vidéo"
                    }

                    </h2>

                    <button onClick={onClose}>

                        <FaTimes size={22} />

                    </button>

                </div>

                {/* ===================================== */}

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

                        />

                    </div>

                    {/* DUREE */}

                    <div>

                        <label className="font-semibold">

                            Durée

                        </label>

                        <input

                            type="text"

                            placeholder="Ex : 12 min"

                            value={duration}

                            onChange={(e)=>setDuration(e.target.value)}

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                    {/* ORDRE */}

                    <div>

                        <label className="font-semibold">

                            Ordre

                        </label>

                        <input

                            type="number"

                            value={order}

                            onChange={(e)=>setOrder(e.target.value)}

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                    {/* VIDEO */}

                    <div>

                        <label className="font-semibold">

                            Vidéo

                        </label>

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e)=>setVideoFile(e.target.files[0])}
                            className="w-full mt-3"
                        />

                    </div>

                </div>

                {/* ===================================== */}

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

                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 flex items-center gap-2"

                    >

                        <FaUpload />

                        {

                          loading
                            ?
                            "Enregistrement..."
                            :
                            editingVideo
                            ?
                            "Modifier"
                            :
                            "Créer"
                       }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AddVideoModal;