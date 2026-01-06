import Joi from "joi";

const singleSchema = Joi.object({
  monthYear: Joi.date().optional(),
  offence: Joi.string().optional(),
  actionTaken: Joi.number().min(0).optional(),
  actionPending: Joi.number().min(0).optional(),
  totalNumberOfCases: Joi.number().min(0).optional(),
  remark: Joi.string().allow("", null).optional(),
  divisionName: Joi.string().optional(),
}).unknown(true);

export const divisionAnalysisValidator = Joi.alternatives().try(
  singleSchema,
  Joi.array().items(singleSchema)
);
