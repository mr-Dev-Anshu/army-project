import Joi from "joi";

const immediateReportingIncidentSchema = Joi.object({
    reportHeading: Joi.string().trim().optional().allow(""),
    vehicleType: Joi.string().trim().optional().allow(""),
    vehicleNumber: Joi.string().trim().optional().allow(""),
    vehicleName: Joi.string().trim().optional().allow(""),
    individuals: Joi.array().items(
        Joi.object({
            individualType: Joi.string().valid(
                "militaryPersonnel", "employee", "civilian", "servantMaid",
                "shopKeeper", "tempHiredWorker"
            ).optional().allow(""),
            individualDetails: Joi.object().unknown(true).optional(),
            individualWorkingStatus: Joi.string().valid("Leave", "Duty").optional().allow(""),
            unitLocation: Joi.string().trim().optional().allow(""),
            age: Joi.string().trim().optional().allow(""),
            totalServiceDuration: Joi.string().trim().optional().allow(""),
            _id: Joi.string().optional().allow(""),
        })
    ).optional(),
    placeOfOccurrence: Joi.string().trim().optional().allow(""),
    dateOfOccurrence: Joi.string().trim().optional().allow(""),
    timeOfOccurrence: Joi.string().trim().optional().allow(""),
    description: Joi.string().trim().optional().allow(""),
    coordWith: Joi.string().trim().optional().allow(""),
    incidentCoveredBy: Joi.string().trim().optional().allow(""),
    relevantPhotos: Joi.array().items(Joi.string()).optional(),
});

export {
    immediateReportingIncidentSchema
};
