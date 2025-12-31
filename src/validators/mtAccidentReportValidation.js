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
    .required()
    .messages({
      "any.only": "Please select a valid individual type",
      "any.required": "Individual type is required",
    }),

  dateOfAccident: Joi.date().required().messages({
    "date.base": "Date of accident is required",
    "any.required": "Date of accident is required",
  }),
  timeOfAccident: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in 24hr format (HH:MM)",
      "any.required": "Time of accident is required",
    }),
  placeOfAccident: Joi.string().trim().min(1).required().messages({
    "string.empty": "Place of accident is required",
  }),
  typeOfAccident: Joi.string()
    .valid("Normal", "Serious", "Fatal", "Very Serious")
    .required()
    .messages({
      "any.only": "Please select accident type",
      "any.required": "Accident type is required",
    }),
  probableCause: Joi.string().trim().min(1).required().messages({
    "string.empty": "Probable cause is required",
  }),

  vehicleNumber: Joi.string().trim().optional(),
  makeAndModel: Joi.string().trim().optional(),

  injuredCivil: Joi.number().integer().min(0).optional().default(0),
  injuredMilitary: Joi.number().integer().min(0).optional().default(0),
  diedCivil: Joi.number().integer().min(0).optional().default(0),
  diedMilitary: Joi.number().integer().min(0).optional().default(0),

  firCaseNumber: Joi.string().trim().optional(),
  firDate: Joi.date().allow(null).optional(),
  firPoliceStation: Joi.string().trim().optional(),

  actionStatus: Joi.boolean().optional().default(false),
  remark: Joi.string().trim().optional(),
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
  ],
  (schema) => schema.optional()
);

export {
  mtAccidentReportSchema as createMTAccidentReportSchema,
  updateMTAccidentReportSchema,
};