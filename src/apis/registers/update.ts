import api from "@/config/axios";
import type { CreateRegisterEntryData, RegisterEntry } from "./types";

export const updateRegisterEntry = async (id: string, data: CreateRegisterEntryData): Promise<RegisterEntry> => {
    const response = await api.patch(`/api/registers/${id}`, data);
    return response.data;
};
