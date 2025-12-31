import api from "@/config/axios";
import type { UpdateMTAccidentReportData, MTAccidentReport } from "./types";

export const updateMTAccidentReport = async (id: string, data: UpdateMTAccidentReportData): Promise<MTAccidentReport> => {
  const response = await api.patch(`/api/mt-accident-reports/${id}`, data);
  return response.data;
};
