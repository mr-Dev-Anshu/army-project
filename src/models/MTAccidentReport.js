import mongoose from "mongoose";

const mtAccidentReportSchema = new mongoose.Schema(
  {
    /* ===== ACCIDENT DATE & TIME ===== */
    accidentDateTime: { type: Date }, // ✅ Date & Time of Accident

    /* ===== PLACE ===== */
    placeOfAccident: { type: String }, // ✅ Place of Accident

    /* ===== VEHICLE ===== */
    vehicleBA: { type: String },       // ✅ Veh. BA No.
    vehicleMake: { type: String },     // ✅ Make & Take

    /* ===== DRIVER ===== */
    driverFMN: { type: String },       // ✅ FMN

    /* ===== OTHER EXISTING FIELDS ===== */
    station: String,
    vehicleType: String,

    driverName: String,
    driverRank: String,
    driverUnit: String,
    driverArmyNo: String,

    injuredCivil: { type: Number, default: 0 },
    injuredMilitary: { type: Number, default: 0 },
    diedCivil: { type: Number, default: 0 },
    diedMilitary: { type: Number, default: 0 },

    probableCause: String,
    firMactStatus: String,

    actionStatus: Boolean,
    actionStatusRemark: String,

    individualType: String,
    individualDetails: Object,

    coDriverType: String,
    coDriverDetails: Object,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const MTAccidentReport =
  mongoose.models.MTAccidentReport ||
  mongoose.model("MTAccidentReport", mtAccidentReportSchema);
