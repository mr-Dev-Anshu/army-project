
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "duty_out";

export const useGetDutyInOutRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateDutyInOutRegister = () => {
    return useCreateRegister();
};

export const useUpdateDutyInOutRegister = () => {
    return useUpdateRegister();
};

export const useDeleteDutyInOutRegister = () => {
    return useDeleteRegister();
};
