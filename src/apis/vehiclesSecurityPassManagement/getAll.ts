import api from "@/config/axios";
import type { VehiclesSecurityPassManagement, VehiclesSecurityPassFilters } from "./types";

export const getAllVehiclesSecurityPasses = async (filters?: VehiclesSecurityPassFilters): Promise<VehiclesSecurityPassManagement[]> => {
    const response = await api.get("/api/vehicle-security-pass", { params: filters });
    return response.data;
};
