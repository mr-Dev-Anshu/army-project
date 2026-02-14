import mongoose from "mongoose";

 export const individualSchema = new mongoose.Schema(
  {
    individualType: {
      type: String,
      enum: [
        "militaryPersonnel",
        "employee",
        "civilian",
        "servantMaid",
        "shopKeeper",
        "tempHiredWorker",
      ],
    },

    individualDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    militaryRelative: {
      type: mongoose.Schema.Types.Mixed,
    },

    coDriver: {
      type: mongoose.Schema.Types.Mixed,
    },

    hasMilitaryRelative: {
      type: Boolean,
      default: false,
    },

    coDriverAvailable: {
      type: Boolean,
      default: false,
    },

    isVehicleInvolved: {
      type: Boolean,
      default: false,
    },

    vehicleType: String,
    vehicleRegistration: String,

    passengers: {
      type: [
        new mongoose.Schema(
          {
            individualType: {
              type: String,
              enum: [
                "militaryPersonnel",
                "employee",
                "civilian",
                "servantMaid",
                "shopKeeper",
                "tempHiredWorker",
              ],
            },
            individualDetails: {
              type: mongoose.Schema.Types.Mixed,
              default: {},
            },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false, // ⭐⭐⭐ ADD THIS
  },
  { _id: false },
);

const accidentSchema = new mongoose.Schema(
  {
    accidentTime: String,
    accidentDate: Date,
    placeOfAccident: String,
    accidentType: {
      type: String,
      enum: ["normal", "serious", "fatal", "verySerious"],
    },
    causeOfAccident: String,
  },
  { _id: false },
);

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: String,
    vehicleModel: String,
  },
  { _id: false },
);

const casualtySchema = new mongoose.Schema(
  {
    injuredCivil: { type: Number, default: 0 },
    injuredMilitary: { type: Number, default: 0 },
    diedCivil: { type: Number, default: 0 },
    diedMilitary: { type: Number, default: 0 },
  },
  { _id: false },
);
const firMactSchema = new mongoose.Schema(
  {
    firMactNumber: String,
    firDate: Date,
    firPoliceStation: String,
  },
  { _id: false },
);
const authenticationSchema = new mongoose.Schema(
  {
    initialsOfMPCRNCO: { type: Boolean, default: false },
    initialsOfSMSJCO: { type: Boolean, default: false },
    initialsOf2IC: { type: Boolean, default: false },
    initialsMPCPNCO: String,
    initialsQMSJCO: String,
    initials2IC: String,
  },
  { _id: false },
);

const mtAccidentReportSchema = new mongoose.Schema(
  {
    individuals: {
      type: [individualSchema],
      default: [],
    },

    accidentDetails: {
      type: accidentSchema,
      default: {},
    },

    vehicleDetails: { type: vehicleSchema, default: {} },

    casualtyDetails: { type: casualtySchema, default: {} },

    firMactDetails: { type: firMactSchema, default: {} },

    actionStatus: {
      type: String,
      enum: ["pending", "taken"],
      default: "pending",
    },

    actionStatusRemark: String,
    damageToVehicle: String,
    authentication: { type: authenticationSchema },

    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true ,
    strict:false
  },
);

export const MTAccidentReport =
  mongoose.models.MTAccidentReport ||
  mongoose.model("MTAccidentReport", mtAccidentReportSchema);
