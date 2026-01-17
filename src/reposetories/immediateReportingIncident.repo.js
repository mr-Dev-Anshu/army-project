import ImmediateReportingIncident from "@/models/immediateReportingIncident";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { IMMEDIATE_REPORTING_INCIDENT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/ImmediateReportingIncident";

export async function createImmediateReportingIncidentRepo(data) {
    const result = await new ImmediateReportingIncident(data).save();
    trackFieldSuggestions(data, IMMEDIATE_REPORTING_INCIDENT_SUGGESTION_CONFIG);
    return result;
}

export async function findAllImmediateReportingIncidentsRepo() {
    return await ImmediateReportingIncident.find({}).sort({ createdAt: -1 });
}

export async function findImmediateReportingIncidentByIdRepo(id) {
    return await ImmediateReportingIncident.findById(id);
}

export async function updateImmediateReportingIncidentByIdRepo(id, data) {
    const result = await ImmediateReportingIncident.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (result) {
        trackFieldSuggestions(data, IMMEDIATE_REPORTING_INCIDENT_SUGGESTION_CONFIG);
    }
    return result;
}

export async function deleteImmediateReportingIncidentByIdRepo(id) {
    return await ImmediateReportingIncident.findByIdAndDelete(id);
}
