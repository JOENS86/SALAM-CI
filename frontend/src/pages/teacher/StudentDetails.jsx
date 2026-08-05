// ============================================================
// IMPORTS
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TeacherLayout from "../../layouts/TeacherLayout";
import enrollmentService from "../../services/enrollmentService";
import { errorToast } from "../../utils/toast";

import {

    FaArrowLeft,
    FaUserGraduate,
    FaBookOpen,
    FaChalkboardTeacher,
    FaChartLine,
    FaClock,
    FaCalendarAlt,
    FaAward,
    FaCheckCircle

} from "react-icons/fa";

// ============================================================
// COMPOSANT
// ============================================================

function StudentDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);

    const [loading, setLoading] = useState(true);

// ============================================================
// CHARGER L'ETUDIANT
// ============================================================

useEffect(() => {

    loadEnrollment();

}, []);

const loadEnrollment = async () => {

    try {

        const result = await enrollmentService.getEnrollment(id);

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

// ============================================================
// CHARGEMENT
// ============================================================

if (loading) {

    return (

        <TeacherLayout>

            <div className="flex justify-center items-center h-[70vh]">

                <div className="text-center">

                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-6 text-gray-500">

                        Chargement...

                    </p>

                </div>

            </div>

        </TeacherLayout>

    );

}

// ============================================================
// ETUDIANT INTROUVABLE
// ============================================================

if (!enrollment) {

    return (

        <TeacherLayout>

            <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

                <h2 className="text-3xl font-bold">

                    Étudiant introuvable

                </h2>

            </div>

        </TeacherLayout>

    );

}

// ============================================================
// RENDER
// ============================================================

return (

<TeacherLayout>

<div className="space-y-10">

{/* ================================================= */}
{/* HEADER */}
{/* ================================================= */}
<div>

<button

onClick={() => navigate(-1)}

className="flex items-center gap-3 text-purple-600 hover:text-purple-800 font-semibold"

>

<FaArrowLeft />

Retour

</button>

<h1 className="text-5xl font-bold mt-5">

Détails de l'étudiant

</h1>

<p className="text-gray-500 mt-3">

Suivi pédagogique complet de votre étudiant.

</p>

</div>

{/* ================================================= */}
{/* CARTE PROFIL */}
{/* ================================================= */}
<div className="bg-white rounded-3xl shadow-lg p-10">

<div className="flex flex-col lg:flex-row lg:items-center gap-10">

<div
className="
w-32
h-32
rounded-full
bg-purple-100
flex
items-center
justify-center
text-5xl
font-bold
text-purple-700
shadow-md
"
>

{

enrollment.student.name

.charAt(0)

.toUpperCase()

}

</div>

<div className="flex-1">

<h2 className="text-4xl font-bold">

{enrollment.student.name}

</h2>

<p className="text-gray-500 mt-2 text-lg">

{enrollment.student.email}

</p>

<div className="mt-8">

<div className="flex justify-between mb-2">

<span className="font-semibold">

Progression

</span>

<span>

{enrollment.progress}%

</span>

</div>

<div className="w-full bg-gray-200 rounded-full h-5">

<div

className="bg-purple-600 h-5 rounded-full transition-all duration-500"

style={{

width: `${enrollment.progress}%`

}}

>

</div>

</div>

</div>

</div>

<div>

<span

className={`
px-6
py-3
rounded-full
text-lg
font-semibold

${
enrollment.status === "completed"

? "bg-green-100 text-green-700"

: "bg-blue-100 text-blue-700"
}
`}

>

{

enrollment.status === "completed"

?

"Terminé"

:

"En progression"

}

</span>

</div>

</div>

</div>

{/* ================================================= */}
{/* STATISTIQUES */}
{/* ================================================= */}
<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">

{/* Progression */}

<div className="bg-white rounded-3xl shadow-lg p-8">

<div className="flex items-center justify-between">

<FaChartLine className="text-purple-600 text-4xl"/>

<span className="text-5xl font-bold">

{enrollment.progress}%

</span>

</div>

<p className="text-gray-500 mt-6">

Progression

</p>

</div>

{/* Temps */}

<div className="bg-white rounded-3xl shadow-lg p-8">

<div className="flex items-center justify-between">

<FaClock className="text-blue-600 text-4xl"/>

<span className="text-5xl font-bold">

{enrollment.totalWatchTime}

</span>

</div>

<p className="text-gray-500 mt-6">

Minutes visionnées

</p>

</div>

{/* Certificat */}

<div className="bg-white rounded-3xl shadow-lg p-8">

    <div className="flex items-center justify-between">

        <FaAward className="text-yellow-500 text-4xl"/>

        <span className="text-3xl font-bold">

            {

                enrollment.certificateIssued

                    ?

                    "Oui"

                    :

                    "Non"

            }

        </span>

    </div>

    <p className="text-gray-500 mt-6">

        Certificat

    </p>

</div>

{/* Dernier accès */}

<div className="bg-white rounded-3xl shadow-lg p-8">

    <div className="flex items-center justify-between">

        <FaCalendarAlt className="text-green-600 text-4xl"/>

        <span className="text-lg font-bold">

            {

                new Date(

                    enrollment.lastAccess

                ).toLocaleDateString("fr-FR")

            }

        </span>

    </div>

    <p className="text-gray-500 mt-6">

        Dernier accès

    </p>

</div>

</div>

{/* ================================================= */}
{/* INFORMATIONS */}
{/* ================================================= */}
<div className="bg-white rounded-3xl shadow-lg p-10">

<h2 className="text-3xl font-bold mb-10">

Informations pédagogiques

</h2>

<div className="grid md:grid-cols-2 gap-10">

{/* Nom */}

<div className="flex gap-5 items-start">

<div className="bg-purple-100 p-4 rounded-2xl">

<FaUserGraduate className="text-purple-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Nom de l'étudiant

</p>

<h3 className="font-bold text-xl mt-1">

{enrollment.student.name}

</h3>

</div>

</div>

{/* Email */}

<div className="flex gap-5 items-start">

<div className="bg-blue-100 p-4 rounded-2xl">

<FaUserGraduate className="text-blue-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Adresse e-mail

</p>

<h3 className="font-bold text-xl mt-1">

{enrollment.student.email}

</h3>

</div>

</div>

{/* Cours */}

<div className="flex gap-5 items-start">

<div className="bg-green-100 p-4 rounded-2xl">

<FaBookOpen className="text-green-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Cours suivi

</p>

<h3 className="font-bold text-xl mt-1">

{enrollment.course.title}

</h3>

</div>

</div>

{/* Enseignant */}

<div className="flex gap-5 items-start">

<div className="bg-orange-100 p-4 rounded-2xl">

<FaChalkboardTeacher className="text-orange-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Enseignant

</p>

<h3 className="font-bold text-xl mt-1">

{enrollment.course.teacher.name}

</h3>

</div>

</div>

{/* Date inscription */}

<div className="flex gap-5 items-start">

<div className="bg-pink-100 p-4 rounded-2xl">

<FaCalendarAlt className="text-pink-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Date d'inscription

</p>

<h3 className="font-bold text-xl mt-1">

{

new Date(

enrollment.enrolledAt

).toLocaleDateString("fr-FR")

}

</h3>

</div>

</div>

{/* Dernière connexion */}

<div className="flex gap-5 items-start">

<div className="bg-indigo-100 p-4 rounded-2xl">

<FaClock className="text-indigo-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Dernière connexion

</p>

<h3 className="font-bold text-xl mt-1">

{

new Date(

enrollment.lastAccess

).toLocaleString("fr-FR")

}

</h3>

</div>

</div>

{/* Temps passé */}

<div className="flex gap-5 items-start">

<div className="bg-cyan-100 p-4 rounded-2xl">

<FaClock className="text-cyan-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Temps passé

</p>

<h3 className="font-bold text-xl mt-1">

{

enrollment.totalWatchTime

} minutes

</h3>

</div>

</div>

{/* Certificat */}

<div className="flex gap-5 items-start">

<div className="bg-yellow-100 p-4 rounded-2xl">

<FaCheckCircle className="text-yellow-600 text-2xl"/>

</div>

<div>

<p className="text-gray-500">

Certificat

</p>

<h3 className="font-bold text-xl mt-1">

{

enrollment.certificateIssued

?

"Obtenu"

:

"Non obtenu"

}

</h3>

</div>

</div>

</div>

</div>

{/* ================================================= */}
{/* ACTIVITE RECENTE */}
{/* ================================================= */}
<div className="bg-white rounded-3xl shadow-lg p-10">

    <h2 className="text-3xl font-bold mb-8">

        Activité récente

    </h2>

    <div className="space-y-6">

        <div className="flex justify-between items-center border-b pb-4">

            <div>

                <h3 className="font-semibold">

                    📚 Inscription au cours

                </h3>

                <p className="text-gray-500 text-sm">

                    L'étudiant s'est inscrit au cours.

                </p>

            </div>

            <span className="text-sm text-gray-500">

                {new Date(enrollment.enrolledAt).toLocaleDateString("fr-FR")}

            </span>

        </div>

        <div className="flex justify-between items-center border-b pb-4">

            <div>

                <h3 className="font-semibold">

                    📈 Progression actuelle

                </h3>

                <p className="text-gray-500 text-sm">

                    Progression du cours.

                </p>

            </div>

            <span className="font-bold text-purple-600">

                {enrollment.progress} %

            </span>

        </div>

        <div className="flex justify-between items-center border-b pb-4">

            <div>

                <h3 className="font-semibold">

                    🕒 Dernière connexion

                </h3>

                <p className="text-gray-500 text-sm">

                    Dernier accès à la plateforme.

                </p>

            </div>

            <span className="text-sm">

                {

                    new Date(

                        enrollment.lastAccess

                    ).toLocaleString("fr-FR")

                }

            </span>

        </div>

        <div className="flex justify-between items-center border-b pb-4">

            <div>

                <h3 className="font-semibold">

                    ⏱ Temps de formation

                </h3>

                <p className="text-gray-500 text-sm">

                    Temps total passé.

                </p>

            </div>

            <span className="font-bold">

                {enrollment.totalWatchTime} min

            </span>

        </div>

        <div className="flex justify-between items-center">

            <div>

                <h3 className="font-semibold">

                    🏆 Certificat

                </h3>

                <p className="text-gray-500 text-sm">

                    État du certificat.

                </p>

            </div>

            <span

                className={`

                    px-4

                    py-2

                    rounded-full

                    text-sm

                    font-semibold

                    ${

                        enrollment.certificateIssued

                            ?

                            "bg-green-100 text-green-700"

                            :

                            "bg-yellow-100 text-yellow-700"

                    }

                `}

            >

                {

                    enrollment.certificateIssued

                        ?

                        "Obtenu"

                        :

                        "Non obtenu"

                }

            </span>

        </div>

    </div>

</div>

</div>


</TeacherLayout>

);

}

export default StudentDetails;