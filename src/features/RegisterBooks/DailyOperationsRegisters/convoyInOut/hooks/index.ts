import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "convoy";

export const useGetConvoyRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateConvoyRegister = () => {
    return useCreateRegister();
};

export const useUpdateConvoyRegister = () => {
    return useUpdateRegister();
};

export const useDeleteConvoyRegister = () => {
    return useDeleteRegister();
};
