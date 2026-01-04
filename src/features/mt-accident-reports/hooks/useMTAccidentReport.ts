// hooks/useMTAccidentReport.ts
import {
  createMTAccidentReport,
  getAllMTAccidentReports,
  getMTAccidentReportById,
  updateMTAccidentReport,
  deleteMTAccidentReport,
} from "@/apis";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ================= GET ALL =================
export const useGetAllMTAccidentReports = () => {
  return useQuery({
    queryKey: ["mt-accident-reports"],
    queryFn: getAllMTAccidentReports,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Optional: 5 minutes stale time
  });
};

// Alias for backward compatibility or readability
export const useGetMTAccidentReports = useGetAllMTAccidentReports;

// ================= GET BY ID =================
export const useGetMTAccidentReportById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["mt-accident-reports", id],
    queryFn: () => getMTAccidentReportById(id!),
    enabled: !!id, // Only run if id exists
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// ================= CREATE =================
export const useCreateMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMTAccidentReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mt-accident-reports"] });
    },
  });
};

// ================= UPDATE =================
export const useUpdateMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMTAccidentReport(id, data),
    onSuccess: (data, variables) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ["mt-accident-reports"] });
      // Invalidate single
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports", variables.id],
      });
      // Optional: optimistically update cache
      // queryClient.setQueryData(["mt-accident-reports", variables.id], data);
    },
  });
};

// ================= DELETE =================
export const useDeleteMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMTAccidentReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mt-accident-reports"] });
    },
  });
};