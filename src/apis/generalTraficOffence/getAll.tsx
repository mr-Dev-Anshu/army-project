import api from "@/config/axios";
import type { GeneralTrafficOffence } from "./types";

export const getAllTrafficOffences = async (): Promise<GeneralTrafficOffence[]> => {
  const response = await api.get("/api/generalTraficOffence");
  return response.data;
};