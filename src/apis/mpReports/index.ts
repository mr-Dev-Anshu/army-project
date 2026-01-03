import api from "@/config/axios";
import { CreateMPReportPayload, MPReport, UpdateMPReportPayload } from "./types";

export * from "./types";


export const getAllMPReports = async (): Promise<MPReport[]> => {
  const res = await api.get("/api/mp-reports");
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
