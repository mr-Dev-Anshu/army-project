import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetAllTemporaryHiredWorkers = () => {
    return useQuery({
        queryKey: ["temporary-hired-workers"],
        queryFn: () => api.getAllTemporaryHiredWorkers(),
        retry: 1,
    });
};

export const useGetTemporaryHiredWorkerById = (id: string) => {
    return useQuery({
        queryKey: ["temporary-hired-worker", id],
        queryFn: () => api.getTemporaryHiredWorkerById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateTemporaryHiredWorker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-temporary-hired-worker"],
        mutationFn: (data: any) => api.createTemporaryHiredWorker(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["temporary-hired-workers"] });
        },
        retry: 0,
    });
};

export const useUpdateTemporaryHiredWorker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-temporary-hired-worker"],
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.updateTemporaryHiredWorker(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["temporary-hired-workers"] });
            queryClient.invalidateQueries({ queryKey: ["temporary-hired-worker", variables.id] });
        },
        retry: 0,
    });
};

export const useDeleteTemporaryHiredWorker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-temporary-hired-worker"],
        mutationFn: (id: string) => api.deleteTemporaryHiredWorker(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["temporary-hired-workers"] });
        },
        retry: 0,
    });
};
