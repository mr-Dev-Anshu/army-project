export interface AffectedIndividual {
    individualType: string;
    individualDetails: {
        armyNo?: string;
        rank?: string;
        name?: string;
        unit?: string;
        fmn?: string;
        [key: string]: any;
    };
    offenderDetails?: {
        [key: string]: any;
    };
    age: string;
    totalServiceDuration: string;
    unitLocation: string;
    individualWorkingStatus: "Leave" | "Duty" | "";
    _id?: string;
}

export interface ImmediateReportingIncident {
    _id: string;
    reportHeading?: string;
    vehicleType?: string;
    vehicleNumber?: string;
    vehicleName?: string;
    individuals: AffectedIndividual[];
    placeOfOccurrence?: string;
    dateOfOccurrence?: string;
    timeOfOccurrence?: string;
    description?: string;
    coordWith?: string;
    incidentCoveredBy?: string;
    relevantPhotos?: string[];
    age?: string;
    totalServiceDuration?: string;
    individualWorkingStatus?: "Leave" | "Duty" | "";
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
