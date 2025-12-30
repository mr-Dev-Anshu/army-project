import api from "@/config/axios";
import type { GeneralTrafficOffence } from "./types";

export const getAllTrafficOffences = async (params?: any): Promise<GeneralTrafficOffence[]> => {
  const response = await api.get("/api/generalTraficOffence", { params });
  return response.data;
};