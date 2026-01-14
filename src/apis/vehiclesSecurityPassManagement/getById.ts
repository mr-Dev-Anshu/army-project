import api from "@/config/axios";
import type { VehiclesSecurityPassManagement } from "./types";

export const getVehiclesSecurityPassById = async (id: string): Promise<VehiclesSecurityPassManagement> => {
    const response = await api.get(`/api/vehicle-security-pass/${id}`);
    return response.data;
};
