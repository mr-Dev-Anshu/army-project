import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";

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
   GET OFFENCE TYPES (SuggestionInput dropdown)
   API: GET /api/offence-types
===================== */
export const useGetOffenceTypes = () => {
  return useQuery({
    queryKey: ["offence-types"],
    queryFn: getOffenceTypes,
  });
};

/* =====================
   GET / SEARCH OFFENCE REFERENCES
   API:
   /api/offence-references?offenceType=xxx
   /api/offence-references?offenceType=xxx&search=yyy
===================== */
export const useGetOffenceReferences = (
  offenceType: string,
  search: string = ""
) => {
  return useQuery({
    queryKey: ["offence-references", offenceType, search],

    enabled: Boolean(offenceType),

    queryFn: async () => {
      /**
       * Build query params safely
       */
      const params: GetOffenceReferenceQuery = {
        offenceType: offenceType.toLowerCase(),
      };

      if (search?.trim()) {
        params.search = search.trim();
      }

      /**
       * Uses existing API function
       */
      const res = await getAllOffenceReferences(params);

      /**
       * Normalize response
       * Supports:
       * - []
       * - { data: [] }
       */
      if (Array.isArray(res)) return res;
      if (Array.isArray((res as any)?.data)) return (res as any).data;

      return [];
    },
  });
};

/* =====================
   CREATE OFFENCE + REFERENCE
   API: POST /api/offence-references
===================== */
export const useCreateOffenceReference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOffenceReferencePayload) =>
      createOffenceReference(payload),

    onSuccess: () => {
      /**
       * Invalidate:
       * - offence types (new offence may be added)
       * - offence references (new reference added)
       */
      queryClient.invalidateQueries({
        queryKey: ["offence-types"],
      });

      queryClient.invalidateQueries({
        queryKey: ["offence-references"],
      });
    },
  });
};
