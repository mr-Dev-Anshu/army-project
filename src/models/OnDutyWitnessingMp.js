import mongoose from "mongoose";

const onDutyWitnessingMpSchema = new mongoose.Schema({  // schema naam consistent rakha
  offenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralTrafficOffence",  // optional: populate ke liye achha
    required: true,
  },
  rank: {
    type: String,
    required: true,  // required mark kiya consistency ke liye
    trim: true,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  ArmyNo: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },

  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
},
{
  timestamps: true,
});

onDutyWitnessingMpSchema.index({ offenceId: 1 });

export const OnDutyWitnessingMp =
  mongoose.models.OnDutyWitnessingMp ||
  mongoose.model("OnDutyWitnessingMp", onDutyWitnessingMpSchema);