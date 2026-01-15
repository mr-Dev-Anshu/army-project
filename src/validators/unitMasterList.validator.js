import Joi from "joi";

const unitIdentifierSchema = Joi.object({
    unitType: Joi.string().trim().required().messages({
        "any.required": "Unit Type is required"
    }),
    unitName: Joi.string().trim().required().messages({
        "any.required": "Unit Name is required"
    }),
    unitShortForm: Joi.string().trim().required().messages({
        "any.required": "Unit Short Form is required"
    }),
    serviceArm: Joi.string().trim().required().messages({
        "any.required": "Service/Arm is required"
    }),
    locationStation: Joi.string().trim().required().messages({
        "any.required": "Location/Station is required"
    }),
});

const unitHierarchyAndControlSchema = Joi.object({
    command: Joi.string().trim().required().messages({
        "any.required": "Command is required"
    }),
    corps: Joi.string().trim().required().messages({
        "any.required": "Corps is required"
    }),
    brigade: Joi.string().trim().required().messages({
        "any.required": "Brigade is required"
    }),
    division: Joi.string().trim().required().messages({
        "any.required": "Division is required"
    }),
    seniorityOrder: Joi.string().trim().required().messages({
        "any.required": "Seniority Order is required"
    }),
});

const unitClassificationSchema = Joi.object({
    unitStatus: Joi.string().valid("permanent", "attached", "visiting", "detached", "onTemporaryDuty").required(),
    attachmentValidFrom: Joi.date().when('unitStatus', {
        is: Joi.valid('permanent'),
        then: Joi.optional(),
        otherwise: Joi.required().messages({ 'any.required': 'Attachment Valid From is required' })
    }),
    attachmentValidTo: Joi.date().when('unitStatus', {
        is: Joi.valid('permanent'),
        then: Joi.optional(),
        otherwise: Joi.required().messages({ 'any.required': 'Attachment Valid To is required' })
    }),
    attachedTo: Joi.string().trim().when('unitStatus', {
        is: Joi.valid('permanent'),
        then: Joi.optional(),
        otherwise: Joi.required().messages({ 'any.required': 'Attached To is required' })
    }),
});

const createUnitMasterListSchema = Joi.object({
    unitIdentifier: unitIdentifierSchema.required(),
    unitHierarchyAndControl: unitHierarchyAndControlSchema.required(),
    unitClassification: unitClassificationSchema.optional(),
    unitActiveStatus: Joi.boolean().required(),
    remarks: Joi.string().trim().allow('').optional(),
});

const updateUnitMasterListSchema = Joi.object({
    unitIdentifier: unitIdentifierSchema.optional(),
    unitHierarchyAndControl: unitHierarchyAndControlSchema.optional(),
    unitClassification: unitClassificationSchema.optional(),
    unitActiveStatus: Joi.boolean().optional(),
    remarks: Joi.string().trim().allow('').optional(),
});

export {
    createUnitMasterListSchema,
    updateUnitMasterListSchema
};
