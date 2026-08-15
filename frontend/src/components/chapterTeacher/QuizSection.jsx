// ============================================================
// IMPORTS
// ============================================================
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaQuestionCircle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaList
} from "react-icons/fa";

import QuizModal from "./AddQuizModal";
import DeleteQuizModal from "./DeleteQuizModal";

// ============================================================
// COMPONENT
// ============================================================
function QuizSection({ chapterId }) {

    // ========================================================
    // QUIZZES
    // ========================================================

    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(true);

    // ========================================================
    // MODALS
    // ========================================================

    const [showModal, setShowModal] = useState(false);

    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [quizToDelete, setQuizToDelete] = useState(null);

    // ========================================================
    // FETCH
    // ========================================================

    const fetchQuizzes = async () => {

        try {

            const res = await axios.get(

                `https://salam-ci-backend.onrender.com/api/quizzes/chapter/${chapterId}`

            );

            setQuizzes(res.data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    const deleteQuiz = async (id) => {

        try {
    
            await axios.delete(
                `https://salam-ci-backend.onrender.com/api/quizzes/${id}`
            );
    
            setShowDeleteModal(false);
            setQuizToDelete(null);
    
            fetchQuizzes();
    
        }
    
        catch (error) {
    
            console.log(error);
    
        }
    
    };

    useEffect(()=>{

        fetchQuizzes();

    },[]);

    return (

        <div className="bg-gray-50 rounded-3xl p-8 mt-8">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <FaQuestionCircle className="text-indigo-600 text-3xl"/>

                    <h2 className="text-3xl font-bold">

                        Quiz

                    </h2>

                </div>

                <button

                    onClick={()=>{

                        setSelectedQuiz(null);

                        setShowModal(true);

                    }}

                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"

                >

                    <FaPlus/>

                    Ajouter un Quiz

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

                quizzes.length===0 ?

                (

                    <div className="text-center py-16">

                        <FaQuestionCircle className="mx-auto text-6xl text-indigo-200"/>

                        <h3 className="text-2xl font-bold mt-6">

                            Aucun Quiz

                        </h3>

                    </div>

                )

                :

                (

                    quizzes.map((quiz)=>(

                        <div

                            key={quiz._id}

                            className="bg-white rounded-2xl shadow p-6 mb-5"

                        >

                            <div className="flex justify-between">

                                <div>

                                    <h3 className="text-xl font-bold">

                                        {quiz.title}

                                    </h3>

                                    <p className="text-gray-500 mt-2">

                                        {quiz.description}

                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-indigo-600">

                                        <FaList/>

                                        {quiz.questions.length} Questions

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <button

                                        onClick={()=>{

                                            setSelectedQuiz(quiz);

                                            setShowModal(true);

                                        }}

                                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl"

                                    >

                                        <FaEdit/>

                                    </button>

                                    <button

                                        onClick={()=>{

                                            setQuizToDelete(quiz);

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

            <QuizModal

                isOpen={showModal}

                onClose={()=>{

                    setShowModal(false);

                    setSelectedQuiz(null);

                }}

                chapterId={chapterId}

                quiz={selectedQuiz}

                onQuizCreated={fetchQuizzes}

            />

<DeleteQuizModal

    isOpen={showDeleteModal}

    quiz={quizToDelete}

    onClose={() => {

        setShowDeleteModal(false);

        setQuizToDelete(null);

    }}

    onConfirm={() => deleteQuiz(quizToDelete._id)}

/>

        </div>

    );

}

export default QuizSection;