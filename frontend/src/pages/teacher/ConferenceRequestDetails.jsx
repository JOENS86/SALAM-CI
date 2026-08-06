import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import TeacherLayout from "../../layouts/TeacherLayout";
import conferenceService from "../../services/conferenceService";

import { errorToast } from "../../utils/toast";

function ConferenceRequestDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [request, setRequest] = useState(null);

    const [conference, setConference] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadRequest();

    }, []);

    const loadRequest = async () => {

        try {

            const result = await conferenceService.getRequestById(id);

            setRequest(result.request);

// Charger la conférence créée après approbation
if (result.request.status === "approved") {

    try {

        const conferences =
            await conferenceService.getTeacherConferences();

            const found = conferences.conferences.find(

                (c) =>
            
                    c.request?._id?.toString() ===
            
                    result.request._id.toString()
            
            );

        if (found) {

            setConference(found);

        }

    }

    catch (error) {

        console.log(error);

    }

}

        }

        catch (error) {

            console.log(error);

            errorToast(

                "Erreur",

                "Impossible de charger cette demande."

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

    if (!request) {

        return (

            <TeacherLayout>

                <div className="p-10">

                    Demande introuvable.

                </div>

            </TeacherLayout>

        );

    }

// =====================================================
// DEMARRER LA CONFERENCE
// =====================================================
const startConference = async () => {

    try {

        await conferenceService.startConference(conference._id);

        navigate(`/conference-live/${conference._id}`);

    }

    catch (error) {

        console.log(error);

        errorToast(

            "Erreur",

            error.response?.data?.message ||

            "Impossible de démarrer la conférence."

        );

    }

};


    return (

        <TeacherLayout>

            <div className="space-y-8">

                <div>

                <button
                  onClick={() => navigate(-1)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-purple-600
             hover:text-purple-800
            font-semibold
            mb-4
        "
    >
        <FaArrowLeft />
        Retour
    </button>

                    <h1 className="text-4xl font-bold">

                        Détails de la demande

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Consultez toutes les informations de votre demande.

                    </p>

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">

                    <div>

                        <h2 className="text-sm text-gray-500">

                            Titre

                        </h2>

                        <p className="text-xl font-semibold">

                            {request.title}

                        </p>

                    </div>

                    <div>

                        <h2 className="text-sm text-gray-500">

                            Cours

                        </h2>

                        <p className="text-lg">

                            {request.course?.title}

                        </p>

                    </div>

                    <div>

                        <h2 className="text-sm text-gray-500">

                            Description

                        </h2>

                        <p>

                            {request.description}

                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div>

                            <h2 className="text-sm text-gray-500">

                                Date

                            </h2>

                            <p>

                                {

                                    new Date(

                                        request.date

                                    ).toLocaleDateString()

                                }

                            </p>

                        </div>

                        <div>

                            <h2 className="text-sm text-gray-500">

                                Heure

                            </h2>

                            <p>

                                {request.time}

                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div>

                            <h2 className="text-sm text-gray-500">

                                Durée

                            </h2>

                            <p>

                                {request.duration} minutes

                            </p>

                        </div>

                        <div>

                            <h2 className="text-sm text-gray-500">

                                Participants

                            </h2>

                            <p>

                                {request.maxParticipants}

                            </p>

                        </div>

                    </div>

                    <div>

                        <h2 className="text-sm text-gray-500">

                            Statut

                        </h2>

                        <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">

                            {

                                request.status === "pending"

                                    ? "En attente"

                                    : request.status === "approved"

                                    ? "Acceptée"

                                    : "Refusée"

                            }

                        </span>

                    </div>

                    <div>

                        <h2 className="text-sm text-gray-500">

                            Commentaire administrateur

                        </h2>

                        <p>

                            {

                                request.adminComment ||

                                "Aucun commentaire."

                            }

                        </p>

                    </div>

                    {
    conference &&
    conference.status === "scheduled" && (

        <div className="pt-8 border-t">

            <button

                onClick={startConference}

                className="
                    w-full
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                "

            >

                Démarrer la conférence

            </button>

        </div>

    )
}

                </div>

            </div>

        </TeacherLayout>

    );

}

export default ConferenceRequestDetails;