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
