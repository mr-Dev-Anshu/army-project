import api from "@/config/axios";

export const getShopkeeperById = async (id: string) => {
    const response = await api.get(`/api/shopkeeper/${id}`);
    return response.data;
};
