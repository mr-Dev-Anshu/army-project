import Joi from "joi";

const mtAccidentReportSchema = Joi.object({
  individualType: Joi.string()
    .valid(
      "Military Personnel",
      "Civilian",
      "Employee",
      "Servant / Maid",
      "Shop Keeper",
      "Temporary Hired Worker"
    )
    .optional()
    .messages({
      "any.only": "Please select a valid individual type",
    }),

  dateOfAccident: Joi.date().allow(null).optional().messages({
    "date.base": "Date must be valid",
  }),
  timeOfAccident: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$|^$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Time must be in 24hr format (HH:MM)",
    }),
  placeOfAccident: Joi.string().allow("").optional().messages({
    "string.empty": "Place of accident is required",
  }),
  typeOfAccident: Joi.string()
    .valid("Normal", "Serious", "Fatal", "Very Serious")
    .optional()
    .messages({
      "any.only": "Please select accident type",
    }),
  probableCause: Joi.string().trim().optional().messages({
    "string.empty": "Probable cause is required",
  }),

  vehicleNumber: Joi.string().allow("").optional(),
  makeAndModel: Joi.string().allow("").optional(),

  injuredCivil: Joi.number().integer().min(0).optional().default(0),
  injuredMilitary: Joi.number().integer().min(0).optional().default(0),
  diedCivil: Joi.number().integer().min(0).optional().default(0),
  diedMilitary: Joi.number().integer().min(0).optional().default(0),

  firCaseNumber: Joi.string().allow("").optional(),
  firDate: Joi.date().allow(null).optional(),
  firPoliceStation: Joi.string().allow("").optional(),

  actionStatus: Joi.boolean().optional().default(false),
  remark: Joi.string().allow("").optional(),

  unit: Joi.string().trim().allow("").optional(),
  fmn: Joi.string().trim().allow("").optional(),
  
  individualDetails: Joi.object().unknown(true).optional().default({}),
  driverDetails: Joi.object().unknown(true).optional().default({}),
  coDriverDetails: Joi.object().unknown(true).optional().default({}),
  
  offenders: Joi.array()
    .items(Joi.object().unknown(true))
    .optional()
    .default([]),
});

const updateMTAccidentReportSchema = mtAccidentReportSchema.fork(
  [
    "individualType",
    "dateOfAccident",
    "timeOfAccident",
    "placeOfAccident",
    "typeOfAccident",
    "probableCause",
    "vehicleNumber",
    "makeAndModel",
    "injuredCivil",
    "injuredMilitary",
    "diedCivil",
    "diedMilitary",
    "firCaseNumber",
    "firDate",
    "firPoliceStation",
    "actionStatus",
    "remark",
    "unit",
    "fmn",
    "individualDetails",
    "driverDetails",
    "coDriverDetails",
    "offenders",
  ],
  (schema) => schema.optional()
);

export {
  mtAccidentReportSchema as createMTAccidentReportSchema,
  updateMTAccidentReportSchema,
};