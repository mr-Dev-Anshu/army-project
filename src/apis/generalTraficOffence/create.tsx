import api from "@/config/axios";
import type { CreateTrafficOffenceData, GeneralTrafficOffence } from "./types";

export const createTrafficOffence = async (data: CreateTrafficOffenceData): Promise<GeneralTrafficOffence> => {
  const response = await api.post("/api/generalTraficOffence", data);
  return response.data;
};