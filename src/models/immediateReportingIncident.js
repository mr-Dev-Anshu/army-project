import mongoose from "mongoose";


const immediateReportingIncidentSchema = new mongoose.Schema({
    reportHeading: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    vehicleNumber: {
        type: String,
    },
    vehicleName: {
        type: String,
    },
    individuals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offender'
    }],
    placeOfOccurrence: {
        type: String,
    },
    dateOfOccurrence: {
        type: String,
    },
    timeOfOccurrence: {
        type: String,
    },
    description: {
        type: String,
    },
    coordWith: {
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