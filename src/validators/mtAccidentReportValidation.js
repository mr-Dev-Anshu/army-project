import Joi from "joi";

const individualSchema = Joi.object({
    individualType: Joi.string()
        .valid(
            "militaryPersonnel",
            "employee",
            "civilian",
            "servantMaid",
            "shopKeeper",
            "tempHiredWorker"
        )
        .optional(),
    individualDetails: Joi.object().optional().unknown(true),
});

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
    individualDetails: individualSchema.optional(),
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
