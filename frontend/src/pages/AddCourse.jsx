import { useState } from "react"
import API from "../services/api"

function AddCourse() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

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

    <div className="p-10">

      <h1 className="text-5xl font-bold">
        Ajouter un cours
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6"
      >

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Titre du cours"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl h-40"
        />

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          placeholder="Catégorie"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        {/* THUMBNAIL */}
        <input
          type="file"
          onChange={(e) =>
            setThumbnail(e.target.files[0])
          }
        />

        {/* PDF */}
        <input
          type="file"
          onChange={(e) =>
            setPdf(e.target.files[0])
          }
        />

        {/* VIDEO */}
        <input
          type="file"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />

        <button className="bg-purple-600 text-white px-8 py-4 rounded-xl">

          Créer le cours

        </button>

      </form>

    </div>

  )
}

export default AddCourse