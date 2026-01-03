import {
  getAllOnDutyWitnessingMp,
  getOnDutyWitnessingMpById,
  updateOnDutyWitnessingMp,
  deleteOnDutyWitnessingMp,
  createMpWitenessing
} from "@/apis";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* GET ALL */
export const useGetOnDutyWitnessingMp = () => {
  return useQuery({
    queryKey: ["on-duty-witness-mp"],
    queryFn: getAllOnDutyWitnessingMp,
    retry: 1,
  });
};

/* GET BY ID */
export const useGetOnDutyWitnessingMpById = (id: string) => {
  return useQuery({
    queryKey: ["on-duty-witness-mp", id],
    queryFn: () => getOnDutyWitnessingMpById(id),
    enabled: !!id,
    retry: 1,
  });
};

/* CREATE */
export const useCreateOnDutyWitnessingMp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-on-duty-witness-mp"],
    mutationFn: (data: any) => createMpWitenessing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["on-duty-witness-mp"] });
    },
  });
};

/* UPDATE */
export const useUpdateOnDutyWitnessingMp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-on-duty-witness-mp"],
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateOnDutyWitnessingMp(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["on-duty-witness-mp"] });
      queryClient.invalidateQueries({
        queryKey: ["on-duty-witness-mp", variables.id],
      });
    },
  });
};

/* DELETE */
export const useDeleteOnDutyWitnessingMp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-on-duty-witness-mp"],
    mutationFn: (id: string) => deleteOnDutyWitnessingMp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["on-duty-witness-mp"] });
    },
  });
};
