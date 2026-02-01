import {
    createImmediateReportingIncidentRepo,
    findAllImmediateReportingIncidentsRepo,
    findImmediateReportingIncidentByIdRepo,
    updateImmediateReportingIncidentByIdRepo,
    deleteImmediateReportingIncidentByIdRepo,
} from "@/reposetories/immediateReportingIncident.repo";
import Offender from "@/models/Offenders";

export async function createImmediateReportingIncident(data) {
    const { individuals, ...incidentData } = data;

    // 1. Create Incident first to get an ID (or create after, but we need ID for backref)
    // Actually, let's create Offenders first, then Incident, then update Offenders with Incident ID

    const offenderIds = [];

    if (individuals && Array.isArray(individuals)) {
        for (const ind of individuals) {
            // Map incoming individual structure to Offender model
            const offenderPayload = {
                offenderType: ind.individualType || 'militaryPersonnel', // Default fallback
                offenderDetails: ind.individualDetails || {},
                individualWorkingStatus: ind.individualWorkingStatus,
                unitLocation: ind.unitLocation,
                age: ind.age,
                totalServiceDuration: ind.totalServiceDuration,
                // incidentId: will be set after incident creation
            };

            const newOffender = await new Offender(offenderPayload).save();
            offenderIds.push(newOffender._id);
        }
    }

    const payload = {
        ...incidentData,
        individuals: offenderIds
    };

    const newIncident = await createImmediateReportingIncidentRepo(payload);

    // Update offenders with the incident ID
    if (offenderIds.length > 0) {
        await Offender.updateMany(
            { _id: { $in: offenderIds } },
            { $set: { incidentId: newIncident._id } }
        );
    }

    return newIncident;
}

export async function getAllImmediateReportingIncidents() {
    return await findAllImmediateReportingIncidentsRepo();
}

export async function getImmediateReportingIncidentById(id) {
    return await findImmediateReportingIncidentByIdRepo(id);
}

export async function updateImmediateReportingIncident(id, data) {
    const { individuals, ...incidentData } = data;

    // If individuals are provided, we need to handle them
    let offenderIds = [];

    if (individuals && Array.isArray(individuals)) {
        // We need to fetch the existing incident to know which offenders to keep/remove?
        // For simplicity, we can upsert.

        for (const ind of individuals) {
            const offenderPayload = {
                offenderType: ind.individualType || 'militaryPersonnel',
                offenderDetails: ind.individualDetails || {},
                individualWorkingStatus: ind.individualWorkingStatus,
                unitLocation: ind.unitLocation,
                age: ind.age,
                totalServiceDuration: ind.totalServiceDuration,
                incidentId: id
            };

            if (ind._id) {
                // Update existing
                await Offender.findByIdAndUpdate(ind._id, offenderPayload);
                offenderIds.push(ind._id);
            } else {
                // Create new
                const newOffender = await new Offender(offenderPayload).save();
                offenderIds.push(newOffender._id);
            }
        }
    }

    // Merge offenderIds into payload if individuals were processed
    // If individuals field wasn't touched in frontend, we might not want to overwrite it.
    // However, usually forms send the whole array.
    const payload = { ...incidentData };
    if (individuals) {
        payload.individuals = offenderIds;
    }

    return await updateImmediateReportingIncidentByIdRepo(id, payload);
}

export async function deleteImmediateReportingIncident(id) {
    return await deleteImmediateReportingIncidentByIdRepo(id);
}
