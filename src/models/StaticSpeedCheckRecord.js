import mongoose from "mongoose";
import {
  onDutyDetailsMPReporting,
  onDutyDetailsSchema,
} from "./GeneralTraficOffence";

const offenceOccurrenceSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  incidentLocation: {
    type: String,
  },
  actualSpeedNoted: {
    type: String,
  },
  authSpeed: {
    type: String,
  },
  overSpeedCalculated: {
    type: String,
  },

  description: {
    type: String,
  },
  offenceTypes: [{ type: String }],
  offenceTypeReference: [{ type: String }],
});
const staticSpeedCheckRecordSchema = new mongoose.Schema(
  {
    reportId: {
      type: String
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleCategory: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    vehicleName: {
      type: String,
    },
    onDutyDetails: onDutyDetailsSchema,
    onDutyDetailsMPReporting: onDutyDetailsMPReporting,
    offenceOccurenceDetails: offenceOccurrenceSchema,
    offenders: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    remark: {
      type: String,
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actionStatus: {
      type: Boolean,
      default: false,
    },

    actionStatusRemark: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "staticspeedcheckrecords",
  }

);

staticSpeedCheckRecordSchema.index({ vehicleNumber: 1 });
staticSpeedCheckRecordSchema.index({ "offenceOccurenceDetails.time": -1 });

if (mongoose.models.StaticSpeedCheckRecord) {
  delete mongoose.models.StaticSpeedCheckRecord;
}

export const StaticSpeedCheckRecord = mongoose.model(
  "StaticSpeedCheckRecord",
  staticSpeedCheckRecordSchema
);
