// models/TemporaryHiredWorker.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubWorkerSchema = new Schema({
  name: {
    type: String,
    required:false,
    trim: true,
  },
  mobile: {
    type: String,
    required:false,
    trim: true,
  },
  aadhar: {
    type: String,
    required:false,
    trim: true,
    minlength: 12,
    maxlength: 12,
  },
});
const TemporaryHiredWorkerSchema = new Schema(
  {
    workerName: {
      type: String,
      required:true,
      trim: true,
    },
    workerMobile: {
      type: String,
      required:false,
      trim: true,
    },
    workerAadhar: {
      type: String,
      required:false,
      trim: true,
      minlength: 12,
      maxlength: 12,
    },

    permanentAddressLine: {
      type: String,
      required:false,
      trim: true,
    },
    permanentCityDistrict: {
      type: String,
      required:false,
      trim: true,
    },
    permanentState: {
      type: String,
      required:false,
      trim: true,
    },
    permanentPincode: {
      type: String,
      required:false,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },

    placeOfStay: {
      type: String,
      required:false,
      trim: true,
    },
    placeOfDuty: {
      type: String,
      required:false,
      trim: true,
    },

    passNumber: {
      type: String,
      required:true,
      trim: true,
    },

    validFrom: {
      type: Date,
      default: null,
    },
    validTill: {
      type: Date,
      default: null,
    },

    subWorkers: [SubWorkerSchema],
  },
  {
    timestamps: true,
  }
);

// Export the model
export const TemporaryHiredWorker =
  mongoose.models.TemporaryHiredWorker ||
  mongoose.model("TemporaryHiredWorker", TemporaryHiredWorkerSchema);
