import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";
import { CreateRankMasterListData, UpdateRankMasterListData, RankMasterListFilters } from "@/apis/rankMasterList/types";

export const useGetAllRankMasterLists = (filters?: RankMasterListFilters) => {
    return useQuery({
        queryKey: ["rank-master-lists", filters],
        queryFn: () => api.getAllRankMasterLists(filters),
        retry: 1,
    });
};

export const useGetRankMasterListById = (id: string) => {
    return useQuery({
        queryKey: ["rank-master-list", id],
        queryFn: () => api.getRankMasterListById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateRankMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-rank-master-list"],
        mutationFn: (data: CreateRankMasterListData) => api.createRankMasterList(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rank-master-lists"] });
        },
        retry: 0,
    });
};

export const useUpdateRankMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-rank-master-list"],
        mutationFn: ({ id, data }: { id: string; data: UpdateRankMasterListData }) =>
            api.updateRankMasterList(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["rank-master-lists"] });
            await queryClient.cancelQueries({ queryKey: ["rank-master-list", id] });

            // Snapshot the previous value
            const previousList = queryClient.getQueriesData({ queryKey: ["rank-master-lists"] });

            // Optimistically update
            queryClient.setQueriesData({ queryKey: ["rank-master-lists"] }, (old: any[] | undefined) => {
                if (!old) return [];
                return old.map((item: any) =>
                    item._id === id ? { ...item, ...data } : item
                );
            });

            return { previousList };
        },
        onError: (err, variables, context) => {
            if (context?.previousList) {
                context.previousList.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["rank-master-lists"] });
            queryClient.invalidateQueries({ queryKey: ["rank-master-list", id] });
        },
        retry: 0,
    });
};

export const useDeleteRankMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-rank-master-list"],
        mutationFn: (id: string) => api.deleteRankMasterList(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rank-master-lists"] });
        },
        retry: 0,
    });
};
