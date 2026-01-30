import api from "@/config/axios";
import type { MTAccidentReport } from "./types";

export const deleteMTAccidentReport = async (id: string): Promise<MTAccidentReport> => {
    const response = await api.delete(`/api/mt-accident-report/${id}`);
    return response.data;
};
