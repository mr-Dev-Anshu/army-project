import Joi from "joi";

const textDigitalEnum = ["text", "digital"];
const registerTypes = [
    'mobile_phone',
    'vehicle',
    'convoy',
    'key',
    'arms_amn',
    'recce',
    'duty_out',
    'duty_roster',
    'general_duty_diary',
    'army_help_line_complaints',
    'lost_and_found',
    'vehicle_demand',
    'contact_info_army',
    'contact_info_civil_police',
    'contact_info_mp_control_room',
];

const signatureSchema = Joi.object({
    type: Joi.string().valid(...textDigitalEnum).default("text"),
    value: Joi.string().trim().allow(""),
    by: Joi.string().trim().allow(""),
});

const authenticationSchema = Joi.object({
    initialsOfMPCRNCO: Joi.boolean().optional(),
    initialsOfSMSJCO: Joi.boolean().optional(),
    initialsOf2IC: Joi.boolean().optional(),
    initialsMPCPNCO: Joi.string().trim().allow("").optional(),
    initialsQMSJCO: Joi.string().trim().allow("").optional(),
    initials2IC: Joi.string().trim().allow("").optional(),
});

const dutySchema = Joi.object({
    dateOfDuty: Joi.date().optional(),
    place: Joi.string().allow("").optional(),
    location: Joi.string().allow("").optional(),
    typeOfDuty: Joi.string().allow("").optional(),
    natureOfDuty: Joi.string().allow("").optional(),
    from: Joi.string().allow("").optional(),
    to: Joi.string().allow("").optional(),
    fromTime: Joi.date().optional(),
    tillTime: Joi.date().optional(),
}).unknown(true);

const individualSchema = Joi.object({
    armyNo: Joi.string().required(),
    rank: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    unit: Joi.string().allow("").optional(),
    fmn: Joi.string().allow("").optional(),
    command: Joi.string().allow("").optional(),
}).unknown(true);

export const createRegisterSchema = Joi.object({
    type: Joi.string().valid(...registerTypes).required(),
    date: Joi.date().optional(),

    outTime: Joi.date().optional(),
    inTime: Joi.date().optional(),

    duty: dutySchema.optional(),

    // Details can contain specific fields for the register type
    // We explicitly check for nested individual if present for validation
    details: Joi.object({
        individual: individualSchema.optional(),
    }).unknown(true).optional(),

    outSignature: signatureSchema.allow(null).optional(),
    inSignature: signatureSchema.allow(null).optional(),

    authentication: authenticationSchema.optional(),

    remark: Joi.string().trim().allow("").optional(),

    status: Joi.string().valid('pending_out', 'out', 'returned', 'cancelled').optional(),
});

export const updateRegisterSchema = createRegisterSchema.fork(
    Object.keys(createRegisterSchema.describe().keys),
    (schema) => schema.optional()
);
