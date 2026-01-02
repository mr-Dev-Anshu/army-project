import api from "@/config/axios";

export const deleteShopkeeper = async (id: string) => {
    const response = await api.delete(`/api/shopkeeper/${id}`);
    return response.data;
};
