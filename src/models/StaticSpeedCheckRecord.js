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
const staticSpeedCheckRecordSchema = mongoose.Schema({
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
  onDutyDetails: onDutyDetailsSchema,
  onDutyDetailsMPReporting: onDutyDetailsMPReporting,
  offenceOccurenceDetails: offenceOccurrenceSchema,
  remark: {
    type: String,
  },
});

export const StaticSpeedCheckRecord =
  mongoose.models.StaticSpeedCheckRecord ||
  mongoose.model("StaticSpeedCheckRecord", staticSpeedCheckRecordSchema);