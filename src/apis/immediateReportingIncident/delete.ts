import api from "@/config/axios";
import type { ImmediateReportingIncident } from "./types";

export const deleteImmediateReportingIncident = async (id: string): Promise<ImmediateReportingIncident> => {
    const response = await api.delete(`/api/immediate-reporting-incident/${id}`);
    return response.data;
};
