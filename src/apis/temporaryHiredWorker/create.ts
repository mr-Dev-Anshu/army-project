import api from "@/config/axios";

export const createTemporaryHiredWorker = async (data: any) => {
    const response = await api.post("/api/temporaryHiredWorker", data);
    return response.data;
};
