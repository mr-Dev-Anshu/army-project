import api from "@/config/axios";
import type { UpdateTrafficOffenceData, GeneralTrafficOffence } from "./types";

export const updateTrafficOffence = async (id: string, data: UpdateTrafficOffenceData): Promise<GeneralTrafficOffence> => {
  const response = await api.put(`/api/generalTraficOffence/${id}`, data);
  return response.data;
};