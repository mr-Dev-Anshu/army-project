import api from "@/config/axios";

export const updateShopkeeper = async (id: string, data: any) => {
    const response = await api.put(`/api/shopkeeper/${id}`, data);
    return response.data;
};
