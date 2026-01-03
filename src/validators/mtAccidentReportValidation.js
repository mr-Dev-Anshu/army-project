import Joi from "joi";

export const createMTAccidentReportSchema = Joi.object({
    station: Joi.string().optional(),
    date: Joi.date().optional(),
    time: Joi.string().optional(),
    place: Joi.string().optional(),

    vehicleNo: Joi.string().optional(),
    vehicleType: Joi.string().optional(),
    vehicleMake: Joi.string().optional(),

    driverName: Joi.string().optional(),
    driverRank: Joi.string().optional(),
    driverUnit: Joi.string().optional(),
    driverArmyNo: Joi.string().optional(),

    casualties: Joi.object({
        fatal: Joi.number().optional(),
        nonFatal: Joi.number().optional()
    }).optional(),

    brief: Joi.string().optional(),

    actionStatus: Joi.boolean().optional(),
    actionStatusRemark: Joi.string().optional(),
}).unknown(true);
