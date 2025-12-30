import api from "@/config/axios";

export const updateMaidServant = async (id: string, data: any) => {
    const response = await api.put(`/api/maidServant/${id}`, data);
    return response.data;
};
