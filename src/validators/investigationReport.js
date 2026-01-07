// lib/validators/mpReport.validator.js
import Joi from "joi";

// Common schemas
const requiredString = Joi.string().trim().min(1).required().messages({
  "string.empty": "Required field",
  "any.required": "Required field",
});

const optionalString = Joi.string().trim().allow("").optional();

const optionalDate = Joi.date().optional();

// For customFields - any object
const customFields = Joi.object().unknown(true).default({});

// Array items
const documentItem = Joi.object({
  statement: optionalString,
  url: requiredString,
  customFields,
});

const evidenceItem = Joi.object({
  type: requiredString,
  url: requiredString,
  description: optionalString,
  customFields,
});

export const createMPReportSchema = Joi.object({
  reportId: Joi.string(),
  reportDetails: Joi.object({
    reportNumber: requiredString,
    command: requiredString,
    firNumber: optionalString,
    firFileUrl: optionalString,
    customFields,
  }).required(),

  investigationHead: Joi.object({
    armyNumber: requiredString,
    rank: requiredString,
    name: requiredString,
    unit: requiredString,
    fmn: optionalString,
    command: optionalString,
    address: optionalString,
    iCardNumber: optionalString,
    customFields,
  }).required(),

  occurrenceDetails: Joi.object({
    offenceTypes: Joi.array().items(Joi.string()).optional(),
    offenceTypeReference: Joi.array().items(Joi.string()).optional(),
    placeOfOccurrence: requiredString,
    dateOfOccurrence: Joi.date().required().messages({
      "date.base": "Valid date required",
    }),
    timeOfOccurrence: optionalDate,
    description: requiredString,
    customFields,
  }).required(),

  individuals: Joi.array()
    .items(
      Joi.object({
        // known fields...
        armyNumber: optionalString,
        rank: optionalString,
        name: optionalString,
        unit: optionalString,
        fmn: optionalString,
        address: optionalString,
        identityCard: optionalString,
        remark: optionalString,
        role: optionalString,
        // Traffic fields
        isVehicleInvolved: Joi.boolean().optional(),
        vehicleCategory: optionalString,
        vehicleNumber: optionalString,
        customFields,
      }).unknown(true) // 🔥 Allow extra fields like armyNo, iCardNumber
    )
    .default([]),

  witnesses: Joi.array()
    .items(
      Joi.object({
        armyNumber: optionalString,
        rank: optionalString,
        name: optionalString,
        unit: optionalString,
        fmn: optionalString,
        address: optionalString,
        identityCard: optionalString,
        remark: optionalString,
        customFields,
      }).unknown(true) // 🔥 Allow extra fields
    )
    .default([]),

  documents: Joi.array().items(documentItem.unknown(true)).default([]),
  evidences: Joi.array().items(evidenceItem.unknown(true)).default([]),

  detailedOccurrenceReport: optionalString,
  pointsFindOutDuringInvestigation: optionalString,
  opinion: optionalString,

  remarks: Joi.object({
    analysis: optionalString,
    recommendation: optionalString,
    customFields,
  }).optional(),
  actionStatus: Joi.boolean().optional(),
  actionStatusRemark: Joi.string().optional(),

  customFields: Joi.object().unknown(true).optional(),
});

export const updateMPReportSchema = createMPReportSchema.fork(
  Object.keys(createMPReportSchema.describe().keys),
  (schema) => schema.optional()
);