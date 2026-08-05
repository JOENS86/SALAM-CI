import Joi from "joi";

// =====================================================
// VALIDATION INSCRIPTION
// =====================================================

export const enrollmentSchema = Joi.object({

    courseId: Joi.string()

        .required()

        .messages({

            "any.required":

                "Le cours est obligatoire."

        })

});