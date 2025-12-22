import Joi from "joi";

export const createStaticSpeedCheckRecordSchema = Joi.object({
  vehicleType: Joi.string().required().trim().messages({
    "any.required": "vehicleType is required",
    "string.empty": "vehicleType cannot be empty",
  }),
  vehicleCategory: Joi.string().trim().optional(),
  vehicleNumber: Joi.string().trim().optional(), 
  vehicleName:Joi.string().trim().optional(),
  onDutyDetails: Joi.object({
    dateOfDuty: Joi.date().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    dutyLocation: Joi.string().trim().optional(),
    dutyType: Joi.string().trim().optional(),
  }).optional(),

  onDutyDetailsMPReporting: Joi.object({
    nameReportingMP: Joi.string().trim().optional(),
    rank: Joi.string().trim().optional(),
    unit: Joi.string().trim().optional(),
    armyNumber: Joi.string().trim().optional(),
  }).optional(),

  offenceOccurenceDetails: Joi.object({
    time: Joi.date().required().messages({
      "any.required": "time of offence is required",
    }),
    incidentLocation: Joi.string().trim().optional(),
    actualSpeedNoted: Joi.string().trim().optional(),
    authSpeed: Joi.string().trim().optional(),
    overSpeedCalculated: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
  }).required(),

  remark: Joi.string().trim().optional(),
});

export const updateStaticSpeedCheckRecordSchema = createStaticSpeedCheckRecordSchema.fork(
  [
    "vehicleType",
    "offenceOccurenceDetails.time",
  ],
  (schema) => schema.optional()
);