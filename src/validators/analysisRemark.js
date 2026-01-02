import Joi from "joi";

const analysisRemarkSchema = Joi.object({
  offenceType: Joi.string().trim().min(1).required().messages({
    "string.empty": "Offence type is required",
    "any.required": "Offence type is required",
  }),
  remark: Joi.string().trim().optional(),
  monthYear: Joi.date().required().messages({
    "date.base": "Month/Year is required and must be a valid date",
    "any.required": "Month/Year is required",
  }),
});

const updateAnalysisRemarkSchema = analysisRemarkSchema.fork(
  ["offenceType", "remark", "monthYear"],
  (schema) => schema.optional()
);

export {
  analysisRemarkSchema as createAnalysisRemarkSchema,
  updateAnalysisRemarkSchema,
};