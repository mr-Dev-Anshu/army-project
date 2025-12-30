import api from "@/config/axios";

export const updateTemporaryHiredWorker = async (id: string, data: any) => {
    const response = await api.patch(`/api/temporaryHiredWorker/${id}`, data);
    return response.data;
};
