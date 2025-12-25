import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetAllTrafficOffences = () => {
  return useQuery({
    queryKey: ["traffic-offences"],
    queryFn: api.getAllTrafficOffences,
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
    mutationFn: (data: api.createTrafficOffence) => api.createTrafficOffence(data),
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
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["traffic-offences"] });
      await queryClient.cancelQueries({ queryKey: ["traffic-offence", id] });

      // Snapshot the previous value
      const previousOffences = queryClient.getQueryData(["traffic-offences"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["traffic-offences"], (old: any[]) => {
        if (!old) return [];
        return old.map((group) => ({
          ...group,
          offences: group.offences?.map((offence: any) =>
            offence._id === id ? { ...offence, ...data } : offence
          ),
        }));
      });

      // Return a context object with the snapshotted value
      return { previousOffences };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["traffic-offences"], context?.previousOffences);
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