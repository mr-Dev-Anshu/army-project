"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";
import { CreateUnitMasterListData, UpdateUnitMasterListData, UnitMasterListFilters } from "@/apis/unitMasterList/types";

export const useGetAllUnitMasterLists = (filters?: UnitMasterListFilters) => {
    return useQuery({
        queryKey: ["unit-master-lists", filters],
        queryFn: () => api.getAllUnitMasterLists(filters),
        retry: 1,
    });
};

export const useGetUnitMasterListById = (id: string) => {
    return useQuery({
        queryKey: ["unit-master-list", id],
        queryFn: () => api.getUnitMasterListById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateUnitMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-unit-master-list"],
        mutationFn: (data: CreateUnitMasterListData) => api.createUnitMasterList(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit-master-lists"] });
        },
        retry: 0,
    });
};

export const useUpdateUnitMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-unit-master-list"],
        mutationFn: ({ id, data }: { id: string; data: UpdateUnitMasterListData }) =>
            api.updateUnitMasterList(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["unit-master-lists"] });
            await queryClient.cancelQueries({ queryKey: ["unit-master-list", id] });

            // Snapshot the previous value
            const previousList = queryClient.getQueriesData({ queryKey: ["unit-master-lists"] });

            // Optimistically update
            queryClient.setQueriesData({ queryKey: ["unit-master-lists"] }, (old: any[] | undefined) => {
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
            queryClient.invalidateQueries({ queryKey: ["unit-master-lists"] });
            queryClient.invalidateQueries({ queryKey: ["unit-master-list", id] });
        },
        retry: 0,
    });
};

export const useDeleteUnitMasterList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-unit-master-list"],
        mutationFn: (id: string) => api.deleteUnitMasterList(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit-master-lists"] });
        },
        retry: 0,
    });
};
