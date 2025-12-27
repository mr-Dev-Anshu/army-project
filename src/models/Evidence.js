import mongoose from "mongoose";
const { Schema } = mongoose;
export const evidenceSchema = new Schema({
  type: { type: String },
  reportId: Schema.Types.ObjectId,
  url: { type: String },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  customFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const Evidence =
  mongoose.models.Evidence || mongoose.model("Evidence", evidenceSchema);
