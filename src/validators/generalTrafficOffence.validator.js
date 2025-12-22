import Joi from "joi";

export const createGeneralTrafficOffenceSchema = Joi.object({
  isVehicleInvolved: Joi.boolean().required(),

  vehicleCategory: Joi.string().valid("2-Wheeler", "4-Wheeler").optional(),
  vehicleType: Joi.string().valid("Civilian Vehicle", "DD Vehicle").optional(),
  vehicleNumber: Joi.string().optional(),
  vehicleNumber:Joi.string().optional()  , 
  onDutyDetails: Joi.object({
    dateOfDuty: Joi.date().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    dutyLocation: Joi.string().optional(),
    dutyType: Joi.string().optional(),

    customFields: Joi.object().unknown(true).optional(), 
  })
    .unknown(true) 
    .optional(),

  onDutyDetailsMPReporting: Joi.object({
    nameReportingMP: Joi.string().optional(),
    rank: Joi.string().optional(),
    unit: Joi.string().optional(),
    armyNumber: Joi.string().optional(),
    customFields: Joi.object().unknown(true).optional(),
  })
    .unknown(true)
    .optional(),

  
  offenceOccurenceDetails: Joi.object({
    timeOfOffence: Joi.date().optional(),
    incidentLocation: Joi.string().optional(),
    description: Joi.string().optional(),
    customFields: Joi.object().unknown(true).optional(),
  })
    .unknown(true)
    .optional(),

  offenceTypes: Joi.array().items(Joi.string()).optional(),
  offenceTypeReference: Joi.array().items(Joi.string()).optional(),

  customFields: Joi.object()
    .unknown(true) 
    .optional(),
});

export const updateGeneralTrafficOffenceSchema = createGeneralTrafficOffenceSchema.fork(
  Object.keys(createGeneralTrafficOffenceSchema.describe().keys),
  (schema) => schema.optional()
);