import { CreateOffenderData } from "@/apis/offender/types";
import {
  getAllOffenders,
  getOffenderById,
  createOffender,
  updateOffender,
  deleteOffender
} from "@/apis";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/*  GET ALL OFFENDERS */
export const useGetOffenders = () => {
  return useQuery({
    queryKey: ["offenders"],
    queryFn: getAllOffenders,
    retry: 1,
  });
};

/*  GET OFFENDER BY ID */
export const useGetOffenderById = (id: string) => {
  return useQuery({
    queryKey: ["offender", id],
    queryFn: () => getOffenderById(id),
    enabled: !!id,
    retry: 1,
  });
};

/* CREATE OFFENDER */
export const useCreateOffender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-offender"],
    mutationFn: (data: CreateOffenderData) => createOffender(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offenders"] });
    },
    retry: 0,
  });
};

/* UPDATE OFFENDER */
export const useUpdateOffender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-offender"],
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateOffenderData> }) =>
      updateOffender(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offenders"] });
      queryClient.invalidateQueries({ queryKey: ["offender", variables.id] });
    },
    retry: 0,
  });
};

/* DELETE OFFENDER */
export const useDeleteOffender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-offender"],
    mutationFn: (id: string) => deleteOffender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offenders"] });
    },
    retry: 0,
  });
};
