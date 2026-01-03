// models/MaidServantSecurityPass.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FamilyMemberSchema = new Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  relationship: {
    type: String,
    required: false,
    trim: true,
  },
  age: {
    type: String,
    required: false,
    trim: true,
  },
});

const MaidServantSecurityPassSchema = new Schema(
  {
    qtrNumber: {
      type: String,
      required: false,
      trim: true,
    },
    ownerName: {
      type: String,
      required: false,
      trim: true,
    },
    ownerRank: {
      type: String,
      required: false,
      trim: true,
    },
    ownerUnit: {
      type: String,
      required: false,
      trim: true,
    },

    servantName: {
      type: String,
      required: false,
      trim: true,
    },
    servantMobile: {
      type: String,
      required: false,
      trim: true,
    },
    servantAadhar: {
      type: String,
      required: false,
      trim: true,
      minlength: 12,
      maxlength: 12,
    },

    permanentAddressLine: {
      type: String,
      required: false,
      trim: true,
    },
    permanentCityDistrict: {
      type: String,
      required: false,
      trim: true,
    },
    permanentState: {
      type: String,
      required: false,
      trim: true,
    },
    permanentPincode: {
      type: String,
      required: false,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },

    passNumber: {
      type: String,
      required: true,
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

    familyMembers: [FamilyMemberSchema],
  },
  {
    timestamps: true,
  }
);

export const MaidServantSecurityPass =
  mongoose.models.MaidServantSecurityPass ||
  mongoose.model("MaidServantSecurityPass", MaidServantSecurityPassSchema);