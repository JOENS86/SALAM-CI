import DashboardLayout from "../../layouts/DashboardLayout"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera
} from "react-icons/fa"

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <DashboardLayout>

      {/* HEADER */}

      <h1 className="text-5xl font-bold text-gray-900">
        Mon Profil
      </h1>

      <p className="text-gray-500 mt-3">
        Gérez vos informations personnelles
      </p>

      {/* PROFIL */}

{/* PROFIL */}

<div className="grid lg:grid-cols-3 gap-8 mt-10">

  {/* CARTE PROFIL */}

  <div className="bg-white rounded-3xl shadow p-8">

    <div className="flex flex-col items-center">

      <div className="relative">

        <div className="w-36 h-36 rounded-full bg-purple-600 flex items-center justify-center text-white text-5xl font-bold">

          {user?.name?.charAt(0)}

        </div>

        <button className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full">

          <FaCamera />

        </button>

      </div>

      <h2 className="text-2xl font-bold mt-6">
        {user?.name}
      </h2>

      <p className="text-gray-500 mt-2">
        Étudiant SALAM CI
      </p>

      <p className="text-gray-400 text-center mt-2">
        {user?.email}
      </p>

      <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl">

        Modifier la photo

      </button>

    </div>

  </div>

  {/* INFORMATIONS */}

  <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

    <h2 className="text-2xl font-bold mb-8">
      Informations personnelles
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <label className="font-medium flex items-center gap-2 mb-2">

          <FaUser />

          Nom complet

        </label>

        <input
          type="text"
          defaultValue={user?.name}
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium flex items-center gap-2 mb-2">

          <FaEnvelope />

          Email

        </label>

        <input
          type="email"
          defaultValue={user?.email}
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium mb-2 block">
          Téléphone
        </label>

        <input
          type="text"
          placeholder="+225 XX XX XX XX XX"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium mb-2 block">
          Rôle
        </label>

        <input
          type="text"
          value="Étudiant"
          disabled
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100"
        />

      </div>

    </div>

  </div>

</div>

{/* INFORMATIONS COMPTE */}

<div className="grid lg:grid-cols-3 gap-8 mt-8">

  {/* CARTE GAUCHE */}

  <div className="bg-white rounded-3xl shadow p-8">

    <h2 className="text-2xl font-bold">
      Compte
    </h2>

    <p className="text-gray-500 mt-3">
      Informations générales de votre compte étudiant.
    </p>

  </div>

  {/* FORMULAIRE DROITE */}

  <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

    <h2 className="text-2xl font-bold mb-8">
      Modifier mes informations
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <label className="font-medium mb-2 block">
          Nom complet
        </label>

        <input
          type="text"
          defaultValue={user?.name}
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium mb-2 block">
          Email
        </label>

        <input
          type="email"
          defaultValue={user?.email}
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium mb-2 block">
          Téléphone
        </label>

        <input
          type="text"
          placeholder="+225 XX XX XX XX XX"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div>

        <label className="font-medium mb-2 block">
          Ville
        </label>

        <input
          type="text"
          placeholder="Abidjan"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

    </div>

  </div>

</div>

      {/* SECURITE */}

      <div className="grid lg:grid-cols-3 gap-8 mt-8">

{/* GAUCHE */}

<div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-2xl font-bold">
    Sécurité
  </h2>

  <p className="text-gray-500 mt-3">
    Gérez votre mot de passe et la sécurité du compte.
  </p>

</div>

{/* DROITE */}

<div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

  <h2 className="text-2xl font-bold mb-8">
    Changer le mot de passe
  </h2>

  <div className="space-y-6">

    <div>

      <label className="font-medium mb-2 block">
        Nouveau mot de passe
      </label>

      <input
        type="password"
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
      />

    </div>

    <div>

      <label className="font-medium mb-2 block">
        Confirmer le mot de passe
      </label>

      <input
        type="password"
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
      />

    </div>

  </div>

  <button className="mt-8 bg-purple-600 hover:bg-purple-700 transition text-white px-8 py-4 rounded-xl">

    Enregistrer les modifications

  </button>

</div>

</div>

    </DashboardLayout>

  )

}

export default Profile