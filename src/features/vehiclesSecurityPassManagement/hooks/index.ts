import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";
import { CreateVehiclesSecurityPassData, UpdateVehiclesSecurityPassData, VehiclesSecurityPassFilters } from "@/apis/vehiclesSecurityPassManagement/types";

export const useGetAllVehiclesSecurityPasses = (filters?: VehiclesSecurityPassFilters) => {
    return useQuery({
        queryKey: ["vehicles-security-passes", filters],
        queryFn: () => api.getAllVehiclesSecurityPasses(filters),
        retry: 1,
    });
};

export const useGetVehiclesSecurityPassById = (id: string) => {
    return useQuery({
        queryKey: ["vehicles-security-pass", id],
        queryFn: () => api.getVehiclesSecurityPassById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateVehiclesSecurityPass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-vehicles-security-pass"],
        mutationFn: (data: CreateVehiclesSecurityPassData) => api.createVehiclesSecurityPass(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles-security-passes"] });
        },
        retry: 0,
    });
};

export const useUpdateVehiclesSecurityPass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-vehicles-security-pass"],
        mutationFn: ({ id, data }: { id: string; data: UpdateVehiclesSecurityPassData }) =>
            api.updateVehiclesSecurityPass(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["vehicles-security-passes"] });
            await queryClient.cancelQueries({ queryKey: ["vehicles-security-pass", id] });

            // Snapshot the previous value
            const previousPasses = queryClient.getQueriesData({ queryKey: ["vehicles-security-passes"] });

            // Optimistically update
            queryClient.setQueriesData({ queryKey: ["vehicles-security-passes"] }, (old: any[] | undefined) => {
                if (!old) return [];
                // Note: The structure of 'old' depends on if it's paginated or a raw list.
                // Assuming raw list based on typical simple usage, or adjustments needed if paginated.
                // For now, implementing simple optimistic update assuming list of objects.
                return old.map((pass: any) =>
                    pass._id === id ? { ...pass, ...data } : pass
                );
            });

            return { previousPasses };
        },
        onError: (err, variables, context) => {
            if (context?.previousPasses) {
                context.previousPasses.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["vehicles-security-passes"] });
            queryClient.invalidateQueries({ queryKey: ["vehicles-security-pass", id] });
        },
        retry: 0,
    });
};

export const useDeleteVehiclesSecurityPass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-vehicles-security-pass"],
        mutationFn: (id: string) => api.deleteVehiclesSecurityPass(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles-security-passes"] });
        },
        retry: 0,
    });
};
