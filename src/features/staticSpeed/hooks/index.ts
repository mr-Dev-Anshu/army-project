import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetStaticSpeedRecords = () => {
  return useQuery({
    queryKey: ["static-speed-records"],
    queryFn: api.getAllStaticSpeedRecord,
    retry: 1,
  });
};

export const useGetStaticSpeedRecordById = (id: string) => {
  return useQuery({
    queryKey: ["static-speed-record", id],
    queryFn: () => api.getStaticSpeedRecordById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateStaticSpeedRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-static-speed-record"],
    mutationFn: api.createStaticSpeedRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-speed-records"] });
    },
    retry: 0,
  });
};

export const useUpdateStaticSpeedRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-static-speed-record"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<any>;
    }) => api.updateStaticSpeedRecord(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["static-speed-records"] });
      await queryClient.cancelQueries({ queryKey: ["static-speed-record", id] });

      // Snapshot previous value
      const previousRecords = queryClient.getQueryData(["static-speed-records"]);

      // Optimistically update
      queryClient.setQueryData(["static-speed-records"], (old: any[]) => {
        if (!old) return [];
        return old.map((record) =>
          record._id === id ? { ...record, ...data } : record
        );
      });

      return { previousRecords };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["static-speed-records"], context?.previousRecords);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["static-speed-records"] });
      queryClient.invalidateQueries({ queryKey: ["static-speed-record", id] });
    },
    retry: 0,
  });
};

export const useDeleteStaticSpeedRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-static-speed-record"],
    mutationFn: api.deleteStaticSpeedRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-speed-records"] });
    },
    retry: 0,
  });
};
