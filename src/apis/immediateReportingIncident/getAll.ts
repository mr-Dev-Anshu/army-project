import api from "@/config/axios";
import type { ImmediateReportingIncident, ImmediateReportingIncidentFilters } from "./types";

export const getAllImmediateReportingIncidents = async (filters?: ImmediateReportingIncidentFilters): Promise<ImmediateReportingIncident[]> => {
    const response = await api.get("/api/immediate-reporting-incident", { params: filters });
    return response.data;
};
