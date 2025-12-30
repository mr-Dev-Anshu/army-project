import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetAllTrafficOffences = (filters?: any) => {
  return useQuery({
    queryKey: ["traffic-offences", filters],
    queryFn: () => api.getAllTrafficOffences(filters),
    retry: 1,
  });
};

export const useGetTrafficOffenceById = (id: string) => {
  return useQuery({
    queryKey: ["traffic-offence", id],
    queryFn: () => api.getTrafficOffenceById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateTrafficOffence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-traffic-offence"],
    mutationFn: (data: any) => api.createTrafficOffence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traffic-offences"] });
    },
    retry: 0,
  });
};

export const useUpdateTrafficOffence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-traffic-offence"],
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateTrafficOffence(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["traffic-offences"] });
      await queryClient.cancelQueries({ queryKey: ["traffic-offence", id] });

      // Snapshot the previous value of all queries matching the key
      const previousOffences = queryClient.getQueriesData({ queryKey: ["traffic-offences"] });

      // Optimistically update all matching queries
      queryClient.setQueriesData({ queryKey: ["traffic-offences"] }, (old: any[] | undefined) => {
        if (!old) return [];
        return old.map((group) => ({
          ...group,
          offences: group.offences?.map((offence: any) =>
            offence._id === id ? { ...offence, ...data } : offence
          ),
        }));
      });

      return { previousOffences };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value
      if (context?.previousOffences) {
        context.previousOffences.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["traffic-offences"] });
      queryClient.invalidateQueries({ queryKey: ["traffic-offence", id] });
    },
    retry: 0,
  });
};

export const useDeleteTrafficOffence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-traffic-offence"],
    mutationFn: (id: string) => api.deleteTrafficOffence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traffic-offences"] });
    },
    retry: 0,
  });
};