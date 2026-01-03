import api from "@/config/axios";

export const createShopkeeper = async (data: any) => {
    const response = await api.post("/api/shopkeeper", data);
    return response.data;
};
