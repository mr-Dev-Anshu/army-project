// validations/temporaryHiredWorkerValidation.js
import Joi from "joi";

const subWorkerSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Sub-worker name is required",
    "any.required": "Sub-worker name is required",
  }),
  mobile: Joi.string().trim().optional(),
  aadhar: Joi.string().trim().length(12).optional(), 
});

const temporaryHiredWorkerSchema = Joi.object({
  workerName: Joi.string().trim().min(1).required().messages({
    "string.empty": "Worker name is required",
    "any.required": "Worker name is required",
  }),

  workerMobile: Joi.string().trim().optional(),
  workerAadhar: Joi.string().trim().length(12).optional(), 

  permanentAddressLine: Joi.string().trim().optional(),
  permanentCityDistrict: Joi.string().trim().optional(),
  permanentState: Joi.string().trim().optional(),
  permanentPincode: Joi.string().trim().length(6).optional(), 

  placeOfStay: Joi.string().trim().optional(),
  placeOfDuty: Joi.string().trim().optional(),

  passNumber: Joi.string().trim().min(1).required().messages({
    "string.empty": "Pass number is required",
    "any.required": "Pass number is required",
  }),

  validFrom: Joi.date().allow(null).optional(),
  validTill: Joi.date().allow(null).optional(),

  subWorkers: Joi.array().items(subWorkerSchema).optional().default([]),
});

const updateTemporaryHiredWorkerSchema = temporaryHiredWorkerSchema.fork(
  [
    "workerName",
    "workerMobile",
    "workerAadhar",
    "permanentAddressLine",
    "permanentCityDistrict",
    "permanentState",
    "permanentPincode",
    "placeOfStay",
    "placeOfDuty",
    "passNumber",
    "validFrom",
    "validTill",
    "subWorkers",
  ],
  (schema) => schema.optional()
);

export {
  temporaryHiredWorkerSchema as createTemporaryHiredWorkerSchema,
  updateTemporaryHiredWorkerSchema,
};