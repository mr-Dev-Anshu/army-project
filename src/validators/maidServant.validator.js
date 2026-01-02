import Joi from "joi";

const familyMemberSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Family member name is required",
    "any.required": "Family member name is required",
  }),
  relationship: Joi.string().trim().optional(),
  age: Joi.string().trim().optional(),
});

const maidServantSecurityPassSchema = Joi.object({
  qtrNumber: Joi.string().trim().optional(),
  ownerName: Joi.string().trim().optional(),
  ownerRank: Joi.string().trim().optional(),
  ownerUnit: Joi.string().trim().optional(),

  servantName: Joi.string().trim().min(1).required().messages({
    "string.empty": "Servant name is required",
    "any.required": "Servant name is required",
  }),
  servantMobile: Joi.string().trim().optional(),
  servantAadhar: Joi.string().trim().length(12).optional(),

  permanentAddressLine: Joi.string().trim().optional(),
  permanentCityDistrict: Joi.string().trim().optional(),
  permanentState: Joi.string().trim().optional(),
  permanentPincode: Joi.string().trim().length(6).optional(),

  passNumber: Joi.string().trim().min(1).required().messages({
    "string.empty": "Pass number is required",
    "any.required": "Pass number is required",
  }),

  validFrom: Joi.date().allow(null).optional(),
  validTill: Joi.date().allow(null).optional(),

  familyMembers: Joi.array().items(familyMemberSchema).optional().default([]),
});

const updateMaidServantSecurityPassSchema = maidServantSecurityPassSchema.fork(
  [
    "qtrNumber",
    "ownerName",
    "ownerRank",
    "ownerUnit",
    "servantName",
    "servantMobile",
    "servantAadhar",
    "permanentAddressLine",
    "permanentCityDistrict",
    "permanentState",
    "permanentPincode",
    "passNumber",
    "validFrom",
    "validTill",
    "familyMembers",
  ],
  (schema) => schema.optional()
);

export {
  maidServantSecurityPassSchema as createMaidServantSecurityPassSchema,
  updateMaidServantSecurityPassSchema,
};