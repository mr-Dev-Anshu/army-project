import mongoose from "mongoose";

const individualSchema = new mongoose.Schema({
    armyNo: { type: String },
    name: { type: String },
    rank: { type: String },
    age: { type: String },
    totalServiceDuration: { type: String },
    unit: { type: String },
    unitLocation: { type: String },
    fmn: { type: String },
    individualWorkingStatus: {
        type: String,
        enum: ["Leave", "Duty", ""]
    }
});

const immediateReportingIncidentSchema = new mongoose.Schema({
    individuals: {
        type: [individualSchema],
        default: []
    },
    incidentPlace: {
        type: String,
    },
    incidentDate: {
        type: String,
    },
    incidentTime: {
        type: String,
    },
    incidentBrief: {
        type: String,
    },
    coordinationWithPolice: {
        type: String,
    },
    incidentCoveredBy: {
        type: String,
    },
    relevantPhotos: {
        type: [String],
        default: []
    },

}, { timestamps: true });

// Force model recompilation if it exists to pick up schema changes
if (mongoose.models.ImmediateReportingIncident) {
    delete mongoose.models.ImmediateReportingIncident;
}

export default mongoose.model('ImmediateReportingIncident', immediateReportingIncidentSchema);