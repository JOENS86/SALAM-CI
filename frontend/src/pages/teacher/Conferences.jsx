import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TeacherLayout from "../../layouts/TeacherLayout";
import ConferenceRequestRow from "../../components/conference/ConferenceRequestRow";
import conferenceService from "../../services/conferenceService";
import { FaPlus } from "react-icons/fa";
import { errorToast } from "../../utils/toast";

function Conferences() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

// =====================================================
// CHARGER MES DEMANDES
// =====================================================

const loadRequests = async () => {

  try {

      const result = await conferenceService.getTeacherRequests();

      setRequests(result.requests || []);

  }

  catch (error) {

      console.error(error);

      errorToast(

          "Erreur",

          "Impossible de charger vos demandes."

      );

  }

  finally {

      setLoading(false);

  }

};

useEffect(() => {

  loadRequests();

}, []);


  return (

    <TeacherLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold">
            Conférences
          </h1>

          <p className="text-gray-500 mt-3">
            Gérez vos conférences en direct
          </p>

        </div>

<Link to="/teacher-create-conference" className="
        bg-purple-600
        hover:bg-purple-700
        text-white
        px-6
        py-4
        rounded-2xl
        flex
        items-center
        gap-3
    " >

    <FaPlus />

    Nouvelle demande

</Link>

      </div>

      <div className="mt-12 bg-white rounded-3xl shadow-lg overflow-hidden">

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

                Action

            </th>

        </tr>

    </thead>

    <tbody>

        {

            loading

                ?

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

                requests.length === 0

                ?

                (

                    <tr>

                        <td

                            colSpan="6"

                            className="text-center py-10 text-gray-500"

                        >

                            Aucune demande envoyée.

                        </td>

                    </tr>

                )

                :

                requests.map(request => (

                    <ConferenceRequestRow

                        key={request._id}

                        request={request}

                    />

                ))

        }

    </tbody>

</table>

</div>


    </TeacherLayout>

  )

}

export default Conferences