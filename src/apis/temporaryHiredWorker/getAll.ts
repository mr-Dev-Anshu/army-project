import api from "@/config/axios";

export const getAllTemporaryHiredWorkers = async () => {
    const response = await api.get("/api/temporaryHiredWorker");
    return response.data;
};
