import api from "@/config/axios";
import type { CreateImmediateReportingIncidentData, ImmediateReportingIncident } from "./types";

export const createImmediateReportingIncident = async (data: CreateImmediateReportingIncidentData): Promise<ImmediateReportingIncident> => {
    const response = await api.post("/api/immediate-reporting-incident", data);
    return response.data;
};
