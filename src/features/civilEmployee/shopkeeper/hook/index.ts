import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetAllShopkeepers = () => {
    return useQuery({
        queryKey: ["shopkeepers"],
        queryFn: () => api.getAllShopkeepers(),
        retry: 1,
    });
};

export const useGetShopkeeperById = (id: string) => {
    return useQuery({
        queryKey: ["shopkeeper", id],
        queryFn: () => api.getShopkeeperById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateShopkeeper = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-shopkeeper"],
        mutationFn: (data: any) => api.createShopkeeper(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shopkeepers"] });
        },
        retry: 0,
    });
};

export const useUpdateShopkeeper = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-shopkeeper"],
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.updateShopkeeper(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shopkeepers"] });
            queryClient.invalidateQueries({ queryKey: ["shopkeeper", variables.id] });
        },
        retry: 0,
    });
};

export const useDeleteShopkeeper = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-shopkeeper"],
        mutationFn: (id: string) => api.deleteShopkeeper(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shopkeepers"] });
        },
        retry: 0,
    });
};
