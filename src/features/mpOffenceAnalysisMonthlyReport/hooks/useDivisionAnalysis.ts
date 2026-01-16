import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getDivisionAnalysis,
    createDivisionAnalysis,
    updateDivisionAnalysis,
    deleteDivisionAnalysis
} from "@/apis/divisionAnalysis";

export const useGetDivisionAnalysis = (params: any) => {
    return useQuery({
        queryKey: ["division-analysis", params],
        queryFn: () => getDivisionAnalysis(params),
        enabled: !!params.divisionName || !!params.groupBy,
    });
};

export const useCreateDivisionAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDivisionAnalysis,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["division-analysis"] });
        },
    });
};

export const useUpdateDivisionAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDivisionAnalysis,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["division-analysis"] });
        },
    });
};

export const useDeleteDivisionAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDivisionAnalysis,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["division-analysis"] });
        },
    });
};
