import mongoose from "mongoose";
import { auditFieldsPlugin } from "@/lib/mongoose-plugins/auditsFields.js";
import {
  onDutyDetailsMPReporting,
  onDutyDetailsSchema,
} from "./GeneralTraficOffence";

const { Schema } = mongoose;


const offenceOccurrenceSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: false,
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
  briefDescription: {
    type: String,
  },
  offenceTypes: [{ type: String }],
  offenceTypeReference: [{ type: String }],
});

export const documentSchema = new Schema({
  statement: { type: String },
  url: { type: String },
  type:{type:String},
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});
const staticSpeedCheckRecordSchema = new mongoose.Schema(
  {
    reportId: {
      type: String
    },
    vehicleType: {
      type: String,
      required: false,
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
        certificates: [documentSchema],
    

  },
  {
    timestamps: true,
    collection: "staticspeedcheckrecords",
  }
);

// Attach common audit fields plugin (createdBy, updatedBy, etc.)
staticSpeedCheckRecordSchema.plugin(auditFieldsPlugin, {});

staticSpeedCheckRecordSchema.index({ vehicleNumber: 1 });
staticSpeedCheckRecordSchema.index({ "offenceOccurenceDetails.time": -1 });

if (mongoose.models.StaticSpeedCheckRecord) {
  delete mongoose.models.StaticSpeedCheckRecord;
}

export const StaticSpeedCheckRecord = mongoose.model(
  "StaticSpeedCheckRecord",
  staticSpeedCheckRecordSchema
);
