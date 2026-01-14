import Joi from "joi";

// Sub-schema for Vehicle Identification
const vehicleIdentificationSchema = Joi.object({
    registrationNumber: Joi.string().trim().required().messages({
        "any.required": "Registration number is required",
        "string.empty": "Registration number is required"
    }),
    color: Joi.string().trim().optional().allow(""),
    category: Joi.string().trim().optional().allow(""),
    type: Joi.string().trim().optional().allow(""),
});

// Sub-schema for Owner Information
const ownerInformationSchema = Joi.object({
    name: Joi.string().trim().optional().allow(""),
    mobileNumber: Joi.string().trim().optional().allow(""),
    ownerType: Joi.string().trim().optional().allow(""),

    armyNo: Joi.string().trim().optional().allow(""),
    rank: Joi.string().trim().optional().allow(""),
    unit: Joi.string().trim().optional().allow(""),
    fmn: Joi.string().trim().optional().allow(""),
    command: Joi.string().trim().optional().allow(""),
    address: Joi.string().trim().optional().allow(""),
});

// Sub-schema for Vehicle Pass Details
const vehiclePassDetailsSchema = Joi.object({
    isAvailable: Joi.boolean().optional(),
    passNumber: Joi.string().trim().when('isAvailable', {
        is: true,
        then: Joi.required().messages({
            "any.required": "Pass number is required when pass is available",
            "string.empty": "Pass number is required when pass is available"
        }),
        otherwise: Joi.optional().allow("")
    }),
    issuedDate: Joi.date().allow(null).when('isAvailable', {
        is: true,
        then: Joi.required().messages({
            "any.required": "Issued date is required when pass is available",
            "date.base": "Issued date must be a valid date"
        }),
        otherwise: Joi.optional()
    }),
    validFrom: Joi.date().allow(null).when('isAvailable', {
        is: true,
        then: Joi.required().messages({
            "any.required": "Valid From date is required when pass is available",
            "date.base": "Valid From must be a valid date"
        }),
        otherwise: Joi.optional()
    }),
    validTo: Joi.date().allow(null).when('isAvailable', {
        is: true,
        then: Joi.required().messages({
            "any.required": "Valid To date is required when pass is available",
            "date.base": "Valid To must be a valid date"
        }),
        otherwise: Joi.optional()
    }),
    issuingAuthority: Joi.string().trim().when('isAvailable', {
        is: true,
        then: Joi.required().messages({
            "any.required": "Issuing Authority is required when pass is available",
            "string.empty": "Issuing Authority is required when pass is available"
        }),
        otherwise: Joi.optional().allow("")
    }),
});

// Sub-schema for Authentication
const authenticationSchema = Joi.object({
    initialsMPCPNCO: Joi.string().trim().optional().allow(""),
    initialsQMSJCO: Joi.string().trim().optional().allow(""),
    initials2IC: Joi.string().trim().optional().allow(""),
});

// Main Schema
const vehiclesSecurityPassSchema = Joi.object({
    vehicleIdentification: vehicleIdentificationSchema.required(),
    ownerInformation: ownerInformationSchema.required(),
    vehiclePassDetails: vehiclePassDetailsSchema.optional(),
    authentication: authenticationSchema.optional(),
    remark: Joi.string().trim().optional().allow(""),
    customFields: Joi.object().optional(),
});


const updateVehiclesSecurityPassSchema = Joi.object({
    vehicleIdentification: vehicleIdentificationSchema.optional(),
    ownerInformation: ownerInformationSchema.optional(),
    vehiclePassDetails: vehiclePassDetailsSchema.optional(),
    authentication: authenticationSchema.optional(),
    remark: Joi.string().trim().optional().allow(""),
    customFields: Joi.object().optional(),
});

export {
    vehiclesSecurityPassSchema as createVehiclesSecurityPassSchema,
    updateVehiclesSecurityPassSchema,
};
