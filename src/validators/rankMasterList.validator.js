import Joi from "joi";

const rankMasterListSchema = Joi.object({
    rankCategory: Joi.string().trim().required().messages({
        "any.required": "Rank Category is required",
        "string.empty": "Rank Category is required"
    }),
    rank: Joi.string().trim().required().messages({
        "any.required": "Rank is required",
        "string.empty": "Rank is required"
    }),
    rankShortForm: Joi.string().trim().required().messages({
        "any.required": "Rank Short Form is required",
        "string.empty": "Rank Short Form is required"
    }),
    rankSeniorityOrder: Joi.string().trim().required().messages({
        "any.required": "Rank Seniority Order is required",
        "string.empty": "Rank Seniority Order is required"
    }),
    rankActiveStatus: Joi.boolean().required().messages({
        "any.required": "Rank Active Status is required",
    }),
    serviceArm: Joi.string().trim().required().messages({
        "any.required": "Service/Arm is required",
        "string.empty": "Service/Arm is required"
    }),
    remarks: Joi.string().trim().required().messages({
        "any.required": "Remarks is required",
        "string.empty": "Remarks is required"
    }),
});

const updateRankMasterListSchema = Joi.object({
    rankCategory: Joi.string().trim().optional(),
    rank: Joi.string().trim().optional(),
    rankShortForm: Joi.string().trim().optional(),
    rankSeniorityOrder: Joi.string().trim().optional(),
    rankActiveStatus: Joi.boolean().optional(),
    serviceArm: Joi.string().trim().optional(),
    remarks: Joi.string().trim().optional(),
});

export {
    rankMasterListSchema as createRankMasterListSchema,
    updateRankMasterListSchema,
};
