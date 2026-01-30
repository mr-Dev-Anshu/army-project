import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "army_help_line_complaints";

export const useGetArmyHelpLineComplaintsRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateArmyHelpLineComplaintsRegister = () => {
    return useCreateRegister();
};

export const useUpdateArmyHelpLineComplaintsRegister = () => {
    return useUpdateRegister();
};

export const useDeleteArmyHelpLineComplaintsRegister = () => {
    return useDeleteRegister();
};
