import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMPReport,
  getMPReports,
  getMPReportById,
  updateMPReport,
  deleteMPReport,
} from "@/apis/investigationReport";

const REPORT_KEY = ["mp-reports"];

export const useGetMPReports = (filters?: any) => {
  return useQuery({
    queryKey: [...REPORT_KEY, filters],
    queryFn: () => getMPReports(filters),
  });
};

export const useGetMPReportById = (id?: string) => {
  return useQuery({
    queryKey: ["mp-report", id],
    queryFn: () => getMPReportById(id!),
    enabled: !!id,
  });
};

export const useCreateMPReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createMPReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORT_KEY });
    },
  });
};

export const useUpdateMPReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateMPReport(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORT_KEY });
    },
  });
};

export const useDeleteMPReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteMPReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORT_KEY });
    },
  });
};
