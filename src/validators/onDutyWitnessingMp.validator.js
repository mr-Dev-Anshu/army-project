import Joi from "joi";

export const createOnDutyWitnessingMpSchema = Joi.object({
  offenceId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
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
});

export const updateOnDutyWitnessingMpSchema = createOnDutyWitnessingMpSchema.fork(
  ["rank", "unit", "ArmyNo"],
  (schema) => schema.optional()
);