import api from "@/config/axios";
import type { MTAccidentReport, MTAccidentReportFilters } from "./types";

export const getAllMTAccidentReports = async (filters?: MTAccidentReportFilters): Promise<MTAccidentReport[]> => {
    const response = await api.get("/api/mt-accident-report", { params: filters });
    return response.data;
};
