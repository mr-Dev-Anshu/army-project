import api from "@/config/axios";
import type { RegisterEntry } from "./types";

export const getAllRegisterEntries = async (params?: any): Promise<RegisterEntry[]> => {
    const response = await api.get("/api/registers", { params });
    return response.data;
};
