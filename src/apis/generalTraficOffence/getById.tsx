import api from "@/config/axios";
import type { GeneralTrafficOffence } from "./types";

export const getTrafficOffenceById = async (id: string): Promise<GeneralTrafficOffence> => {
  const response = await api.get(`/api/generalTraficOffence/${id}`);
  return response.data;
};