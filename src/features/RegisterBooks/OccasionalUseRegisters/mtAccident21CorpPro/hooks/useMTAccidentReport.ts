import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    createMTAccidentReport,
    getAllMTAccidentReports,
    getMTAccidentReportById,
    updateMTAccidentReport,
    deleteMTAccidentReport,
    MTAccidentReport,
    CreateMTAccidentReportData
} from "@/apis";

export const useMTAccidentReport = (id?: string) => {
    const queryClient = useQueryClient();

    // Query for fetching a single report by ID
    const {
        data: report,
        isLoading: isReportLoading,
        error: reportError
    } = useQuery({
        queryKey: ["mtAccidentReport", id],
        queryFn: () => getMTAccidentReportById(id!),
        enabled: !!id,
    });

    // Query for fetching all reports (with filters if needed)
    const useReports = (filters = {}) => useQuery({
        queryKey: ["mtAccidentReports", filters],
        queryFn: () => getAllMTAccidentReports(filters),
    });

    // Mutation for creating a report
    const createMutation = useMutation({
        mutationFn: (data: CreateMTAccidentReportData) => createMTAccidentReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mtAccidentReports"] });
            toast.success("MT Accident Report created successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to create MT Accident Report";
            toast.error(message);
        },
    });

    // Mutation for updating a report
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateMTAccidentReportData> }) =>
            updateMTAccidentReport(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["mtAccidentReport", data._id] });
            queryClient.invalidateQueries({ queryKey: ["mtAccidentReports"] });
            toast.success("MT Accident Report updated successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to update MT Accident Report";
            toast.error(message);
        },
    });

    // Mutation for deleting a report
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMTAccidentReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mtAccidentReports"] });
            toast.success("MT Accident Report deleted successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to delete MT Accident Report";
            toast.error(message);
        },
    });

    return {
        report,
        isReportLoading,
        reportError,
        useReports,
        createReport: createMutation.mutateAsync,
        updateReport: updateMutation.mutateAsync,
        deleteReport: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
