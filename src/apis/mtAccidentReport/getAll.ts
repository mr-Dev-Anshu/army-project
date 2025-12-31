import api from "@/config/axios";
import type { MTAccidentReport } from "./types";

export const getAllMTAccidentReports = async (params?: any): Promise<MTAccidentReport[]> => {
  const response = await api.get("/api/mt-accident-reports", { params });
  return response.data;
};
