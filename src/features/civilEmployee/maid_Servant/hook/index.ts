import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetAllMaidServants = () => {
    return useQuery({
        queryKey: ["maid-servants"],
        queryFn: () => api.getAllMaidServants(),
        retry: 1,
    });
};

export const useGetMaidServantById = (id: string) => {
    return useQuery({
        queryKey: ["maid-servant", id],
        queryFn: () => api.getMaidServantById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateMaidServant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-maid-servant"],
        mutationFn: (data: any) => api.createMaidServant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maid-servants"] });
        },
        retry: 0,
    });
};

export const useUpdateMaidServant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-maid-servant"],
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.updateMaidServant(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["maid-servants"] });
            queryClient.invalidateQueries({ queryKey: ["maid-servant", variables.id] });
        },
        retry: 0,
    });
};

export const useDeleteMaidServant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-maid-servant"],
        mutationFn: (id: string) => api.deleteMaidServant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maid-servants"] });
        },
        retry: 0,
    });
};
