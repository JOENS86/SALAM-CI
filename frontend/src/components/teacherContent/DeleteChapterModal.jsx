import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function DeleteChapterModal({

    isOpen,

    chapter,

    onClose,

    onDeleted

}) {

    if (!isOpen || !chapter) return null;

    const handleDelete = async () => {

        try {

            await axios.delete(

                `https://salam-ci-backend.onrender.com/api/chapters/${chapter._id}`

            );

            toast.success("Chapitre supprimé.");

            onClose();
            
            onDeleted();

        }

        catch (error) {

            console.log(error);

            toast.error("Erreur lors de la suppression.");

        }

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl w-[520px] p-8">

                <div className="flex justify-center">

                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">

                        <FaTrash className="text-red-600 text-3xl"/>

                    </div>

                </div>

                <h2 className="text-3xl font-bold text-center mt-6">

                    Supprimer ce chapitre ?

                </h2>

                <p className="text-gray-500 text-center mt-5">

                    Cette action supprimera définitivement

                    <br/>

                    <strong>{chapter.title}</strong>

                </p>

                <div className="flex justify-end gap-4 mt-10">

                    <button

                        onClick={onClose}

                        className="bg-gray-200 px-6 py-3 rounded-xl"

                    >

                        Annuler

                    </button>

                    <button

                        onClick={handleDelete}

                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"

                    >

                        Supprimer

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteChapterModal;