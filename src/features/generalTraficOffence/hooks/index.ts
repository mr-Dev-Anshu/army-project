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
    mutationFn: (data: api.CreateTrafficOffenceData) => api.createTrafficOffence(data),
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
    mutationFn: ({ id, data }: { id: string; data: api.UpdateTrafficOffenceData }) =>
      api.updateTrafficOffence(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["traffic-offences"] });
      queryClient.invalidateQueries({ queryKey: ["traffic-offence", variables.id] });
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