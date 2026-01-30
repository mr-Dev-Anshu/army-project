// models/ShopkeeperSecurityPass.js
import mongoose from "mongoose";
import { auditFieldsPlugin } from "@/lib/mongoose-plugins/auditsFields";
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  aadhar: {
    type: String,
    required: false,
    trim: true,
    minlength: 12,
    maxlength: 12,
  },
  type: {
    type: String,
    required: false,
    trim: true,
  },
});

const ShopkeeperSecurityPassSchema = new Schema(
  {
    shopName: {
      type: String,
      required: false,
      trim: true,
    },
    shopAddress: {
      type: String,
      required: false,
      trim: true,
    },
    unit: {
      type: String,
      required: false,
      trim: true,
    },

    ownerName: {
      type: String,
      required: false,
      trim: true,
    },
    ownerMobile: {
      type: String,
      required: false,
      trim: true,
    },
    ownerAadhar: {
      type: String,
      required: false,
      trim: true,
      minlength: 12,
      maxlength: 12,
    },

    priceListApproved: {
      type: Boolean,
      default: false,
    },
    priceListEffectiveFrom: {
      type: Date,
      default: null,
    },
    priceListExpiredOn: {
      type: Date,
      default: null,
    },

    passNumber: {
      type: String,
      required: false,
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

    workers: [WorkerSchema],
  },
  {
    timestamps: true,
  }
);

ShopkeeperSecurityPassSchema.plugin(auditFieldsPlugin, {});

export const ShopkeeperSecurityPass =
  mongoose.models.ShopkeeperSecurityPass ||
  mongoose.model("ShopkeeperSecurityPass", ShopkeeperSecurityPassSchema);