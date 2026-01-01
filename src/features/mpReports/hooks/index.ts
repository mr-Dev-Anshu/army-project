import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis/mpReports"; 

export const useGetAllMPReports = () => {
  return useQuery({
    queryKey: ["mp-reports"],
    queryFn: api.getAllMPReports,
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
      await queryClient.cancelQueries({ queryKey: ["mp-reports"] });
      await queryClient.cancelQueries({ queryKey: ["mp-report", id] });

      const previousReports = queryClient.getQueryData(["mp-reports"]);

      queryClient.setQueryData(["mp-reports"], (old: api.MPReport[] | undefined) => {
        if (!old) return [];
        return old.map((report) =>
          report._id === id ? { ...report, ...data } : report
        );
      });

      return { previousReports };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["mp-reports"], context?.previousReports);
    },
    onSettled: (_, __, { id }) => {
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
