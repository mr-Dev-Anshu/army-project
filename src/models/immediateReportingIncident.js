import mongoose from "mongoose";

const immediateReportingIncidentSchema = new mongoose.Schema({
    armyNo: {
        type: String,

    },
    name: {
        type: String,

    },
    rank: {
        type: String,
    },
    age: {
        type: String,
    },
    totalServiceDuration: {
        type: String,
    },
    unit: {
        type: String,
    },
    unitLocation: {
        type: String,
    },
    fmn: {
        type: String,
    },
    individualWorkingStatus: {
        type: String,
        enum: ["Leave", "Duty"]
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




})
export default mongoose.models.ImmediateReportingIncident ||
    mongoose.model('ImmediateReportingIncident', immediateReportingIncidentSchema);