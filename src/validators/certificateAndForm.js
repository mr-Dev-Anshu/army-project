// validators/certificateAndForm.ts
import Joi from "joi";

export const certificateValidator = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Certificate Name is required",
      "any.required": "Certificate Name is required",
    }),

  url: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Certificate URL is required",
      "any.required": "Certificate URL is required",
    }),

  type: Joi.string()
    .trim()
    .valid("certificate", "form", "letter")
    .required()
    .messages({
      "string.empty": "Certificate type is required",
      "any.only": "Certificate type must be one of 'certificate', 'form', or 'letter'",
      "any.required": "Certificate type is required",
    }),
    oldUrl: Joi.string().trim(),
});
