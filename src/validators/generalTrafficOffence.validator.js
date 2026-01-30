import Joi from "joi";

export const createGeneralTrafficOffenceSchema = Joi.object({
  reportId: Joi.string().allow("").optional(),
  isVehicleInvolved: Joi.boolean().required(),
  vehicleCategory: Joi.string().valid("2-Wheeler", "4-Wheeler").allow(null).optional(),
  vehicleType: Joi.string().valid("Civilian Vehicle", "DD Vehicle").allow(null).optional(),
  vehicleNumber: Joi.string().allow("").optional(),
  vehicleName: Joi.string().allow("").optional(),
  driverType: Joi.string().allow("").optional(),
  remarks: Joi.string().allow("").optional(),

  onDutyDetails: Joi.object({
    dateOfDuty: Joi.date().allow(null).optional(),
    startTime: Joi.date().allow(null).optional(),
    endTime: Joi.date().allow(null).optional(),
    dutyLocation: Joi.string().allow("").optional(),
    dutyType: Joi.string().allow("").optional(),
    customFields: Joi.object().unknown(true).optional(),
  })
    .unknown(true)
    .optional(),

  onDutyDetailsMPReporting: Joi.object({
    nameReportingMP: Joi.string().allow("").optional(),
    rank: Joi.string().allow("").optional(),
    unit: Joi.string().allow("").optional(),
    armyNumber: Joi.string().allow("").optional(),
    customFields: Joi.object().unknown(true).optional(),
  })
    .unknown(true)
    .optional(),


  offenceOccurenceDetails: Joi.object({
    timeOfOffence: Joi.date().allow(null).optional(),
    incidentLocation: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    briefDescription: Joi.string().allow("").optional(),
    customFields: Joi.object().unknown(true).optional(),
  })
    .unknown(true)
    .optional(),

  offenceTypes: Joi.array().items(Joi.string().allow("")).optional(),
  offenceTypeReference: Joi.array().items(Joi.string().allow("")).optional(),
  actionStatus: Joi.boolean().optional(),
  actionStatusRemark: Joi.string().allow("").optional(),
  customFields: Joi.object()
    .unknown(true)
    .optional(),

},


);


export const updateGeneralTrafficOffenceSchema = createGeneralTrafficOffenceSchema.fork(
  Object.keys(createGeneralTrafficOffenceSchema.describe().keys),
  (schema) => schema.optional()
);