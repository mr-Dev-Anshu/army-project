import api from "@/config/axios";

export const deleteMaidServant = async (id: string) => {
    const response = await api.delete(`/api/maidServant/${id}`);
    return response.data;
};
