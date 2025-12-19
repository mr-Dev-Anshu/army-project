import Joi from "joi";

export const createOffenderSchema = Joi.object({
  offenceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid ObjectId",
    }),
    
  offenderType: Joi.string()
    .valid(
      "Military Person",
      "Employee",
      "Civilian",
      "Servant/Maid",
      "Shop Keeper",
      "Temporary Hired Worker"
    )
    .required(),

  offenderDetails: Joi.object().unknown(true).optional(),
});

export const updateOffenderSchema = createOffenderSchema.fork(
  Object.keys(createOffenderSchema.describe().keys), 
  (schema) => schema.optional()
);