// validations/shopkeeperSecurityPassValidation.js
import Joi from "joi";

const workerSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Worker name is required",
    "any.required": "Worker name is required",
  }),
  aadhar: Joi.string().trim().length(12).optional(),
  type: Joi.string().trim().optional(),
});

const shopkeeperSecurityPassSchema = Joi.object({
  shopName: Joi.string().trim().min(1).required().messages({
    "string.empty": "Shop name is required",
    "any.required": "Shop name is required",
  }),

  shopAddress: Joi.string().trim().optional(),
  unit: Joi.string().trim().optional(),

  ownerName: Joi.string().trim().optional(),
  ownerMobile: Joi.string().trim().optional(),
  ownerAadhar: Joi.string().trim().length(12).optional(),

  priceListApproved: Joi.boolean().optional(),
  priceListEffectiveFrom: Joi.date().allow(null).optional(),
  priceListExpiredOn: Joi.date().allow(null).optional(),

  passNumber: Joi.string().trim().min(1).required().messages({
    "string.empty": "Pass number is required",
    "any.required": "Pass number is required",
  }),

  validFrom: Joi.date().allow(null).optional(),
  validTill: Joi.date().allow(null).optional(),

  workers: Joi.array().items(workerSchema).optional().default([]),
});

const updateShopkeeperSecurityPassSchema = shopkeeperSecurityPassSchema.fork(
  [
    "shopName",
    "shopAddress",
    "unit",
    "ownerName",
    "ownerMobile",
    "ownerAadhar",
    "priceListApproved",
    "priceListEffectiveFrom",
    "priceListExpiredOn",
    "passNumber",
    "validFrom",
    "validTill",
    "workers",
  ],
  (schema) => schema.optional()
);

export {
  shopkeeperSecurityPassSchema as createShopkeeperSecurityPassSchema,
  updateShopkeeperSecurityPassSchema,
};