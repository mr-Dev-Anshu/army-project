import Joi from "joi";

export const createOnDutyWitnessingMpSchema = Joi.object({
  offenceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)  
    .required()
    .messages({
      "string.pattern.base": "Invalid ObjectId format for offenceId",
      "any.required": "offenceId is required",
    }),

  rank: Joi.string().required().trim(),
  unit: Joi.string().required().trim(),
  ArmyNo: Joi.string().required().trim(),

  name: Joi.string().trim().optional(),
  contactNumber: Joi.string().trim().optional(),

  customFields: Joi.object()
    .unknown(true)
    .default({})
    .optional(),
}).unknown(true);  

export const updateOnDutyWitnessingMpSchema = createOnDutyWitnessingMpSchema.fork(
  ["offenceId", "rank", "unit", "ArmyNo", "name", "contactNumber", "customFields"],
  (schema) => schema.optional()
);