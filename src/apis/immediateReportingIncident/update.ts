import api from "@/config/axios";
import type { UpdateImmediateReportingIncidentData, ImmediateReportingIncident } from "./types";

export const updateImmediateReportingIncident = async (id: string, data: UpdateImmediateReportingIncidentData): Promise<ImmediateReportingIncident> => {
    const response = await api.put(`/api/immediate-reporting-incident/${id}`, data);
    return response.data;
};
