import { FaTrashAlt, FaTimes } from "react-icons/fa"

// =========================
// MODAL SUPPRESSION UTILISATEUR
// =========================
function DeleteUserModal({

  isOpen,

  user,

  onClose,

  onConfirm,

  isCurrentUser

}) {

  // =========================
  // MODAL FERMÉ
  // =========================
  if (!isOpen) {

    return null

  }

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-50
      animate-fadeIn
      "
    >

      {/* =========================
          BOITE MODAL
      ========================== */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-2xl
        w-full
        max-w-lg
        overflow-hidden
        animate-scaleIn
        "
      >

        {/* HEADER */}

        <div
          className="
          bg-gradient-to-r
          from-red-600
          to-red-500
          p-6
          text-white
          flex
          justify-between
          items-center
          "
        >

          <div className="flex items-center gap-3">

            <FaTrashAlt className="text-2xl" />

            <h2 className="text-2xl font-bold">

              Suppression

            </h2>

          </div>

          <button

            onClick={onClose}

            className="hover:rotate-90 transition"

          >

            <FaTimes size={22} />

          </button>

        </div>

        {/* CONTENU */}

        <div className="p-8">

          {

            isCurrentUser

            ?

            <>

              <div
                className="
                bg-red-50
                border
                border-red-200
                rounded-2xl
                p-5
                "
              >

                <p className="text-red-600 text-lg font-semibold">

                  Impossible de supprimer votre propre compte.

                </p>

                <p className="text-gray-500 mt-2">

                  Pour des raisons de sécurité,
                  un administrateur ne peut pas
                  supprimer son propre compte.

                </p>

              </div>

            </>

            :

            <>

              <p className="text-gray-700 text-lg">

                Vous êtes sur le point de supprimer :

              </p>

              <div
                className="
                mt-6
                bg-gray-50
                rounded-2xl
                p-5
                "
              >

                <h3 className="text-xl font-bold">

                  {user?.name}

                </h3>

                <p className="text-gray-500">

                  {user?.email}

                </p>

                <span
                  className="
                  inline-block
                  mt-3
                  bg-purple-100
                  text-purple-600
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  "
                >

                  {user?.role}

                </span>

              </div>

              <p className="mt-6 text-red-500 font-medium">

                Cette action est irréversible.

              </p>

            </>

          }

        </div>

        {/* FOOTER */}

        <div
          className="
          px-8
          pb-8
          flex
          justify-end
          gap-4
          "
        >

          <button

            onClick={onClose}

            className="
            px-6
            py-3
            rounded-2xl
            bg-gray-200
            hover:bg-gray-300
            transition
            "

          >

            Annuler

          </button>

          {

            !isCurrentUser &&

            <button

              onClick={onConfirm}

              className="
              px-6
              py-3
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
              flex
              items-center
              gap-3
              transition
              "

            >

              <FaTrashAlt />

              Supprimer

            </button>

          }

        </div>

      </div>

    </div>

  )

}

export default DeleteUserModal