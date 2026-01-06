import Joi from "joi";

export const createOffenceReferenceSchema = Joi.object({
  offenceType: Joi.string()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Offence type is required",
    }),

  reference: Joi.string()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Reference is required",
    }),
});

export const updateOffenceReferenceSchema = Joi.object({
  offenceType: Joi.string().trim().lowercase().optional(),
  reference: Joi.string().trim().lowercase().optional(),
}).min(1);
