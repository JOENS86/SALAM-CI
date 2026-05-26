import Course from "../models/Course.js"

// =========================
// CREATE COURSE
// =========================
export const createCourse = async (req, res) => {

  try {

    const {
      title,
      description,
      category,
      teacher
    } = req.body

    // fichiers uploadés
    const thumbnail = req.files.thumbnail?.[0]?.path
    const pdf = req.files.pdf?.[0]?.path
    const video = req.files.video?.[0]?.path

    // création cours
    const course = await Course.create({

      title,
      description,
      category,
      teacher,

      thumbnail,
      pdf,
      video

    })

    res.status(201).json(course)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// =========================
// GET COURSES
// =========================
export const getCourses = async (req, res) => {

  try {

    const courses = await Course.find()
      .populate("teacher")

    res.json(courses)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}