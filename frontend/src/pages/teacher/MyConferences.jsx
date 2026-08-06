import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TeacherLayout from "../../layouts/TeacherLayout";
import conferenceService from "../../services/conferenceService";

import {
    successToast,
    errorToast
} from "../../utils/toast";

function MyConferences() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [conferences, setConferences] = useState([]);

    // =====================================================
    // CHARGER LES CONFERENCES
    // =====================================================

    const loadConferences = async () => {

        try {

            setLoading(true);

            const result =
                await conferenceService.getTeacherConferences();

            setConferences(result.conferences || []);

        }

        catch (error) {

            console.error(error);

            errorToast(

                "Erreur",

                "Impossible de charger les conférences."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadConferences();

    }, []);

    // =====================================================
    // DEMARRER
    // =====================================================

    const handleStart = async (conferenceId) => {

        try {

            await conferenceService.startConference(conferenceId);

            successToast(

                "Succès",

                "Conférence démarrée."

            );

            navigate(`/conference-live/${conferenceId}`);

        }

        catch (error) {

            console.error(error);

            errorToast(

                "Erreur",

                error.response?.data?.message ||

                "Impossible de démarrer."

            );

        }

    };

    // =====================================================
    // TERMINER
    // =====================================================

    const handleEnd = async (conferenceId) => {

        try {

            await conferenceService.endConference(conferenceId);

            successToast(

                "Succès",

                "Conférence terminée."

            );

            loadConferences();

        }

        catch (error) {

            console.error(error);

            errorToast(

                "Erreur",

                error.response?.data?.message ||

                "Impossible de terminer."

            );

        }

    };

    const badge = (status) => {

        switch (status) {

            case "scheduled":

                return "bg-blue-100 text-blue-700";

            case "live":

                return "bg-red-100 text-red-700";

            case "completed":

                return "bg-green-100 text-green-700";

            case "cancelled":

                return "bg-gray-200 text-gray-700";

            default:

                return "bg-gray-100";
        }

    };

    const label = (status) => {

        switch (status) {

            case "scheduled":

                return "Programmée";

            case "live":

                return "En direct";

            case "completed":

                return "Terminée";

            case "cancelled":

                return "Annulée";

            default:

                return status;
        }

    };

    return (

        <TeacherLayout>

            <div className="space-y-10">

                <div>

                    <h1 className="text-5xl font-bold">

                        Mes conférences

                    </h1>

                    <p className="text-gray-500 mt-3">

                        Gérez vos conférences programmées.

                    </p>

                </div>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left px-6 py-4">

                                    Titre

                                </th>

                                <th className="text-left px-6 py-4">

                                    Cours

                                </th>

                                <th className="text-left px-6 py-4">

                                    Date

                                </th>

                                <th className="text-left px-6 py-4">

                                    Heure

                                </th>

                                <th className="text-left px-6 py-4">

                                    Statut

                                </th>

                                <th className="text-center px-6 py-4">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                loading ?

                                (

                                    <tr>

                                        <td

                                            colSpan="6"

                                            className="text-center py-10"

                                        >

                                            Chargement...

                                        </td>

                                    </tr>

                                )

                                :

                                conferences.length === 0 ?

                                (

                                    <tr>

                                        <td

                                            colSpan="6"

                                            className="text-center py-10"

                                        >

                                            Aucune conférence.

                                        </td>

                                    </tr>

                                )

                                :

                                conferences.map(conference => (

                                    <tr

                                        key={conference._id}

                                        className="border-t"

                                    >

                                        <td className="px-6 py-5 font-semibold">

                                            {conference.title}

                                        </td>

                                        <td className="px-6 py-5">

                                            {conference.course?.title}

                                        </td>

                                        <td className="px-6 py-5">

                                            {

                                                new Date(

                                                    conference.date

                                                ).toLocaleDateString("fr-FR")

                                            }

                                        </td>

                                        <td className="px-6 py-5">

                                            {conference.time}

                                        </td>

                                        <td className="px-6 py-5">

                                            <span

                                                className={`

                                                px-4

                                                py-2

                                                rounded-full

                                                text-sm

                                                font-semibold

                                                ${badge(conference.status)}

                                                `}

                                            >

                                                {label(conference.status)}

                                            </span>

                                        </td>

                                        <td className="px-6 py-5">

                                            <div className="flex justify-center gap-3">

                                                {

                                                    conference.status === "scheduled" && (

                                                        <button

                                                            onClick={() =>

                                                                handleStart(

                                                                    conference._id

                                                                )

                                                            }

                                                            className="bg-green-600 text-white px-4 py-2 rounded-xl"

                                                        >

                                                            Démarrer

                                                        </button>

                                                    )

                                                }

                                                {

                                                    conference.status === "live" && (

                                                        <>

                                                            <button

                                                                onClick={() =>

                                                                    navigate(

                                                                        `/conference-live/${conference._id}`

                                                                    )

                                                                }

                                                                className="bg-blue-600 text-white px-4 py-2 rounded-xl"

                                                            >

                                                                Rejoindre

                                                            </button>

                                                            <button

                                                                onClick={() =>

                                                                    handleEnd(

                                                                        conference._id

                                                                    )

                                                                }

                                                                className="bg-red-600 text-white px-4 py-2 rounded-xl"

                                                            >

                                                                Terminer

                                                            </button>

                                                        </>

                                                    )

                                                }

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </TeacherLayout>

    );

}

export default MyConferences;