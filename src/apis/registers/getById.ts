import api from "@/config/axios";
import type { RegisterEntry } from "./types";

export const getRegisterEntryById = async (id: string): Promise<RegisterEntry> => {
    const response = await api.get(`/api/registers/${id}`);
    return response.data;
};
