import { useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

function AddCourse() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const navigate = useNavigate()
   
  // =========================
  // STATE
  // =========================
  const [formData, setFormData] = useState({

    title: "",
    description: "",
    category: ""

  })

  const [thumbnail, setThumbnail] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [video, setVideo] = useState(null)

  // =========================
  // INPUTS
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      // formdata upload
      const data = new FormData()

      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("category", formData.category)

      data.append("teacher", user._id)

      data.append("thumbnail", thumbnail)
      data.append("pdf", pdf)
      data.append("video", video)

      // api
      const res = await API.post(
        "/courses/create",
        data
      )

      console.log(res.data)

      alert("Cours créé avec succès")

    } catch (error) {

      console.log(error)

      alert("Erreur création cours")

    }

  }

  return (

<div className="max-w-7xl mx-auto p-10">

        {/* HEADER */}

    <div className="flex justify-between items-center mb-6">

      <button onClick={() => navigate("/teacher-courses")}
        className="
          flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition " >
        <FaArrowLeft />
            Retour
      </button>
    </div>


    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
      <h1 className="text-5xl font-bold">
        Ajouter un cours
      </h1>

        <p className="mt-3 text-purple-100">
           Créez et publiez un nouveau cours pour vos étudiants
        </p>
    </div>

    <form
  onSubmit={handleSubmit}
  className="mt-10 space-y-8"
>

  {/* INFOS */}

  <div className="bg-white rounded-3xl shadow-md p-8">

    <h2 className="text-2xl font-bold mb-6">
      Informations du cours
    </h2>

    <div className="space-y-5">

      <input
        type="text"
        name="title"
        placeholder="Titre du cours"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
      />

      <textarea
        name="description"
        placeholder="Description du cours"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-2xl p-4 h-40 focus:outline-none focus:border-purple-500"
      />

      <input
        type="text"
        name="category"
        placeholder="Catégorie"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:border-purple-500"
      />

    </div>

  </div>

  {/* FICHIERS */}

  <div className="bg-white rounded-3xl shadow-md p-8">

    <h2 className="text-2xl font-bold mb-6">
      Ressources du cours
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center">

        <p className="font-semibold">
          Image du cours
        </p>

        <input
          type="file"
          className="mt-4"
          onChange={(e) =>
            setThumbnail(e.target.files[0])
          }
        />

      </div>

      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center">

        <p className="font-semibold">
          Document PDF
        </p>

        <input
          type="file"
          className="mt-4"
          onChange={(e) =>
            setPdf(e.target.files[0])
          }
        />

      </div>

      <div className="border-2 border-dashed border-green-300 rounded-2xl p-6 text-center">

        <p className="font-semibold">
          Vidéo du cours
        </p>

        <input
          type="file"
          className="mt-4"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />

      </div>

    </div>

  </div>

  {/* BOUTON */}

  <div className="flex justify-end">

    <button
      className="
      bg-gradient-to-r
      from-purple-600
      to-indigo-600
      text-white
      px-10
      py-4
      rounded-2xl
      shadow-lg
      hover:scale-105
      transition
      "
    >
      Créer le cours
    </button>

  </div>
</form>

</div>

  )
}

export default AddCourse