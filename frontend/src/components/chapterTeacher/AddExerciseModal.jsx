// ============================================================
// IMPORTS
// ============================================================
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
    FaTimes,
    FaUpload
} from "react-icons/fa";

// ============================================================
// COMPONENT
// ============================================================
function AddExerciseModal({

    isOpen,
    onClose,
    chapterId,
    exercise,
    onExerciseCreated

}) {

    // ========================================================
    // ETATS
    // ========================================================

    const [title,setTitle]=useState("");

    const [description,setDescription]=useState("");

    const [instructions,setInstructions]=useState("");

    const [points,setPoints]=useState(20);

    const [dueDate,setDueDate]=useState("");

    const [attachment,setAttachment]=useState(null);

    const [loading,setLoading]=useState(false);

    // ========================================================
    // EDITION
    // ========================================================

    useEffect(()=>{

        if(exercise){

            setTitle(exercise.title || "");

            setDescription(exercise.description || "");

            setInstructions(exercise.instructions || "");

            setPoints(exercise.points || 20);

            setDueDate(

                exercise.dueDate
                ?

                exercise.dueDate.substring(0,10)

                :

                ""

            );

        }

        else{

            setTitle("");

            setDescription("");

            setInstructions("");

            setPoints(20);

            setDueDate("");

            setAttachment(null);

        }

    },[exercise]);

    if(!isOpen) return null;

    // ========================================================
    // ENREGISTRER
    // ========================================================

    const handleSubmit=async()=>{

        if(!title){

            toast.warning("Veuillez saisir un titre.");

            return;

        }

        try{

            setLoading(true);

            const formData=new FormData();

            formData.append("title",title);

            formData.append("description",description);

            formData.append("instructions",instructions);

            formData.append("points",points);

            formData.append("dueDate",dueDate);

            formData.append("chapter",chapterId);

            if(attachment){

                formData.append("attachment",attachment);

            }

            if(exercise){

                await axios.put(

                    `https://salam-ci-backend.onrender.com/api/exercises/${exercise._id}`,

                    formData,

                    {

                        headers:{

                            "Content-Type":"multipart/form-data"

                        }

                    }

                );

                toast.success("Exercice modifié.");

            }

            else{

                await axios.post(

                    "https://salam-ci-backend.onrender.com/api/exercises",

                    formData,

                    {

                        headers:{

                            "Content-Type":"multipart/form-data"

                        }

                    }

                );

                toast.success("Exercice créé.");

            }

            onClose();

            onExerciseCreated();

        }

        catch(error){

            console.log(error);

            toast.error("Erreur.");

        }

        finally{

            setLoading(false);

        }

    };

    return(

<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

<div className="bg-white rounded-3xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

{/* HEADER */}

<div className="flex justify-between items-center border-b p-6">

<h2 className="text-3xl font-bold">

{

exercise

?

"Modifier l'exercice"

:

"Créer un exercice"

}

</h2>

<button onClick={onClose}>

<FaTimes size={22}/>

</button>

</div>

{/* CONTENU */}

<div className="flex-1 overflow-y-auto p-8 space-y-6">

<div>

<label className="font-semibold">

Titre

</label>

<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

className="w-full border rounded-xl p-3 mt-2"

/>

</div>

<div>

<label className="font-semibold">

Description

</label>

<textarea

rows="3"

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="w-full border rounded-xl p-3 mt-2"

/>

</div>

<div>

<label className="font-semibold">

Consigne

</label>

<textarea

rows="6"

value={instructions}

onChange={(e)=>setInstructions(e.target.value)}

className="w-full border rounded-xl p-3 mt-2"

/>

</div>

<div className="grid grid-cols-2 gap-6">

<div>

<label className="font-semibold">

Nombre de points

</label>

<input

type="number"

value={points}

onChange={(e)=>setPoints(e.target.value)}

className="w-full border rounded-xl p-3 mt-2"

/>

</div>

<div>

<label className="font-semibold">

Date limite

</label>

<input

type="date"

value={dueDate}

onChange={(e)=>setDueDate(e.target.value)}

className="w-full border rounded-xl p-3 mt-2"

/>

</div>

</div>

<div>

<label className="font-semibold">

Pièce jointe

</label>

<input

type="file"

onChange={(e)=>setAttachment(e.target.files[0])}

className="w-full mt-3"

/>

</div>

</div>

{/* FOOTER */}

<div className="border-t p-6 flex justify-end gap-4">

<button

onClick={onClose}

className="bg-gray-200 px-6 py-3 rounded-xl"

>

Annuler

</button>

<button

onClick={handleSubmit}

disabled={loading}

className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

>

<FaUpload/>

{

loading

?

"Enregistrement..."

:

exercise

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

export default AddExerciseModal;