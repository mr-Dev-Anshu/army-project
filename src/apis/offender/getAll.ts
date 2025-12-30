import api from "@/config/axios";
import { OffenderDetails } from "./types";

export const getAllOffenders = async (): Promise<OffenderDetails[]> => {
  const res = await api.get("/api/offender");
  return res.data;
};