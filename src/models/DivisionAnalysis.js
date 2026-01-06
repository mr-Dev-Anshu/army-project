import mongoose, { Schema, models, model } from "mongoose";

const divisionAnalysisSchema = new Schema(
  {
    monthYear: {
      type: Date,
    },

    offence: {
      type: String,
      trim: true,
    },

    actionTaken: {
      type: Number,
      min: 0,
      default: 0,
    },

    actionPending: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalNumberOfCases: {
      type: Number,
      min: 0,
    },

    remark: {
      type: String,
      trim: true,
    },

    divisionName: {
      type: String,
      trim: true,
    },

    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false, 
  }
);

export const DivisionAnalysis =
  models.DivisionAnalysis || model("DivisionAnalysis", divisionAnalysisSchema);
