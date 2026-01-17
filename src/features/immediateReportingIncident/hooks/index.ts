import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/apis";
import { CreateImmediateReportingIncidentData, PrepareUpdateImmediateReportingIncidentData, ImmediateReportingIncidentFilters, UpdateImmediateReportingIncidentData } from "@/apis/immediateReportingIncident/types";

export const useGetAllImmediateReportingIncidents = (filters?: ImmediateReportingIncidentFilters) => {
    return useQuery({
        queryKey: ["immediate-reporting-incidents", filters],
        queryFn: () => api.getAllImmediateReportingIncidents(filters),
        retry: 1,
    });
};

export const useGetImmediateReportingIncidentById = (id: string) => {
    return useQuery({
        queryKey: ["immediate-reporting-incident", id],
        queryFn: () => api.getImmediateReportingIncidentById(id),
        enabled: !!id,
        retry: 1,
    });
};

export const useCreateImmediateReportingIncident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-immediate-reporting-incident"],
        mutationFn: (data: CreateImmediateReportingIncidentData) => api.createImmediateReportingIncident(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["immediate-reporting-incidents"] });
        },
        retry: 0,
    });
};

export const useUpdateImmediateReportingIncident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-immediate-reporting-incident"],
        mutationFn: ({ id, data }: { id: string; data: UpdateImmediateReportingIncidentData }) =>
            api.updateImmediateReportingIncident(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["immediate-reporting-incidents"] });
            await queryClient.cancelQueries({ queryKey: ["immediate-reporting-incident", id] });

            // Snapshot the previous value
            const previousIncidents = queryClient.getQueriesData({ queryKey: ["immediate-reporting-incidents"] });

            // Optimistically update
            queryClient.setQueriesData({ queryKey: ["immediate-reporting-incidents"] }, (old: any[] | undefined) => {
                if (!old) return [];
                return old.map((incident: any) =>
                    incident._id === id ? { ...incident, ...data } : incident
                );
            });

            return { previousIncidents };
        },
        onError: (err, variables, context) => {
            if (context?.previousIncidents) {
                context.previousIncidents.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["immediate-reporting-incidents"] });
            queryClient.invalidateQueries({ queryKey: ["immediate-reporting-incident", id] });
        },
        retry: 0,
    });
};

export const useDeleteImmediateReportingIncident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-immediate-reporting-incident"],
        mutationFn: (id: string) => api.deleteImmediateReportingIncident(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["immediate-reporting-incidents"] });
        },
        retry: 0,
    });
};
