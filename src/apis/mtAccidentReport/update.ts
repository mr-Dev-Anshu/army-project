import api from "@/config/axios";
import type { CreateMTAccidentReportData, MTAccidentReport } from "./types";

export const updateMTAccidentReport = async (id: string, data: Partial<CreateMTAccidentReportData>): Promise<MTAccidentReport> => {
    const response = await api.put(`/api/mt-accident-report/${id}`, data);
    return response.data;
};
