
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "duty_roster";

export const useGetDutyRosterRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateDutyRosterRegister = () => {
    return useCreateRegister();
};

export const useUpdateDutyRosterRegister = () => {
    return useUpdateRegister();
};

export const useDeleteDutyRosterRegister = () => {
    return useDeleteRegister();
};
