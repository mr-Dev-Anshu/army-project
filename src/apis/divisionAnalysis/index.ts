import axios from "axios";

export const getDivisionAnalysis = async (params: any) => {
    const response = await axios.get("/api/division-analysis", { params });
    return response.data;
};

export const createDivisionAnalysis = async (data: any) => {
    const response = await axios.post("/api/division-analysis", data);
    return response.data;
};

export const updateDivisionAnalysis = async ({ id, data }: { id: string; data: any }) => {
    const response = await axios.put(`/api/division-analysis/${id}`, data);
    return response.data;
};

export const deleteDivisionAnalysis = async (id: string) => {
    const response = await axios.delete(`/api/division-analysis/${id}`);
    return response.data;
};
