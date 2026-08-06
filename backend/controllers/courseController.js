import Course from "../models/Course.js"

// ======================================
// CRÉER UN COURS
// POST /api/courses/create
// ======================================
export const createCourse = async (req, res) => {

  try {

    // =========================
    // DONNÉES REÇUES
    // =========================
    const {

      title,
      description,
      category,
      teacher

    } = req.body

    // =========================
    // FICHIERS UPLOADÉS
    // =========================

    const thumbnail =

    req.files?.thumbnail?.[0]?.path.replace(/\\/g, "/") || "";

    const pdf =

    req.files?.pdf?.[0]?.path.replace(/\\/g, "/") || "";

    const video =

    req.files?.video?.[0]?.path.replace(/\\/g, "/") || "";
    
    // =========================
    // CRÉATION DU COURS
    // =========================
    const course = await Course.create({

      title,

      description,

      category,

      teacher,

      thumbnail,

      pdf,

      video,

      // =========================
      // ÉTAT INITIAL
      // =========================
      status: "En attente",

      isActive: true,

      studentsCount: 0,

      views: 0,

      downloads: 0,

      publishedAt: null

    })

    // =========================
    // RÉPONSE
    // =========================
    res.status(201).json({

      message: "Cours créé avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// RÉCUPÉRER LES COURS
// AVEC PAGINATION
// GET /api/courses?page=1&limit=10
// ======================================
export const getCourses = async (req, res) => {

  try {

    // =========================
    // PARAMÈTRES DE PAGINATION
    // =========================
    const page = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    // =========================
    // CALCUL DU SKIP
    // =========================
    const skip = (page - 1) * limit

    // =========================
    // NOMBRE TOTAL DE COURS
    // =========================
    const totalCourses = await Course.countDocuments()

    // =========================
    // NOMBRE TOTAL DE PAGES
    // =========================
    const totalPages = Math.ceil(

      totalCourses / limit

    )

    // =========================
    // RÉCUPÉRATION DES COURS
    // =========================
    const courses = await Course.find()
   
      // Nom et email de l'enseignant
      .populate(
        "teacher",
        "name email"
      )

      .populate(
        "category",
        "name"
      )

      // Plus récent en premier
      .sort({
        createdAt: -1
      })

      .skip(skip)
      .limit(limit)

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      courses,

      currentPage: page,

      totalPages,

      totalCourses,

      limit

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// =====================================================
// COURS DE L'ENSEIGNANT CONNECTE
// GET /api/courses/teacher
// =====================================================

export const getTeacherCourses = async (req, res) => {

  try {

      const courses = await Course.find({

          teacher: req.user.id

      })

      .populate(

          "category",

          "name"

      )

      .sort({

          createdAt: -1

      });

      res.status(200).json({

          success: true,

          courses

      });

  }

  catch (error) {

      console.log(error);

      res.status(500).json({

          success: false,

          message: error.message

      });

  }

};

// ======================================
// RÉCUPÉRER LES STATISTIQUES
// GET /api/courses/stats
// ======================================
export const getCourseStats = async (req, res) => {

  try {

      // =========================
      // NOMBRE DE COURS
      // =========================

      const totalCourses = await Course.countDocuments();

      const publishedCourses = await Course.countDocuments({
          status: "Publié"
      });

      const draftCourses = await Course.countDocuments({
          status: "En attente"
      });

      const suspendedCourses = await Course.countDocuments({
          status: "Suspendu"
      });

      // =========================
      // SOMME DES STATISTIQUES
      // =========================

      const stats = await Course.aggregate([

          {

              $group: {

                  _id: null,

                  totalStudents: {
                      $sum: "$studentsCount"
                  },

                  totalViews: {
                      $sum: "$views"
                  },

                  totalDownloads: {
                      $sum: "$downloads"
                  }

              }

          }

      ]);

      res.json({

          totalCourses,

          publishedCourses,

          draftCourses,

          suspendedCourses,

          totalStudents: stats[0]?.totalStudents || 0,

          totalViews: stats[0]?.totalViews || 0,

          totalDownloads: stats[0]?.totalDownloads || 0

      });

  }

  catch (error) {

      console.log(error);

      res.status(500).json({

          message: error.message

      });

  }

};


// =========================
// COURS D'UNE CATEGORIE
// =========================

export const getCoursesByCategory = async (req, res) => {

  console.log("Reçu :", JSON.stringify(req.params.category))

  const allCourses = await Course.find()

  allCourses.forEach(course => {
      console.log("Mongo :", JSON.stringify(course.category))
  })

  const courses = await Course.find({
      category: req.params.category
  })

  console.log("Trouvés :", courses.length)

  res.json(courses)
}


// ======================================
// RÉCUPÉRER UN COURS
// GET /api/courses/:id
// ======================================
export const getCourseById = async (req, res) => {

  try {

    // =========================
    // ID DU COURS
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE DU COURS
    // =========================
    const course = await Course.findById(id)

      .populate(

        "teacher",

        "name email role"

      )

    // =========================
    // COURS INTROUVABLE
    // =========================
    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json(course)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// PUBLIER UN COURS
// PATCH /api/courses/:id/publish
// ======================================
export const publishCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    if (course.status === "Publié") {

      return res.status(400).json({

        message: "Ce cours est déjà publié."

      })

    }

    course.status = "Publié"

    course.isActive = true

    course.publishedAt = new Date()

    await course.save()

    res.status(200).json({

      message: "Cours publié avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// SUSPENDRE UN COURS
// PATCH /api/courses/:id/suspend
// ======================================
export const suspendCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    if (course.status === "Suspendu") {

      return res.status(400).json({

        message: "Ce cours est déjà suspendu."

      })

    }

    course.status = "Suspendu"

    course.isActive = false

    await course.save()

    res.status(200).json({

      message: "Cours suspendu avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// MODIFIER UN COURS
// PUT /api/courses/:id
// ======================================
export const updateCourse = async (req, res) => {

  try {

    const { id } = req.params

    const {

      title,

      description,

      category,

      teacher

    } = req.body

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    // =========================
    // MISE À JOUR DES CHAMPS
    // =========================

    course.title = title

    course.description = description

    course.category = category

    course.teacher = teacher

    // =========================
    // FICHIERS (si envoyés)
    // =========================

    if (req.files?.thumbnail?.[0]) {

      course.thumbnail = req.files.thumbnail[0].path

    }

    if (req.files?.pdf?.[0]) {

      course.pdf = req.files.pdf[0].path

    }

    if (req.files?.video?.[0]) {

      course.video = req.files.video[0].path

    }

    await course.save()

    res.status(200).json({

      message: "Cours modifié avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// SUPPRIMER UN COURS
// DELETE /api/courses/:id
// ======================================
export const deleteCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    await course.deleteOne()

    res.status(200).json({

      message: "Cours supprimé avec succès."

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}