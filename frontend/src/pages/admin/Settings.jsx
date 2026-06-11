import AdminLayout from "../../layouts/AdminLayout"

function Settings() {

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Paramètres
        </h1>

        <p className="text-gray-500 mt-2">
          Configuration générale de la plateforme
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Paramètres généraux
          </h2>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Nom de la plateforme"
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="email"
              placeholder="Email principal"
              className="w-full border rounded-2xl p-4"
            />

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Sécurité
          </h2>

          <div className="space-y-5">

            <input
              type="password"
              placeholder="Nouveau mot de passe admin"
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full border rounded-2xl p-4"
            />

          </div>

        </div>

      </div>

      <button
        className="
        mt-8
        bg-gradient-to-r
        from-purple-600
        to-indigo-600
        text-white
        px-8
        py-4
        rounded-2xl
        "
      >
        Enregistrer les paramètres
      </button>

    </AdminLayout>

  )

}

export default Settings