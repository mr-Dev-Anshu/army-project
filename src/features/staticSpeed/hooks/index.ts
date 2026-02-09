import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetStaticSpeedRecords = (filters: any = {}) => {
  return useQuery({
    queryKey: ["static-speed-records", filters],
    queryFn: () => api.getAllStaticSpeedRecord(filters),
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
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateStaticSpeedRecord(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["static-speed-records"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["static-speed-record", id],
      });
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
