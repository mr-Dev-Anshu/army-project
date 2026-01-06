import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOffenceReferences,
  getOffenceTypes,
  createOffenceReference,
} from "../../../apis/index";
import {
  CreateOffenceReferencePayload,
  GetOffenceReferenceQuery,
} from "../../../apis/offence-references/types";

/* =====================
   GET OFFENCE TYPES (Dropdown)
===================== */
export const useGetOffenceTypes = () => {
  return useQuery({
    queryKey: ["offence-types"],
    queryFn: getOffenceTypes,
  });
};

/* =====================
   GET / SEARCH OFFENCE REFERENCES
===================== */
// export const useGetOffenceReferences = (
//   params?: GetOffenceReferenceQuery
// ) => {
//   return useQuery({
//     queryKey: ["offence-references", params],
//     queryFn: () => getAllOffenceReferences(params),
//     enabled: !!params,
//   });
// };


export const useGetOffenceReferences = (offenceType: string) =>
  useQuery({
    queryKey: ["offence-references", offenceType || "none"],
    queryFn: async () => {
      const res = await api.get("/api/offence-references", {
        params: { offenceType },
      });
      return res.data.data;
    },
    enabled: Boolean(offenceType),
  });

/* =====================
   CREATE OFFENCE + REFERENCE
===================== */
export const useCreateOffenceReference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOffenceReferencePayload) =>
      createOffenceReference(payload),

    onSuccess: () => {
      // Refresh dropdown & list
      queryClient.invalidateQueries({ queryKey: ["offence-types"] });
      queryClient.invalidateQueries({ queryKey: ["offence-references"] });
    },
  });
};
