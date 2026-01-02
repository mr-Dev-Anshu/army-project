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
    queryFn: getAllMTAccidentReports,
    retry: 1,
  });
};

// Alias for consistency
export const useGetMTAccidentReports = useGetAllMTAccidentReports;

/* ================= GET BY ID ================= */
export const useGetMTAccidentReportById = (id: string) => {
  return useQuery({
    queryKey: ["mt-accident-reports", id],
    queryFn: () => getMTAccidentReportById(id),
    enabled: !!id,
    retry: 1,
  });
};

/* ================= CREATE ================= */
export const useCreateMTAccidentReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-mt-accident-report"],
    mutationFn: (data: any) => createMTAccidentReport(data),
    onSuccess: () => {
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
    mutationKey: ["update-mt-accident-report"],
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMTAccidentReport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports"],
      });
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
    mutationKey: ["delete-mt-accident-report"],
    mutationFn: (id: string) => deleteMTAccidentReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mt-accident-reports"],
      });
    },
  });
};
