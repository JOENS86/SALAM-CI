import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import TeacherLayout from "../../layouts/TeacherLayout";
import enrollmentService from "../../services/enrollmentService";
import { errorToast } from "../../utils/toast";

function StudentDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadEnrollment();

    }, []);

    const loadEnrollment = async () => {

        try {

            const result = await enrollmentService.getEnrollment(id);

console.log(result);
console.log(result.enrollment);
console.log(result.enrollment.course);
console.log(result.enrollment.course.teacher);

            setEnrollment(result.enrollment);

        }

        catch (error) {

            console.log(error);

            errorToast(

                "Erreur",

                "Impossible de charger cet étudiant."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <TeacherLayout>

                <div className="p-10">

                    Chargement...

                </div>

            </TeacherLayout>

        );

    }

    if (!enrollment) {

        return (

            <TeacherLayout>

                <div className="p-10">

                    Étudiant introuvable.

                </div>

            </TeacherLayout>

        );

    }

    return (

        <TeacherLayout>

            <div className="space-y-8">

                <div>

                    <button

                        onClick={() => navigate(-1)}

                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-4"

                    >

                        <FaArrowLeft />

                        Retour

                    </button>

                    <h1 className="text-4xl font-bold">

                        Détails de l'étudiant

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Consultez les informations de votre étudiant.

                    </p>

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-6 mb-10">

                        <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-600">

                            {enrollment.student.name.charAt(0)}

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">

                                {enrollment.student.name}

                            </h2>

                            <p className="text-gray-500">

                                {enrollment.student.email}

                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div>

                            <p className="text-gray-500 text-sm">

                                Cours

                            </p>

                            <h3 className="font-semibold text-lg">

                                {enrollment.course.title}

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Enseignant

                            </p>

                            <h3 className="font-semibold text-lg">

                                {enrollment.course.teacher.name}

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Progression

                            </p>

                            <h3>

                                {enrollment.progress} %

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Statut

                            </p>

                            <h3 className="capitalize">

                                {enrollment.status}

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Date d'inscription

                            </p>

                            <h3>

                                {new Date(enrollment.enrolledAt).toLocaleDateString()}

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Dernier accès

                            </p>

                            <h3>

                                {new Date(enrollment.lastAccess).toLocaleString()}

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Temps passé

                            </p>

                            <h3>

                                {enrollment.totalWatchTime} minutes

                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">

                                Certificat

                            </p>

                            <h3>

                                {enrollment.certificateIssued

                                    ? "Obtenu"

                                    : "Non obtenu"}

                            </h3>

                        </div>

                    </div>

                </div>

            </div>

        </TeacherLayout>

    );

}

export default StudentDetails;