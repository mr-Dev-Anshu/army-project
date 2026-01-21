import Joi from "joi";

const immediateReportingIncidentSchema = Joi.object({
    individuals: Joi.array().items(
        Joi.object({
            armyNo: Joi.string().trim().optional().allow(""),
            name: Joi.string().trim().optional().allow(""),
            rank: Joi.string().trim().optional().allow(""),
            age: Joi.string().trim().optional().allow(""),
            totalServiceDuration: Joi.string().trim().optional().allow(""),
            unit: Joi.string().trim().optional().allow(""),
            unitLocation: Joi.string().trim().optional().allow(""),
            fmn: Joi.string().trim().optional().allow(""),
            individualWorkingStatus: Joi.string().valid("Leave", "Duty").optional().allow(""),
            _id: Joi.string().optional().allow(""), // Allow _id if it comes from frontend
        })
    ).optional(),
    incidentPlace: Joi.string().trim().optional().allow(""),
    incidentDate: Joi.string().trim().optional().allow(""),
    incidentTime: Joi.string().trim().optional().allow(""),
    incidentBrief: Joi.string().trim().optional().allow(""),
    coordinationWithPolice: Joi.string().trim().optional().allow(""),
    incidentCoveredBy: Joi.string().trim().optional().allow(""),
    relevantPhotos: Joi.array().items(Joi.string()).optional(),
});

export {
    immediateReportingIncidentSchema
};
