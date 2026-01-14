import api from "@/config/axios";
import type { UpdateVehiclesSecurityPassData, VehiclesSecurityPassManagement } from "./types";

export const updateVehiclesSecurityPass = async (id: string, data: UpdateVehiclesSecurityPassData): Promise<VehiclesSecurityPassManagement> => {
    const response = await api.put(`/api/vehicle-security-pass/${id}`, data);
    return response.data;
};
