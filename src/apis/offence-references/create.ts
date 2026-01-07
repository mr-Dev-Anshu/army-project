import api from "@/config/axios";
import { CreateOffenceReferencePayload, OffenceReference } from "./types";

/* =====================
   CREATE OFFENCE + REFERENCE
===================== */

export const createOffenceReference = async (
  data: CreateOffenceReferencePayload
): Promise<OffenceReference> => {
  const res = await api.post("/api/offence-references", data);
  return res.data.data;
};
