import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AnalysisRemarkSchema = new Schema(
  {
    offenceType: {
      type: String,
      required: false,  
      trim: true,
    },
    remark: {
      type: String,
      required: false,
      trim: true,
    },
    monthYear: {
      type: Date,
      required: false,  
    },
  },
  {
    timestamps: true, 
  }
);

export const AnalysisRemark =
  mongoose.models.MonthlyOffenceReport ||
  mongoose.model("AnalysisRemark", AnalysisRemarkSchema);