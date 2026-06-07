import TeacherLayout from "../../layouts/TeacherLayout"

function CreateConference() {

  return (

    <TeacherLayout>

      <div className="bg-white rounded-3xl shadow-lg p-10">

        <h1 className="text-5xl font-bold text-gray-900">
          Créer une conférence
        </h1>

        <p className="mt-4 text-gray-500">
          Cette fonctionnalité sera disponible prochainement.
        </p>

        <div className="mt-10 bg-purple-50 border border-purple-200 rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-purple-700">
            Module en cours de développement 🚀
          </h2>

          <p className="mt-3 text-gray-600">
            Ici l'enseignant pourra :
          </p>

          <ul className="mt-4 space-y-2 text-gray-700">

            <li>• Planifier une conférence</li>

            <li>• Définir la date et l'heure</li>

            <li>• Inviter les étudiants</li>

            <li>• Ajouter un lien Google Meet ou Zoom</li>

            <li>• Gérer les participants</li>

            <li>• Publier le replay</li>

          </ul>

        </div>

      </div>

    </TeacherLayout>

  )

}

export default CreateConference