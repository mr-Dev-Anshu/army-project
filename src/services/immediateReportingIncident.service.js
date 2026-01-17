import {
    createImmediateReportingIncidentRepo,
    findAllImmediateReportingIncidentsRepo,
    findImmediateReportingIncidentByIdRepo,
    updateImmediateReportingIncidentByIdRepo,
    deleteImmediateReportingIncidentByIdRepo,
} from "@/reposetories/immediateReportingIncident.repo";

export async function createImmediateReportingIncident(data) {
    return await createImmediateReportingIncidentRepo(data);
}

export async function getAllImmediateReportingIncidents() {
    return await findAllImmediateReportingIncidentsRepo();
}

export async function getImmediateReportingIncidentById(id) {
    return await findImmediateReportingIncidentByIdRepo(id);
}

export async function updateImmediateReportingIncident(id, data) {
    return await updateImmediateReportingIncidentByIdRepo(id, data);
}

export async function deleteImmediateReportingIncident(id) {
    return await deleteImmediateReportingIncidentByIdRepo(id);
}
