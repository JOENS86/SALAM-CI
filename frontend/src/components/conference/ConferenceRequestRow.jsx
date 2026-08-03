import { Link } from "react-router-dom";

function ConferenceRequestRow({ request }) {

    const statusColor = {

        pending: "bg-yellow-100 text-yellow-700",

        approved: "bg-green-100 text-green-700",

        rejected: "bg-red-100 text-red-700"

    };

    const statusText = {

        pending: "En attente",

        approved: "Acceptée",

        rejected: "Refusée"

    };

    return (

        <tr className="border-t hover:bg-gray-50">

            <td className="px-6 py-5 font-semibold">

                {request.title}

            </td>

            <td className="px-6 py-5">

                {request.course?.title}

            </td>

            <td className="px-6 py-5">

                {

                    new Date(

                        request.date

                    ).toLocaleDateString("fr-FR")

                }

            </td>

            <td className="px-6 py-5">

                {request.time}

            </td>

            <td className="px-6 py-5">

                <span

                    className={`

                        px-4

                        py-2

                        rounded-full

                        text-sm

                        font-semibold

                        ${statusColor[request.status]}

                    `}

                >

                    {statusText[request.status]}

                </span>

            </td>

            <td className="px-6 py-5">

                <Link
                    to={`/teacher-conferences/${request._id}`}
                    className="
                        bg-purple-600
                        hover:bg-purple-700
                        text-white
                        px-5
                        py-2
                        rounded-xl
                    "
                >
                    Voir
                </Link>

            </td>

        </tr>

    );

}

export default ConferenceRequestRow;