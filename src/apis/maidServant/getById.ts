import api from "@/config/axios";

export const getMaidServantById = async (id: string) => {
    const response = await api.get(`/api/maidServant/${id}`);
    return response.data;
};
