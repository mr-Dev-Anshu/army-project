import api from "@/config/axios";
import { CreateOffenderData, OffenderDetails } from "./types";

export const createOffender = async (
  data: CreateOffenderData
): Promise<OffenderDetails> => {
  const response = await api.post<OffenderDetails>("/api/offender", data);
  return response.data;
};
