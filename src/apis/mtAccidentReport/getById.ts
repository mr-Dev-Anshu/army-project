import api from "@/config/axios";
import type { MTAccidentReport } from "./types";

export const getMTAccidentReportById = async (id: string): Promise<MTAccidentReport> => {
  const response = await api.get(`/api/mt-accident-reports/${id}`);
  return response.data;
};
