import {
    createImmediateReportingIncidentRepo,
    findAllImmediateReportingIncidentsRepo,
    findImmediateReportingIncidentByIdRepo,
    updateImmediateReportingIncidentByIdRepo,
    deleteImmediateReportingIncidentByIdRepo,
} from "@/reposetories/immediateReportingIncident.repo";
import Offender from "@/models/Offenders";

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

    const existing = await findImmediateReportingIncidentByIdRepo(id);
    if (!existing) return null;

    if (Array.isArray(data.individuals)) {

        const mergedIndividuals = data.individuals.map((newInd, index) => {

            const oldInd = existing.individuals?.[index]?.toObject?.() || {};

            return {
                ...oldInd,
                ...newInd,

                individualDetails: {
                    ...(oldInd.individualDetails || {}),
                    ...(newInd.individualDetails || {})
                },

                coDriver: {
                    ...(oldInd.coDriver || {}),
                    ...(newInd.coDriver || {})
                },

                militaryRelative: {
                    ...(oldInd.militaryRelative || {}),
                    ...(newInd.militaryRelative || {})
                },

                passengers: Array.isArray(newInd.passengers)
                    ? newInd.passengers
                    : oldInd.passengers || []
            };
        });

        data.individuals = mergedIndividuals;
    }

    return await updateImmediateReportingIncidentByIdRepo(id, {
        $set: data
    });
}

export async function deleteImmediateReportingIncident(id) {
    return await deleteImmediateReportingIncidentByIdRepo(id);
}
