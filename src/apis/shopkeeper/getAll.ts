import api from "@/config/axios";

export const getAllShopkeepers = async () => {
    const response = await api.get("/api/shopkeeper");
    return response.data;
};
