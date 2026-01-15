import api from "@/config/axios";
import type { CreateVehiclesSecurityPassData, VehiclesSecurityPassManagement } from "./types";

export const createVehiclesSecurityPass = async (data: CreateVehiclesSecurityPassData): Promise<VehiclesSecurityPassManagement> => {
    const response = await api.post("/api/vehicle-security-pass", data);
    return response.data;
};
