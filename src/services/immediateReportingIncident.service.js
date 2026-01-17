import {
    createImmediateReportingIncidentRepo,
    findAllImmediateReportingIncidentsRepo,
    findImmediateReportingIncidentByIdRepo,
    updateImmediateReportingIncidentByIdRepo,
    deleteImmediateReportingIncidentByIdRepo,
} from "@/reposetories/immediateReportingIncident.repo";
import { saveOrUpdateArmyPersonnel } from "@/services/individual.service";

export async function createImmediateReportingIncident(data) {
    // Automatically capture/update personnel details
    if (data.individuals && Array.isArray(data.individuals)) {
        await saveOrUpdateArmyPersonnel(data.individuals);
    }
    return await createImmediateReportingIncidentRepo(data);
}

export async function getAllImmediateReportingIncidents() {
    return await findAllImmediateReportingIncidentsRepo();
}

export async function getImmediateReportingIncidentById(id) {
    return await findImmediateReportingIncidentByIdRepo(id);
}

export async function updateImmediateReportingIncident(id, data) {
    // Automatically capture/update personnel details
    if (data.individuals && Array.isArray(data.individuals)) {
        await saveOrUpdateArmyPersonnel(data.individuals);
    }
    return await updateImmediateReportingIncidentByIdRepo(id, data);
}

export async function deleteImmediateReportingIncident(id) {
    return await deleteImmediateReportingIncidentByIdRepo(id);
}
