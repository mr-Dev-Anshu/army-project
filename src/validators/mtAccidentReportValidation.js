import Joi from "joi";
const individualSchema = Joi.object({
  individualType: Joi.string().optional(),

  individualDetails: Joi.object().unknown(true).optional(),

  hasMilitaryRelative: Joi.boolean().optional(),

  militaryRelative: Joi.object().unknown(true).optional(),

  coDriverAvailable: Joi.boolean().optional(),
  coDriver: Joi.object().unknown(true).optional(),

  passengers: Joi.array().items(Joi.object().unknown(true)).optional(),

  isVehicleInvolved: Joi.boolean().optional(),
  vehicleType: Joi.string().allow(null, "").optional(),
  vehicleRegistration: Joi.string().allow(null, "").optional(),
}).unknown(true); // 🔥 MOST IMPORTANT

const accidentSchema = Joi.object({
  accidentTime: Joi.string().allow(null, "").optional(),
  accidentDate: Joi.date().allow(null, "").optional(),
  placeOfAccident: Joi.string().allow(null, "").optional(),
  accidentType: Joi.string()
    .valid("normal", "serious", "fatal", "verySerious")
    .optional(),
  causeOfAccident: Joi.string().allow(null, "").optional(),
});

const vehicleSchema = Joi.object({
  vehicleNumber: Joi.string().allow(null, "").optional(),
  vehicleModel: Joi.string().allow(null, "").optional(),
});

const casualtySchema = Joi.object({
  injuredCivil: Joi.number().default(0),
  injuredMilitary: Joi.number().default(0),
  diedCivil: Joi.number().default(0),
  diedMilitary: Joi.number().default(0),
});

const firMactSchema = Joi.object({
  firMactNumber: Joi.string().allow(null, "").optional(),
  firDate: Joi.date().allow(null, "").optional(),
  firPoliceStation: Joi.string().allow(null, "").optional(),
});

const authenticationSchema = Joi.object({
  initialsOfMPCRNCO: Joi.boolean().default(false),
  initialsOfSMSJCO: Joi.boolean().default(false),
  initialsOf2IC: Joi.boolean().default(false),
  initialsMPCPNCO: Joi.string().allow(null, "").optional(),
  initialsQMSJCO: Joi.string().allow(null, "").optional(),
  initials2IC: Joi.string().allow(null, "").optional(),
});

export const createMTAccidentReportSchema = Joi.object({
  individuals: Joi.array().items(individualSchema).min(1).required(),

  accidentDetails: accidentSchema.optional(),
  vehicleDetails: vehicleSchema.optional(),
  casualtyDetails: casualtySchema.optional(),
  firMactDetails: firMactSchema.optional(),
  authentication: authenticationSchema.optional(),
  actionStatus: Joi.string().valid("pending", "taken").default("pending"),
  actionStatusRemark: Joi.string().allow(null, "").optional(),
  damageToVehicle: Joi.string().allow(null, "").optional(),
  customFields: Joi.object().optional().unknown(true),
}).unknown(true);
