import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MTAccidentReportSchema = new Schema(
  {
    dateOfAccident: {
      type: Date,
      default: null,
    },
    timeOfAccident: {
      type: String, 
      required: false,
      trim: true,
    },
    placeOfAccident: {
      type: String,
      required: false,
      trim: true,
    },
    typeOfAccident: {
      type: String,
      enum: ["Normal", "Serious", "Fatal", "Very Serious"],
      required: false,
      trim: true,
    },
    probableCause: { 
      type: String,
      required: false,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      required: false,
      trim: true,
    },
    makeAndModel: {
      type: String,
      required: false,
      trim: true,
    },

    injuredCivil: {
      type: Number,
      default: 0,
      min: 0,
    },
    injuredMilitary: {
      type: Number,
      default: 0,
      min: 0,
    },
    diedCivil: {
      type: Number,
      default: 0,
      min: 0,
    },
    diedMilitary: {
      type: Number,
      default: 0,
      min: 0,
    },
    firMactNumber: {
      type: String,
      required: false,
      trim: true,
    },
    firDate: {
      type: Date,
      default: null,
    },
    firPoliceStation: {
      type: String,
      required: false,
      trim: true,
    },

    actionStatus: {
      type: Boolean,
      default:false
    },
    remark: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MTAccidentReport =
  mongoose.models.MTAccidentReport ||
  mongoose.model("MTAccidentReport", MTAccidentReportSchema);