import mongoose from "mongoose";

const { Schema } = mongoose;

export const reportDetailsSchema = new Schema({
  reportNumber: { type: String },
  command: { type: String },
  firNumber: { type: String },
  firFileUrl: { type: String },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const investigationHeadSchema = new Schema({
  armyNumber: { type: String },
  rank: { type: String },
  name: { type: String },
  unit: { type: String },
  fmn: { type: String },
  command: { type: String },
  address: { type: String },
  iCardNumber: { type: String },

  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const occurrenceDetailsSchema = new Schema({
  offenceType: { type: String },
  placeOfOccurrence: { type: String },
  dateOfOccurrence: { type: Date },
  timeOfOccurrence: { type: Date },
  description: { type: String },
  offenceTypes: [{ type: String }],
  offenceTypeReference: [{ type: String }],

  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const individualSchema = new Schema({
  armyNo: { type: String },
  rank: { type: String },
  name: { type: String },
  unit: { type: String },
  fmn: { type: String },
  address: { type: String },
  iCardNumber: { type: String },
  remark: { type: String },
  role: { type: String }, // Victim, Offender, etc.

  // Keep existing generic fields just in case
  isVehicleInvolved: { type: Boolean, default: false },
  vehicleCategory: { type: String },
  typeOfVehicle: { type: String },
  vehicleNumber: { type: String },
  vehicleName: { type: String },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const witnessSchema = new Schema({
  armyNo: { type: String },
  rank: { type: String },
  name: { type: String },
  unit: { type: String },
  fmn: { type: String },
  address: { type: String },
  iCardNumber: { type: String },
  remark: { type: String },

  // Keep existing generic fields just in case
  isVehicleInvolved: { type: Boolean, default: false },
  vehicleCategory: { type: String },
  typeOfVehicle: { type: String },
  vehicleNumber: { type: String },
  vehicleName: { type: String },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const documentSchema = new Schema({
  statement: { type: String },
  url: { type: String },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const evidenceSchema = new Schema({
  type: { type: String },
  url: { type: String },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});


const mpReportSchema = new Schema(
  {
    reportId: {
      type: String
    },
    reportDetails: { type: reportDetailsSchema },
    investigationHead: { type: investigationHeadSchema },
    occurrenceDetails: { type: occurrenceDetailsSchema },

    individuals: [individualSchema],
    witnesses: [witnessSchema],

    documents: [documentSchema],
    detailedOccurrenceReport: { type: String },
    pointsFindOutDuringInvestigation: { type: String },
    opinion: { type: String },
    actionStatus: {
      type: Boolean,
      default: false,
    },
    actionStatusRemark: {
      type: String,
    },
    remarks: {
      analysis: { type: String },
      recommendation: { type: String },
      customFields: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },

    evidences: [evidenceSchema],
    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

mpReportSchema.virtual("offenders").get(function () {
  return this.individuals ? this.individuals.filter((ind) => ind.role === "Offender") : [];
});

mpReportSchema.index({ "reportDetails.reportNumber": 1 }, { unique: true });
mpReportSchema.index({ "investigationHead.armyNumber": 1 });
mpReportSchema.index({ "occurrenceDetails.offenceType": 1 });
mpReportSchema.index({ "occurrenceDetails.placeOfOccurrence": 1 });
mpReportSchema.index({ "occurrenceDetails.dateOfOccurrence": -1 });

if (mongoose.models.MPReport) {
  delete mongoose.models.MPReport;
}

export const MPReport = mongoose.model("MPReport", mpReportSchema);
