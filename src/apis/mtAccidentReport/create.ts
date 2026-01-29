import api from "@/config/axios";
import type { CreateMTAccidentReportData, MTAccidentReport } from "./types";

export const createMTAccidentReport = async (data: CreateMTAccidentReportData): Promise<MTAccidentReport> => {
    const response = await api.post("/api/mt-accident-report", data);
    return response.data;
};
