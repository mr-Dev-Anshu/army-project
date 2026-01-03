import api from "@/config/axios";

export const createMaidServant = async (data: any) => {
    const response = await api.post("/api/maidServant", data);
    return response.data;
};
