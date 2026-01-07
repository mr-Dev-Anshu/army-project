import Joi from "joi";

export const createStaticSpeedCheckRecordSchema = Joi.object({
  reportId: Joi.string(),
  vehicleType: Joi.string().required().trim().messages({
    "any.required": "vehicleType is required",
    "string.empty": "vehicleType cannot be empty",
  }),
  vehicleCategory: Joi.string().trim().optional(),
  vehicleNumber: Joi.string().trim().optional(),
  vehicleName: Joi.string().trim().optional(),
  onDutyDetails: Joi.object({
    dateOfDuty: Joi.date().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    dutyLocation: Joi.string().trim().optional(),
    dutyType: Joi.string().trim().optional(),
    customFields: Joi.object().unknown(true).optional(),

  }).optional(),

  onDutyDetailsMPReporting: Joi.object({
    nameReportingMP: Joi.string().trim().optional(),
    rank: Joi.string().trim().optional(),
    unit: Joi.string().trim().optional(),
    armyNumber: Joi.string().trim().optional(),
    customFields: Joi.object().unknown(true).optional(),

  }).optional(),

  offenceOccurenceDetails: Joi.object({
    time: Joi.date().required().messages({
      "any.required": "time of offence is required",
    }),

    incidentLocation: Joi.string().trim().optional(),

    // Accept frontend actualSpeed
    actualSpeed: Joi.string().trim().optional(),

    // Accept backend key also (safe)
    actualSpeedNoted: Joi.string().trim().optional(),

    authSpeed: Joi.string().trim().optional(),
    offenceTypes: Joi.array().items(Joi.string()).optional(),
    offenceTypeReference: Joi.array().items(Joi.string()).optional(),

    // Accept frontend overSpeed
    overSpeed: Joi.string().trim().optional(),

    // Accept backend key also
    overSpeedCalculated: Joi.string().trim().optional(),

    description: Joi.string().trim().optional(),

    customFields: Joi.object().unknown(true).optional(),
  }).required(),

  offenders: Joi.array().items(Joi.object().unknown(true)).optional(),

  remark: Joi.string().trim().optional(),
  customFields: Joi.object()
    .unknown(true)
    .optional(),
  actionStatus: Joi.boolean().optional(),
  actionStatusRemark: Joi.string().optional(),
});

export const updateStaticSpeedCheckRecordSchema = createStaticSpeedCheckRecordSchema.fork(
  Object.keys(createStaticSpeedCheckRecordSchema.describe().keys),
  (schema) => schema.optional()
);