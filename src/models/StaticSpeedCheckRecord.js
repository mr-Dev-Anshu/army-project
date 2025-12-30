import mongoose from "mongoose";
import {
  onDutyDetailsMPReporting,
  onDutyDetailsSchema,
} from "./GeneralTraficOffence";

const offenceOccurrenceSchema = mongoose.Schema({
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
});
const staticSpeedCheckRecordSchema = new mongoose.Schema(
  {
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
    offenceType: {
      type: String,
      default: "Over Speeding",
    },
  },
  {
    timestamps: true,
  }
);

staticSpeedCheckRecordSchema.index({ vehicleNumber: 1 });
staticSpeedCheckRecordSchema.index({ "offenceOccurenceDetails.time": -1 });

export const StaticSpeedCheckRecord =
  mongoose.models.StaticSpeedCheckRecord ||
  mongoose.model("StaticSpeedCheckRecord", staticSpeedCheckRecordSchema);
