import mongoose from "mongoose";

const FieldSuggestionSchema = new mongoose.Schema(
  {
    fieldType: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const FieldSuggestion =
  mongoose.models.FieldSuggestion ||
  mongoose.model("FieldSuggestion", FieldSuggestionSchema);
