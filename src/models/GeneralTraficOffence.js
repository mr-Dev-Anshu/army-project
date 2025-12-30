import mongoose from "mongoose";

export const onDutyDetailsSchema = new mongoose.Schema({
  dateOfDuty: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  dutyLocation: { type: String },
  dutyType: { type: String },

  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export const onDutyDetailsMPReporting = new mongoose.Schema({
  nameReportingMP: { type: String },
  rank: { type: String },
  unit: { type: String },
  armyNumber: { type: String },

  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export const offenceOccurenceDetails = new mongoose.Schema({
  timeOfOffence: { type: Date },
  incidentLocation: { type: String },
  description: { type: String },

  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const generalTrafficOffenceSchema = new mongoose.Schema(
  {
    isVehicleInvolved: {
      type: Boolean,
      required: true,
    },
    vehicleCategory: {
      type: String,
      enum: ["2-Wheeler", "4-Wheeler"],
    },
    vehicleType: {
      type: String,
      enum: ["Civilian Vehicle", "DD Vehicle"],
    },
    vehicleNumber: { type: String },
    vehicleName: {
      type: String
    },
    onDutyDetails: onDutyDetailsSchema,
    onDutyDetailsMPReporting: onDutyDetailsMPReporting,
    offenceOccurenceDetails: offenceOccurenceDetails,

    offenceTypes: [{ type: String }],
    offenceTypeReference: [{ type: String }],
    actionStatus: {
      type: Boolean,
      default: false,
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false

  }
);



export const GeneralTrafficOffence =
  mongoose.models.GeneralTrafficOffence ||
  mongoose.model("GeneralTrafficOffence", generalTrafficOffenceSchema);