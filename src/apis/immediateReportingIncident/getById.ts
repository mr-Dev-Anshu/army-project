import api from "@/config/axios";
import type { ImmediateReportingIncident } from "./types";

export const getImmediateReportingIncidentById = async (id: string): Promise<ImmediateReportingIncident> => {
    const response = await api.get(`/api/immediate-reporting-incident/${id}`);
    return response.data;
};
