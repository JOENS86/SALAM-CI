import Joi from "joi";

// =====================================================
// VALIDATION CREATION CONFERENCE
// =====================================================

export const createConferenceSchema = Joi.object({

    course: Joi.string()

        .required()

        .messages({

            "any.required": "Le cours est obligatoire."

        }),

    title: Joi.string()

        .min(5)

        .max(150)

        .required()

        .messages({

            "string.empty": "Le titre est obligatoire.",

            "string.min": "Le titre est trop court."

        }),

    description: Joi.string()

        .allow("")

        .max(2000),

    image: Joi.string()

        .allow(""),

    date: Joi.date()

        .required()

        .messages({

            "any.required": "La date est obligatoire."

        }),

    time: Joi.string()

        .required()

        .messages({

            "any.required": "L'heure est obligatoire."

        }),

    duration: Joi.number()

        .min(15)

        .max(600)

        .required()

        .messages({

            "number.min": "La durée minimale est de 15 minutes."

        }),

        maxParticipants: Joi.number()

        .min(2)

        .max(1000)

        .required()

        .messages({

            "number.min": "Au moins 2 participants."

        })

});
