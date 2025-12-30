import api from "@/config/axios";
import { OffenderDetails } from "./types";

export const getOffenderById = async (
  id: string
): Promise<OffenderDetails> => {
  const res = await api.get(`/api/offender/${id}`);
  return res.data;
};