import api from "@/config/axios";

export const deleteVehiclesSecurityPass = async (id: string): Promise<void> => {
    await api.delete(`/api/vehicle-security-pass/${id}`);
};
