import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    createRegisterEntry,
    deleteRegisterEntry,
    getAllRegisterEntries,
    getRegisterEntryById,
    updateRegisterEntry
} from "@/apis";
import type { RegisterEntry } from "@/apis/registers/types";

// Re-export type for compatibility with other files using it from here
export type { RegisterEntry };

// --- Generic Hooks ---

export const useGetAllRegisters = (type?: string, filters: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["registers", type, filters],
        queryFn: async () => {
            const params = { type, ...filters };
            return await getAllRegisterEntries(params);
        },
        enabled: true,
    });
};

export const useGetRegisterById = (id: string) => {
    return useQuery({
        queryKey: ["register", id],
        queryFn: async () => {
            if (!id) return null;
            return await getRegisterEntryById(id);
        },
        enabled: !!id,
    });
};

export const useCreateRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRegisterEntry,
        onSuccess: (data, variables) => {
            // Invalidate the list for this specific type
            queryClient.invalidateQueries({ queryKey: ["registers", variables.type] });
            queryClient.invalidateQueries({ queryKey: ["registers", undefined] }); // Invalidate all
            toast.success("Register entry created successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to create register entry";
            toast.error(message);
        },
    });
};

export const useUpdateRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Partial<RegisterEntry> }) => {
            return await updateRegisterEntry(id, payload);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["register", data._id] });
            queryClient.invalidateQueries({ queryKey: ["registers", data.type] });
            queryClient.invalidateQueries({ queryKey: ["registers", undefined] });
            toast.success("Register entry updated successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to update register entry";
            toast.error(message);
        },
    });
};

export const useDeleteRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRegisterEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["registers"] });
            toast.success("Register entry deleted successfully");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || "Failed to delete register entry";
            toast.error(message);
        },
    });
};

// --- Specialized Hooks ---

export const useMobilePhoneRegister = (filters = {}) => useGetAllRegisters('mobile_phone', filters);
export const useVehicleRegister = (filters = {}) => useGetAllRegisters('vehicle', filters);
export const useConvoyRegister = (filters = {}) => useGetAllRegisters('convoy', filters);
export const useKeyRegister = (filters = {}) => useGetAllRegisters('key', filters);
export const useArmsAmnRegister = (filters = {}) => useGetAllRegisters('arms_amn', filters);
export const useRecceRegister = (filters = {}) => useGetAllRegisters('recce', filters);
export const useDutyOutRegister = (filters = {}) => useGetAllRegisters('duty_out', filters);
export const useDutyRosterRegister = (filters = {}) => useGetAllRegisters('duty_roster', filters);
export const useGeneralDutyDiaryRegister = (filters = {}) => useGetAllRegisters('general_duty_diary', filters);
export const useArmyHelpLineComplaintsRegister = (filters = {}) => useGetAllRegisters('army_help_line_complaints', filters);
export const useLostAndFoundRegister = (filters = {}) => useGetAllRegisters('lost_and_found', filters);
export const useVehicleDemandRegister = (filters = {}) => useGetAllRegisters('vehicle_demand', filters);
export const useContactInfoArmyRegister = (filters = {}) => useGetAllRegisters('contact_info_army', filters);
export const useContactInfoCivilPoliceRegister = (filters = {}) => useGetAllRegisters('contact_info_civil_police', filters);
export const useContactInfoMpControlRoomRegister = (filters = {}) => useGetAllRegisters('contact_info_mp_control_room', filters);
