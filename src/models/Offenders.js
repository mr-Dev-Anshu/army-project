
import mongoose from "mongoose";
import { auditFieldsPlugin } from "@/lib/mongoose-plugins/auditsFields";

const offenderSchema = new mongoose.Schema(
  {
    offenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneralTrafficOffence",
      required: false,
    },
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ImmediateReportingIncident",
      required: false,
    },
    // Supporting both field names for compatibility
    offenderType: {
      type: String,
      enum: [
        "Military Person",
        "Employee",
        "Civilian",
        "Servant/Maid",
        "Shop Keeper",
        "Temporary Hired Worker",
        // Adding my camelCase values
        'militaryPersonnel', 'civilian', 'employee', 'servantMaid', 'shopKeeper', 'tempHiredWorker'
      ],
      required: true,
    },
    category: {
      type: String,
      default: "Offender",
    },

    offenderDetails: {
      type: mongoose.Schema.Types.Mixed, // Stores armyNo, rank, name, unit, fmn, etc.
      default: {},
    },

    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "offenders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

offenderSchema.plugin(auditFieldsPlugin, {});

offenderSchema.index({ offenceId: 1 });

export const Offender = mongoose.models.Offender || mongoose.model("Offender", offenderSchema);
export default Offender;
