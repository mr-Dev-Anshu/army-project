import api from "@/config/axios";

export const getAllMaidServants = async () => {
    const response = await api.get("/api/maidServant");
    return response.data;
};
