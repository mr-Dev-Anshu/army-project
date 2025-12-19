import mongoose from "mongoose";

const onDutyWitnessingMp = mongoose.Schema({
  offenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rank: {
    type: String,
  },
  unit: {
    type: String,
  },
  ArmyNo: {
    type: String,
  },
});

export const OnDutyWitnessingMp =
  mongoose.model.OnDutyWitnessingMp ||
  mongoose.model("OnDutyWitnessingMp", onDutyWitnessingMp);
