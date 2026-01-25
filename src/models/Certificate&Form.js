import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "certificate",
        "form",
        "letter",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

// export const certificateModel = mongoose.model("Certificate", certificateSchema);


const certificateModel =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default certificateModel;