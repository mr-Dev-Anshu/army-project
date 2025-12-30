import api from "@/config/axios";
import { CreateOffenderData, OffenderDetails } from "./types";

export const updateOffender = async (
  id: string,
  data: Partial<CreateOffenderData>
): Promise<OffenderDetails> => {
  const res = await api.put(`/api/offender/${id}`, data);
  return res.data;
};