import api from "@/config/axios";

export const getDivisionAnalysis = async (params: any) => {
    const response = await api.get("/api/division-analysis", { params });
    return response.data;
};

export const createDivisionAnalysis = async (data: any) => {
    const response = await api.post("/api/division-analysis", data);
    return response.data;
};

export const updateDivisionAnalysis = async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/api/division-analysis/${id}`, data);
    return response.data;
};

export const deleteDivisionAnalysis = async (id: string) => {
    const response = await api.delete(`/api/division-analysis/${id}`);
    return response.data;
};
