import mongoose from "mongoose";

const offenderSchema = new mongoose.Schema(
  {
    offenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneralTrafficOffence", 
      required: true,
    },
    offenderType: {
      type: String,
      enum: [
        "Military Person",
        "Employee",
        "Civilian",
        "Servant/Maid",
        "Shop Keeper",
        "Temporary Hired Worker",
      ],
      required: true,
    },

    offenderDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

offenderSchema.index({ offenceId: 1 });

export const Offender =
  mongoose.models.Offender || mongoose.model("Offender", offenderSchema);