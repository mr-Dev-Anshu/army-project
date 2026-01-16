import api from "@/config/axios";
import { OffenceReference } from "./types";

/* =====================
   GET / SEARCH OFFENCE REFERENCES
===================== */

export const getAllOffenceReferences = async (
  params?: object
): Promise<OffenceReference[]> => {
  const res = await api.get("/api/offence-references", { params });
  return res.data.data;
};

/* =====================
   GET OFFENCE TYPES (Dropdown)
===================== */

export const getOffenceTypes = async (): Promise<
  { offenceType: string; count: number }[]
> => {
  const res = await api.get("/api/offence-references", {
    params: { groupBy: "offenceType" },
  });
  return res.data.data;
};
