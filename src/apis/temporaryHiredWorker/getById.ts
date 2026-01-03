import api from "@/config/axios";

export const getTemporaryHiredWorkerById = async (id: string) => {
    const response = await api.get(`/api/temporaryHiredWorker/${id}`);
    return response.data;
};
