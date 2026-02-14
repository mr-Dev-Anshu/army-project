import mongoose from "mongoose";

import { auditFieldsPlugin } from "@/lib/mongoose-plugins/auditsFields";
import { individualSchema } from "./MTAccidentReport";

const immediateReportingIncidentSchema = new mongoose.Schema(
  {
    reportHeading: String,
    vehicleType: String,
    vehicleNumber: String,
    vehicleName: String,

    individuals: {
      type: [individualSchema],
      default: [],
    },

    placeOfOccurrence: String,
    dateOfOccurrence: String,
    timeOfOccurrence: String,
    description: String,
    coordWith: String,
    incidentCoveredBy: String,

    relevantPhotos: {
      type: [String],
      default: [],
    },

    age: String,
    totalServiceDuration: String,

    individualWorkingStatus: {
      type: String,
      enum: ["Leave", "Duty", ""],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);


immediateReportingIncidentSchema.plugin(auditFieldsPlugin, {});

// Force model recompilation if it exists to pick up schema changes
if (mongoose.models.ImmediateReportingIncident) {
    delete mongoose.models.ImmediateReportingIncident;
}

export default mongoose.model('ImmediateReportingIncident', immediateReportingIncidentSchema);