import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomesticAnalytics, getAnalysisRemarks, createAnalysisRemark, updateAnalysisRemark } from "@/apis/domesticAnalysis";

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

export const useGetAnalysisRemarks = () => {
    return useQuery({
        queryKey: ["analysis-remarks"],
        queryFn: getAnalysisRemarks,
    });
};

export const useCreateAnalysisRemark = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAnalysisRemark,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-remarks"] });
        },
    });
};

export const useUpdateAnalysisRemark = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAnalysisRemark,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-remarks"] });
        },
    });
};
