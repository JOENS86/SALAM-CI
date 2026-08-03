// ============================================================
// IMPORTS
// ============================================================

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import API from "../../services/api";


// ============================================================
// COMPONENT
// ============================================================

function EditChapterModal({

    isOpen,

    onClose,

    chapter,

    onUpdated

}) {


    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);



    // ============================================================
    // CHARGER LES DONNEES DU CHAPITRE
    // ============================================================

    useEffect(()=>{


        if(chapter){

            setTitle(chapter.title || "");

            setDescription(chapter.description || "");

        }


    },[chapter]);



    if(!isOpen || !chapter)

        return null;




    // ============================================================
    // MODIFICATION
    // ============================================================

    const handleSubmit = async()=>{


        if(!title){

            toast.warning(
                "Le titre est obligatoire."
            );

            return;

        }



        try{


            setLoading(true);



            await API.put(

                `/chapters/${chapter._id}`,

                {

                    title,

                    description

                }

            );



            toast.success(
                "Chapitre modifié avec succès."
            );



            onUpdated();


            onClose();



        }

        catch(error){


            console.log(error);


            toast.error(
                "Erreur lors de la modification."
            );


        }

        finally{


            setLoading(false);


        }


    };



    return (

        <div
            className="
                fixed
                inset-0
                bg-black/60
                flex
                items-center
                justify-center
                z-50
            "
        >


            <div
                className="
                    bg-white
                    rounded-3xl
                    w-full
                    max-w-xl
                    p-8
                    shadow-2xl
                "
            >


                {/* HEADER */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-8
                    "
                >

                    <h2
                        className="
                            text-3xl
                            font-bold
                        "
                    >

                        Modifier le chapitre

                    </h2>


                    <button
                        onClick={onClose}
                    >

                        <FaTimes size={22}/>

                    </button>


                </div>



                {/* TITRE */}

                <label className="font-semibold">

                    Titre

                </label>


                <input

                    value={title}

                    onChange={(e)=>setTitle(e.target.value)}

                    className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        mt-2
                        mb-6
                    "

                />




                {/* DESCRIPTION */}

                <label className="font-semibold">

                    Description

                </label>


                <textarea

                    rows="4"

                    value={description}

                    onChange={(e)=>setDescription(e.target.value)}

                    className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        mt-2
                    "

                />




                {/* BUTTONS */}

                <div
                    className="
                        flex
                        justify-end
                        gap-4
                        mt-8
                    "
                >


                    <button

                        onClick={onClose}

                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-gray-200
                        "

                    >

                        Annuler

                    </button>




                    <button

                        onClick={handleSubmit}

                        disabled={loading}

                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-green-600
                            hover:bg-green-700
                            text-white
                        "

                    >

                        {
                            loading
                            ?
                            "Modification..."
                            :
                            "Modifier"
                        }


                    </button>



                </div>



            </div>

        </div>

    );

}


export default EditChapterModal;