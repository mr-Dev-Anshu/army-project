import mongoose from "mongoose";

const mtAccidentReportSchema = new mongoose.Schema(
    {
        station: { type: String },
        date: { type: Date },
        time: { type: String },
        place: { type: String },

        // Vehicle Details
        vehicleNo: { type: String },
        vehicleType: { type: String },
        vehicleMake: { type: String },

        // Driver Details
        driverName: { type: String },
        driverRank: { type: String },
        driverUnit: { type: String },
        driverArmyNo: { type: String },

        // Casualties
        casualties: {
            fatal: { type: Number, default: 0 },
            nonFatal: { type: Number, default: 0 }
        },

        // Occurrence Brief
        brief: { type: String },

        actionStatus: {
            type: Boolean,
            default: false,
        },
        actionStatusRemark: {
            type: String,
        },
    },
    {
        timestamps: true,
        strict: false
    }
);

export const MTAccidentReport =
    mongoose.models.MTAccidentReport ||
    mongoose.model("MTAccidentReport", mtAccidentReportSchema);
