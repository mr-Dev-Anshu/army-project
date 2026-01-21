export interface AffectedIndividual {
    armyNo: string;
    rank: string;
    name: string;
    age: string;
    totalServiceDuration: string;
    unit: string;
    unitLocation: string;
    fmn: string;
    individualWorkingStatus: "Leave" | "Duty" | "";
}
export interface ImmediateReportingIncident {
    _id: string;
    individuals: AffectedIndividual[];
    incidentPlace?: string;
    incidentDate?: string;
    incidentTime?: string;
    incidentBrief?: string;
    coordinationWithPolice?: string;
    incidentCoveredBy?: string;
    relevantPhotos?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type CreateImmediateReportingIncidentData = Omit<
    ImmediateReportingIncident,
    "_id" | "createdAt" | "updatedAt"
>;

export type UpdateImmediateReportingIncidentData = Partial<CreateImmediateReportingIncidentData>;

export interface ImmediateReportingIncidentFilters {
    page?: number;
    limit?: number;
    search?: string;
}
