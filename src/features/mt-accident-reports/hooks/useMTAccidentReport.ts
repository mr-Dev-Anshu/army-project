// hooks/useMTAccidentReport.ts
import {
  createMTAccidentReport,
  getAllMTAccidentReports,
  getMTAccidentReportById,
  updateMTAccidentReport,
  deleteMTAccidentReport,
} from "@/apis";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ================= GET ALL ================= */

export const useGetAllMTAccidentReports = () => {
  return useQuery({
    queryKey: ["mt-accident-reports"],
    queryFn: async () => {
      const res = await getAllMTAccidentReports();
      return res ?? [];
    },
    retry: 1,
  });
};

/* ================= GET BY ID ================= */

export const useGetMTAccidentReportById = (id?: string) => {
  return useQuery({
    queryKey: ["mt-accident-reports", id],
    queryFn: () => getMTAccidentReportById(id!),
    enabled: !!id,
    retry: 1,
  });
};

/* ================= CREATE ================= */

export const useCreateMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMTAccidentReport,
    onSuccess: () => {
      // 🔥 table auto refresh
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports"],
      });
    },
  });
};

/* ================= UPDATE ================= */

export const useUpdateMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMTAccidentReport(id, data),

    onSuccess: (_, variables) => {
      // 🔥 refresh list
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports"],
      });

      // 🔥 refresh single
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports", variables.id],
      });
    },
  });
};

/* ================= DELETE ================= */

export const useDeleteMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMTAccidentReport(id),

    onSuccess: () => {
      // 🔥 table refresh after delete
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports"],
      });
    },
  });
};
