import api from "@/config/axios";
import type { CreateRegisterEntryData, RegisterEntry } from "./types";

export const createRegisterEntry = async (data: CreateRegisterEntryData): Promise<RegisterEntry> => {
    const response = await api.post("/api/registers", data);
    return response.data;
};
