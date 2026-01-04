export const mtAccidentSchema = Joi.object({
  station: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  place: Joi.string().required(),

  vehicleNo: Joi.string().required(),
  vehicleType: Joi.string().optional(),
  vehicleMake: Joi.string().optional(),

  driverName: Joi.string().required(),
  driverRank: Joi.string().optional(),
  driverUnit: Joi.string().optional(),
  driverArmyNo: Joi.string().optional(),

  casualties: Joi.object({
    fatal: Joi.number().required(),
    nonFatal: Joi.number().required(),
  }).required(),

  brief: Joi.string().required(),

  actionStatus: Joi.boolean().required(),
  actionStatusRemark: Joi.string().optional(),
}).options({ allowUnknown: true });
