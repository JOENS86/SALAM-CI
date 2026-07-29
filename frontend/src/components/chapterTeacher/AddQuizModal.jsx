import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function AddQuizModal({

    isOpen,
    onClose,
    chapterId,
    quiz,
    onQuizCreated

}) {

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (quiz) {

            setTitle(quiz.title || "");

            setDescription(quiz.description || "");

            setQuestions(quiz.questions || []);

        }

        else {

            setTitle("");

            setDescription("");

            setQuestions([]);

        }

    }, [quiz]);

    if (!isOpen) return null;

    // ============================================
    // AJOUTER QUESTION
    // ============================================

    const addQuestion = () => {

        setQuestions([

            ...questions,

            {

                question: "",

                options: ["", "", "", ""],

                correctAnswer: 0,
                
                points: 1

            }

        ]);

    };

    // ============================================
    // SUPPRIMER QUESTION
    // ============================================

    const removeQuestion = (index) => {

        const list = [...questions];

        list.splice(index, 1);

        setQuestions(list);

    };

    // ============================================
    // MODIFIER QUESTION
    // ============================================

    const updateQuestion = (index, value) => {

        const list = [...questions];

        list[index].question = value;

        setQuestions(list);

    };

    // ============================================
    // MODIFIER OPTION
    // ============================================

    const updateOption = (

        questionIndex,

        optionIndex,

        value

    ) => {

        const list = [...questions];

        list[questionIndex]

            .options[optionIndex] = value;

        setQuestions(list);

    };

    // ============================================
    // BONNE REPONSE
    // ============================================

    const updateAnswer = (

        questionIndex,

        value

    ) => {

        const list = [...questions];

        list[questionIndex].correctAnswer = Number(value);

        setQuestions(list);

    };

// ============================================
// MODIFIER POINT QUESTION
// ============================================

const updatePoints = (index, value) => {

    const list = [...questions];

    list[index].points = Number(value);

    setQuestions(list);

};

    // ============================================
    // ENREGISTRER
    // ============================================

    const handleSubmit = async () => {

        if (!title) {

            toast.warning("Veuillez saisir un titre.");

            return;

        }

        try {

            setLoading(true);

            const data = {

                title,

                description,

                chapter: chapterId,

                questions

            };

            if (quiz) {

                await axios.put(

                    `http://localhost:5000/api/quizzes/${quiz._id}`,

                    data

                );

                toast.success("Quiz modifié.");

            }

            else {

                await axios.post(

                    "http://localhost:5000/api/quizzes",

                    data

                );

                toast.success("Quiz créé.");

            }

            onClose();

            onQuizCreated();

        }

        catch (error) {

            console.log(error);

            toast.error("Erreur.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col overflow-hidden ">

                {/* HEADER */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold">

                        {

                            quiz

                            ?

                            "Modifier le Quiz"

                            :

                            "Créer un Quiz"

                        }

                    </h2>

                    <button onClick={onClose}>

                        <FaTimes size={22}/>

                    </button>

                </div>

                <div className="flex-1 overflow-y-auto p-8">

                    {/* TITRE */}

                    <div className="mb-6">

                        <label className="font-semibold">

                            Titre

                        </label>

                        <input

                            value={title}

                            onChange={(e)=>setTitle(e.target.value)}

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="mb-8">

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

                    {/* QUESTIONS */}

                    {

                        questions.map((q,index)=>(

                            <div

                                key={index}

                                className="border rounded-2xl p-6 mb-8"

                            >

                                <div className="flex justify-between items-center mb-5">

                                    <h3 className="font-bold text-xl">

                                        Question {index+1}

                                    </h3>

                                    <button

                                        onClick={()=>removeQuestion(index)}

                                        className="text-red-600"

                                    >

                                        <FaTrash/>

                                    </button>

                                </div>

                                <input

                                    value={q.question}

                                    onChange={(e)=>updateQuestion(index,e.target.value)}

                                    placeholder="Question"

                                    className="w-full border rounded-xl p-3 mb-5"

                                />

                                {

                                    q.options.map((option,i)=>(

                                        <input

                                            key={i}

                                            value={option}

                                            onChange={(e)=>

                                                updateOption(

                                                    index,

                                                    i,

                                                    e.target.value

                                                )

                                            }

                                            placeholder={`Proposition ${i+1}`}

                                            className="w-full border rounded-xl p-3 mb-3"

                                        />

                                    ))

                                }

                                <select

                                    value={q.correctAnswer}

                                    onChange={(e)=>

                                        updateAnswer(

                                            index,

                                            e.target.value

                                        )

                                    }

                                    className="w-full border rounded-xl p-3 mt-4"

                                >

                                    <option value={0}>Bonne réponse : Proposition 1</option>

                                    <option value={1}>Bonne réponse : Proposition 2</option>

                                    <option value={2}>Bonne réponse : Proposition 3</option>

                                    <option value={3}>Bonne réponse : Proposition 4</option>

                                </select>

                                  {/* POINTS QUESTION */}

                            <div className="mt-5">
                                  <label className="font-semibold">
                                      Nombre de points
                                  </label>

                                  <input type="number" min="1" value={q.points}
                                         onChange={(e)=>
                                           updatePoints(
                                              index,
                                              e.target.value
                                            )}

                                        className=" w-full border rounded-xl p-3 mt-2 "/>
                            </div>

                            </div>

                        ))

                    }

                    <button

                        onClick={addQuestion}

                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"

                    >

                        <FaPlus/>

                        Ajouter une question

                    </button>

                    <div className=" mt-6 bg-indigo-100 rounded-xl p-5 ">
                      <h3 className="font-bold text-xl">
                          Total du quiz :&nbsp;
                            {  
                              questions.reduce(
                                (total,q)=> total + q.points,
                                  0
                              )
                            }
                                &nbsp;points
                      </h3>
                    </div>

                </div>

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

                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"

                    >

                        {

                            loading

                            ?

                            "Enregistrement..."

                            :

                            quiz

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

export default AddQuizModal;