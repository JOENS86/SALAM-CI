import Conference from "../models/Conference.js"

// =========================
// CREER UNE CONFERENCE
// =========================
export const createConference = async (req, res) => {

    try {

        const conference = await Conference.create(req.body)

        res.status(201).json(conference)

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

// =========================
// LISTE DES CONFERENCES
// =========================
export const getConferences = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1

        const limit = Number(req.query.limit) || 10

        const skip = (page - 1) * limit

        const conferences = await Conference.find()

            .populate("teacher", "name email")

            .sort({ createdAt: -1 })

            .skip(skip)

            .limit(limit)

        const totalConferences = await Conference.countDocuments()

        res.json({

            conferences,

            currentPage: page,

            totalPages: Math.ceil(totalConferences / limit),

            totalConferences

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// STATISTIQUES
// =========================
export const getConferenceStats = async (req, res) => {

    try {

        const total = await Conference.countDocuments()

        const pending = await Conference.countDocuments({

            status: "En attente"

        })

        const published = await Conference.countDocuments({

            status: "Publié"

        })

        const suspended = await Conference.countDocuments({

            status: "Suspendu"

        })

        const finished = await Conference.countDocuments({

            status: "Terminée"

        })

        res.json({

            total,

            pending,

            published,

            suspended,

            finished

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// DETAILS
// =========================
export const getConferenceById = async (req, res) => {

    try {

        const conference = await Conference.findById(

            req.params.id

        ).populate(

            "teacher",

            "name email"
        )

        if (!conference) {

            return res.status(404).json({

                message: "Conférence introuvable"

            })

        }

        res.json(conference)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// PUBLIER
// =========================
export const publishConference = async (req, res) => {

    try {

        const conference = await Conference.findByIdAndUpdate(

            req.params.id,

            {

                status: "Publié",

                publishedAt: new Date()

            },

            {

                new: true

            }

        )

        res.json(conference)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// SUSPENDRE
// =========================
export const suspendConference = async (req, res) => {

    try {

        const conference = await Conference.findByIdAndUpdate(

            req.params.id,

            {

                status: "Suspendu"

            },

            {

                new: true

            }

        )

        res.json(conference)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// SUPPRIMER
// =========================
export const deleteConference = async (req, res) => {

    try {

        await Conference.findByIdAndDelete(

            req.params.id

        )

        res.json({

            message: "Conférence supprimée"

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}