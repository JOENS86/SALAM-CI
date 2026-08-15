// ============================================================
// IMPORTS
// ============================================================
import axios from "axios";
import { toast } from "react-toastify";

import {
    FaTrash
} from "react-icons/fa";

// ============================================================
// COMPONENT
// ============================================================
function DeleteExerciseModal({

    isOpen,

    exercise,

    onClose,

    onDeleted

}) {

    if (!isOpen || !exercise) return null;

    // ========================================================
    // SUPPRIMER
    // ========================================================

    const handleDelete = async () => {

        try {

            await axios.delete(

                `https://salam-ci-backend.onrender.com/api/exercises/${exercise._id}`

            );

            toast.success("Exercice supprimé avec succès.");

            onClose();

            onDeleted();

        }

        catch (error) {

            console.log(error);

            toast.error("Impossible de supprimer l'exercice.");

        }

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl w-[520px] shadow-2xl p-8">

                {/* ========================================= */}
                {/* ICONE */}
                {/* ========================================= */}

                <div className="flex justify-center mb-6">

                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">

                        <FaTrash className="text-red-600 text-3xl "/>

                    </div>

                </div>

                {/* ========================================= */}
                {/* TITRE */}
                {/* ========================================= */}

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-center
                    "
                >

                    Supprimer l'exercice ?

                </h2>

                {/* ========================================= */}
                {/* MESSAGE */}
                {/* ========================================= */}

                <p
                    className="
                        text-gray-500
                        text-center
                        mt-5
                        leading-8
                    "
                >

                    Vous êtes sur le point de supprimer définitivement cet exercice.

                    <br />

                    Cette action est irréversible.

                </p>

                {/* ========================================= */}
                {/* INFOS */}
                {/* ========================================= */}

                <div
                    className="
                        bg-gray-100
                        rounded-2xl
                        mt-8
                        p-5
                    "
                >

                    <h3
                        className="
                            font-bold
                            text-xl
                        "
                    >

                        {exercise.title}

                    </h3>

                    {

                        exercise.description &&

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >

                            {exercise.description}

                        </p>

                    }

                </div>

                {/* ========================================= */}
                {/* BOUTONS */}
                {/* ========================================= */}

                <div
                    className="
                        flex
                        justify-end
                        gap-4
                        mt-10
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-gray-200
                            hover:bg-gray-300
                        "

                    >

                        Annuler

                    </button>

                    <button

                        onClick={handleDelete}

                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-red-600
                            hover:bg-red-700
                            text-white
                        "

                    >

                        Supprimer

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteExerciseModal;