import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis/mpReports"; // We'll export this next

export const useGetAllMPReports = (filters?: any) => {
  return useQuery({
    queryKey: ["mp-reports", filters],
    queryFn: () => api.getAllMPReports(filters),
    retry: 1,
  });
};

export const useGetMPReportById = (id: string) => {
  return useQuery({
    queryKey: ["mp-report", id],
    queryFn: () => api.getMPReportById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateMPReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-mp-report"],
    mutationFn: api.createMPReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mp-reports"] });
    },
  });
};

export const useUpdateMPReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-mp-report"],
    mutationFn: ({ id, data }: { id: string; data: Partial<api.MPReport> }) =>
      api.updateMPReport(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["mp-reports"] });
      await queryClient.cancelQueries({ queryKey: ["mp-report", id] });

      // Snapshot the previous value
      const previousReports = queryClient.getQueriesData({ queryKey: ["mp-reports"] });

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ["mp-reports"] }, (old: api.MPReport[] | undefined) => {
        if (!old) return [];
        return old.map((report) =>
          report._id === id ? { ...report, ...data } : report
        );
      });

      // Also update the single report view if it exists
      queryClient.setQueryData(["mp-report", id], (old: api.MPReport | undefined) => {
        if (!old) return undefined;
        return { ...old, ...data };
      });

      return { previousReports };
    },
    onError: (err, newTodo, context) => {
      // Rollback
      if (context?.previousReports) {
        context.previousReports.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["mp-reports"] });
      queryClient.invalidateQueries({ queryKey: ["mp-report", id] });
    },
  });
};

export const useDeleteMPReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-mp-report"],
    mutationFn: api.deleteMPReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mp-reports"] });
    },
  });
};
