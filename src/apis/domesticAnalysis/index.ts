import axios from "axios";

export const getDomesticAnalytics = async ({
    month,
    year,
    groupBy,
}: {
    month: number;
    year: number;
    groupBy?: string;
}) => {
    const response = await axios.get("/api/domestic-analysis", {
        params: { month, year, groupBy },
    });
    return response.data;
};
export const getAnalysisRemarks = async () => {
    const response = await axios.get("/api/analysis-remark");
    return response.data;
};

export const createAnalysisRemark = async (data: any) => {
    const response = await axios.post("/api/analysis-remark", data);
    return response.data;
};

export const updateAnalysisRemark = async ({ id, data }: { id: string; data: any }) => {
    const response = await axios.patch(`/api/analysis-remark/${id}`, data);
    return response.data;
};
