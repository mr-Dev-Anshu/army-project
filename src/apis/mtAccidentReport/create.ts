import api from "@/config/axios";
import type { CreateMTAccidentReportData, MTAccidentReport } from "./types";

export const createMTAccidentReport = async (data: CreateMTAccidentReportData): Promise<MTAccidentReport> => {
  try {
    const response = await api.post("/api/mt-accident-reports", data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 CREATE ERROR DETAILS:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};

