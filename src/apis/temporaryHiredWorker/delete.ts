import api from "@/config/axios";

export const deleteTemporaryHiredWorker = async (id: string) => {
    const response = await api.delete(`/api/temporaryHiredWorker/${id}`);
    return response.data;
};
