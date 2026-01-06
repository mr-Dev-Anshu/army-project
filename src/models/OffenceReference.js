import mongoose from "mongoose";

const offenceReferenceSchema = new mongoose.Schema(
  {
    offenceType: {
      type: String,
      lowercase: true,   
      trim: true,        
      required: true,    
    },
    reference: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OffenceReference =
  mongoose.models.OffenceReference ||
  mongoose.model("OffenceReference", offenceReferenceSchema);

export default OffenceReference;