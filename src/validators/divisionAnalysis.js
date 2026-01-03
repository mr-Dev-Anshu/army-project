import Joi from "joi";

export const divisionAnalysisValidator = Joi.object({
  monthYear: Joi.date().optional(),

  offence: Joi.string().optional(),

  actionTaken: Joi.number().min(0).optional(),

  actionPending: Joi.number().min(0).optional(),

  totalNumberOfCases: Joi.number().min(0).optional(),

  remark: Joi.string().allow("", null).optional(),

  divisionName: Joi.string().optional(),
}).unknown(true); // ✅ allow extra fields
