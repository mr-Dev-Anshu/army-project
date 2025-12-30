import Joi from "joi";

export const createOffenderSchema = Joi.object({
  offenceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid ObjectId format for offenceId",
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
  category: Joi.string().optional(),
  offenderDetails: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid("Driver", "CoDriver")
          .required(),
        details: Joi.object().unknown(true).required(),
      })
    )
    .min(1)
    .required(),

  customFields: Joi.object()
    .unknown(true)
    .default({})
    .optional(),

});

export const updateOffenderSchema = createOffenderSchema.fork(
  ["offenceId", "offenderType", "offenderDetails", "customFields"],
  (schema) => schema.optional()
);