import { useQuery } from "@tanstack/react-query";
import { getDomesticAnalytics } from "@/apis/domesticAnalysis";

export const useGetDomesticAnalytics = ({
    month,
    year,
    groupBy,
}: {
    month: number;
    year: number;
    groupBy?: string;
}) => {
    return useQuery({
        queryKey: ["domestic-analytics", month, year, groupBy],
        queryFn: () => getDomesticAnalytics({ month, year, groupBy }),
        enabled: !!month && !!year,
    });
};
