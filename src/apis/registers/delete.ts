import api from "@/config/axios";

export const deleteRegisterEntry = async (id: string): Promise<any> => {
    const response = await api.delete(`/api/registers/${id}`);
    return response.data;
};
