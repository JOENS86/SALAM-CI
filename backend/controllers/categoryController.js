import Category from "../models/Category.js"
import Course from "../models/Course.js"

// =========================
// CREER UNE CATEGORIE
// =========================
export const createCategory = async (req, res) => {

    try {

        const { name, description, color } = req.body

        const categoryExists = await Category.findOne({ name })

        if (categoryExists) {

            return res.status(400).json({

                message: "Cette catégorie existe déjà."

            })

        }

        const category = await Category.create({

            name,
            description,
            color

        })

        res.status(201).json(category)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// RECUPERER LES CATEGORIES
// =========================
export const getCategories = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1

        const limit = Number(req.query.limit) || 10

        const search = req.query.search || ""

        const skip = (page - 1) * limit

        const filter = {

            name: {

                $regex: search,

                $options: "i"

            }

        }

        const categories = await Category.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    
    const categoriesWithCourses = await Promise.all(
    
        categories.map(async (category) => {
            const totalCourses = await Course.countDocuments({
                category: category.name
            })

            return {
                    ...category.toObject(),
                    totalCourses
                }
    
        })
    
    )

        const totalCategories = await Category.countDocuments(filter)

        res.json({
            categories: categoriesWithCourses,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
            totalCategories
        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// DETAILS D'UNE CATEGORIE
// =========================
export const getCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id)

        if (!category) {

            return res.status(404).json({

                message: "Catégorie introuvable."

            })

        }

        res.json(category)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}


// =========================
// LISTE DES CATÉGORIES
// POUR LES SELECT
// GET /api/categories/list
// =========================
export const getCategoriesList = async (req, res) => {

    try {

        const categories = await Category.find()

            .select("_id name")

            .sort({

                name: 1

            });

        res.status(200).json(categories);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}


// =========================
// MODIFIER UNE CATEGORIE
// =========================
export const updateCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id)

        if (!category) {

            return res.status(404).json({

                message: "Catégorie introuvable."

            })

        }

        category.name = req.body.name || category.name

        category.description = req.body.description || category.description

        category.color = req.body.color || category.color

        await category.save()

        res.json(category)

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

// =========================
// SUPPRIMER UNE CATEGORIE
// =========================
export const deleteCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id)

        if (!category) {

            return res.status(404).json({

                message: "Catégorie introuvable."

            })

        }

        await category.deleteOne()

        res.json({

            message: "Catégorie supprimée."

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
export const getCategoryStats = async (req, res) => {

    try {

        const totalCategories = await Category.countDocuments()

        res.json({

            totalCategories

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}