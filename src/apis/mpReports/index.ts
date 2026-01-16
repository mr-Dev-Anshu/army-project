import api from "@/config/axios";
import { CreateMPReportPayload, MPReport, UpdateMPReportPayload } from "./types";

export * from "./types";

export const getAllMPReports = async (filters: any = {}): Promise<MPReport[]> => {
  const params = new URLSearchParams();
  if (filters.unit) params.append("unit", filters.unit);
  if (filters.fmn) params.append("fmn", filters.fmn);
  if (filters.fromDate) params.append("fromDate", filters.fromDate);
  if (filters.toDate) params.append("toDate", filters.toDate);
  if (filters.placeOfOffence) params.append("placeOfOffence", filters.placeOfOffence);

  const res = await api.get(`/api/mp-reports?${params.toString()}`);
  return res.data.data;
};

export const getMPReportById = async (id: string): Promise<MPReport> => {
  const res = await api.get(`/api/mp-reports/${id}`);
  return res.data.data;
};

export const createMPReport = async (data: CreateMPReportPayload): Promise<MPReport> => {
  const res = await api.post("/api/mp-reports", data);
  return res.data.data;
};

export const updateMPReport = async (id: string, data: UpdateMPReportPayload): Promise<MPReport> => {
  const res = await api.put(`/api/mp-reports/${id}`, data);
  return res.data.data;
};

export const deleteMPReport = async (id: string): Promise<void> => {
  await api.delete(`/api/mp-reports/${id}`);
};
