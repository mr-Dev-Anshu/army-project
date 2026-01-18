import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// Generic Register Types
export interface RegisterEntry {
    _id?: string;
    type: string;
    date: string;
    outTime?: string;
    inTime?: string;
    duty?: any;
    details?: any;
    outSignature?: any;
    inSignature?: any;
    authentication?: any[];
    remark?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

const REGISTERS_API_BASE = "/api/registers";

// --- Generic Hooks ---

export const useGetAllRegisters = (type?: string, filters: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["registers", type, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (type) params.append("type", type);
            Object.keys(filters).forEach((key) => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const { data } = await axios.get(`${REGISTERS_API_BASE}?${params.toString()}`);
            return data;
        },
        enabled: true,
    });
};

export const useGetRegisterById = (id: string) => {
    return useQuery({
        queryKey: ["register", id],
        queryFn: async () => {
            if (!id) return null;
            const { data } = await axios.get(`${REGISTERS_API_BASE}/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<RegisterEntry>) => {
            const { data } = await axios.post(REGISTERS_API_BASE, payload);
            return data;
        },
        onSuccess: (data, variables) => {
            // Invalidate the list for this specific type
            queryClient.invalidateQueries({ queryKey: ["registers", variables.type] });
            queryClient.invalidateQueries({ queryKey: ["registers", undefined] }); // Invalidate all
            toast.success("Register entry created successfully");
        },
        onError: (error: any) => {
            toast.error("Failed to create register entry");
        },
    });
};

export const useUpdateRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Partial<RegisterEntry> }) => {
            const { data } = await axios.patch(`${REGISTERS_API_BASE}/${id}`, payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["register", data._id] });
            queryClient.invalidateQueries({ queryKey: ["registers", data.type] });
            queryClient.invalidateQueries({ queryKey: ["registers", undefined] });
            toast.success("Register entry updated successfully");
        },
        onError: (error: any) => {
            toast.error("Failed to update register entry");
        },
    });
};

export const useDeleteRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.delete(`${REGISTERS_API_BASE}/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["registers"] });
            toast.success("Register entry deleted successfully");
        },
        onError: (error: any) => {
            toast.error("Failed to delete register entry");
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
