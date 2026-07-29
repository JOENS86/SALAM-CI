import Exercise from "../models/Exercise.js";
import fs from "fs";

// ======================================================
// CREER
// ======================================================

export const createExercise = async (req, res) => {

    try {

        const {

            title,
            description,
            instructions,
            points,
            dueDate,
            chapter

        } = req.body;

        const attachment = req.file
            ? req.file.path
            : "";

        const exercise = await Exercise.create({

            title,
            description,
            instructions,
            points,
            dueDate,
            attachment,
            chapter

        });

        res.status(201).json(exercise);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// TOUS LES EXERCICES D'UN CHAPITRE
// ======================================================

export const getExercisesByChapter = async (req, res) => {

    try {

        const exercises = await Exercise.find({

            chapter: req.params.chapterId

        }).sort({

            createdAt: -1

        });

        res.json(exercises);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// MODIFIER
// ======================================================

export const updateExercise = async (req, res) => {

    try {

        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {

            return res.status(404).json({

                message: "Exercice introuvable."

            });

        }

        exercise.title = req.body.title;
        exercise.description = req.body.description;
        exercise.instructions = req.body.instructions;
        exercise.points = req.body.points;
        exercise.dueDate = req.body.dueDate;

        if (req.file) {

            if (

                exercise.attachment &&
                fs.existsSync(exercise.attachment)

            ) {

                fs.unlinkSync(exercise.attachment);

            }

            exercise.attachment = req.file.path;

        }

        await exercise.save();

        res.json({

            message: "Exercice modifié.",

            exercise

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// SUPPRIMER
// ======================================================

export const deleteExercise = async (req, res) => {

    try {

        const exercise = await Exercise.findById(

            req.params.id

        );

        if (!exercise) {

            return res.status(404).json({

                message: "Exercice introuvable."

            });

        }

        if (

            exercise.attachment &&
            fs.existsSync(exercise.attachment)

        ) {

            fs.unlinkSync(exercise.attachment);

        }

        await exercise.deleteOne();

        res.json({

            message: "Exercice supprimé."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};