// ============================================================
// IMPORTS
// ============================================================
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaTasks,
    FaPlus,
    FaEdit,
    FaTrash,
    FaDownload,
    FaCalendarAlt,
    FaStar
} from "react-icons/fa";

import AddExerciseModal from "./AddExerciseModal";
import DeleteExerciseModal from "./DeleteExerciseModal";

// ============================================================
// COMPONENT
// ============================================================
function ExerciseSection({ chapterId }) {

    // ========================================================
    // ETATS
    // ========================================================

    const [exercises, setExercises] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [selectedExercise, setSelectedExercise] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [exerciseToDelete, setExerciseToDelete] = useState(null);

    // ========================================================
    // RECUPERER LES EXERCICES
    // ========================================================

    const fetchExercises = async () => {

        try {

            const res = await axios.get(

                `https://salam-ci-backend.onrender.com/api/exercises/chapter/${chapterId}`

            );

            setExercises(res.data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        fetchExercises();

    },[]);

    // ========================================================
    // TELECHARGER
    // ========================================================

    const downloadAttachment = (exercise)=>{

        if(!exercise.attachment) return;

        const link = document.createElement("a");

        link.href=`https://salam-ci-backend.onrender.com/${exercise.attachment}`;

        link.download=exercise.title;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };

    return(

        <div className="bg-gray-50 rounded-3xl p-8 mt-8">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <FaTasks className="text-orange-600 text-3xl"/>

                    <h2 className="text-3xl font-bold">

                        Exercices

                    </h2>

                </div>

                <button

                    onClick={()=>{

                        setSelectedExercise(null);

                        setShowModal(true);

                    }}

                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"

                >

                    <FaPlus/>

                    Ajouter un exercice

                </button>

            </div>

            {/* LISTE */}

            <div className="mt-8">

            {

                loading ?

                (

                    <p>Chargement...</p>

                )

                :

                exercises.length===0 ?

                (

                    <div className="text-center py-16">

                        <FaTasks className="mx-auto text-6xl text-orange-200"/>

                        <h3 className="text-2xl font-bold mt-6">

                            Aucun exercice

                        </h3>

                    </div>

                )

                :

                (

                    exercises.map((exercise)=>(

                        <div

                            key={exercise._id}

                            className="bg-white rounded-2xl shadow p-6 mb-5"

                        >

                            <div className="flex justify-between">

                                <div>

                                    <h3 className="text-xl font-bold">

                                        {exercise.title}

                                    </h3>

                                    <p className="text-gray-500 mt-2">

                                        {exercise.description}

                                    </p>

                                    <div className="flex gap-6 mt-5 text-sm">

                                        <span className="flex items-center gap-2">

                                            <FaStar/>

                                            {exercise.points} pts

                                        </span>

                                        <span className="flex items-center gap-2">

                                            <FaCalendarAlt/>

                                            {

                                                exercise.dueDate ?

                                                new Date(exercise.dueDate).toLocaleDateString()

                                                :

                                                "Aucune date"

                                            }

                                        </span>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    {

                                        exercise.attachment &&

                                        <button

                                            onClick={()=>downloadAttachment(exercise)}

                                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"

                                        >

                                            <FaDownload/>

                                        </button>

                                    }

                                    <button

                                        onClick={()=>{

                                            setSelectedExercise(exercise);

                                            setShowModal(true);

                                        }}

                                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl"

                                    >

                                        <FaEdit/>

                                    </button>

                                    <button

                                        onClick={()=>{

                                            setExerciseToDelete(exercise);

                                            setShowDeleteModal(true);

                                        }}

                                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl"

                                    >

                                        <FaTrash/>

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                )

            }

            </div>

            <AddExerciseModal

                isOpen={showModal}

                onClose={()=>{

                    setShowModal(false);

                    setSelectedExercise(null);

                }}

                chapterId={chapterId}

                exercise={selectedExercise}

                onExerciseCreated={fetchExercises}

            />

            <DeleteExerciseModal

                isOpen={showDeleteModal}

                exercise={exerciseToDelete}

                onClose={()=>{

                    setShowDeleteModal(false);

                    setExerciseToDelete(null);

                }}

                onDeleted={fetchExercises}

            />

        </div>

    );

}

export default ExerciseSection;