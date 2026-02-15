import Joi from "joi";

const immediateReportingIncidentSchema = Joi.object({
  reportHeading: Joi.string().trim().optional().allow(""),
  vehicleType: Joi.string().trim().optional().allow(""),
  vehicleNumber: Joi.string().trim().optional().allow(""),
  vehicleName: Joi.string().trim().optional().allow(""),
  individuals: Joi.array()
    .items(
      Joi.object({
        individualType: Joi.string()
          .valid(
            "militaryPersonnel",
            "employee",
            "civilian",
            "servantMaid",
            "shopKeeper",
            "tempHiredWorker",
          )
          .optional()
          .allow(""),

        individualDetails: Joi.object().unknown(true).optional(),

        militaryRelative: Joi.object().unknown(true).optional(),

        coDriver: Joi.object().unknown(true).optional(),

        passengers: Joi.array()
          .items(
            Joi.object({
              individualType: Joi.string().optional(),
              individualDetails: Joi.object().unknown(true).optional(),
              militaryRelative: Joi.object().unknown(true).optional(),
              hasMilitaryRelative: Joi.boolean().optional(),
            }).unknown(true),
          )
          .optional(),

        hasMilitaryRelative: Joi.boolean().optional(),
        coDriverAvailable: Joi.boolean().optional(),
        isVehicleInvolved: Joi.boolean().optional(),
        vehicleType: Joi.string().optional().allow(""),
        vehicleRegistration: Joi.string().optional().allow(""),

        age: Joi.string().optional().allow(""),
        totalServiceDuration: Joi.string().optional().allow(""),
        unitLocation: Joi.string().optional().allow(""),
        individualWorkingStatus: Joi.string()
          .valid("Leave", "Duty")
          .optional()
          .allow(""),
      }).unknown(true), // 🔥 VERY IMPORTANT
    )
    .optional(),

  placeOfOccurrence: Joi.string().trim().optional().allow(""),
  dateOfOccurrence: Joi.string().trim().optional().allow(""),
  timeOfOccurrence: Joi.string().trim().optional().allow(""),
  description: Joi.string().trim().optional().allow(""),
  coordWith: Joi.string().trim().optional().allow(""),
  incidentCoveredBy: Joi.string().trim().optional().allow(""),
  relevantPhotos: Joi.array().items(Joi.string()).optional(),
  age: Joi.string().trim().optional().allow(""),
  totalServiceDuration: Joi.string().trim().optional().allow(""),
  individualWorkingStatus: Joi.string()
    .valid("Leave", "Duty")
    .optional()
    .allow(""),
});

export { immediateReportingIncidentSchema };
