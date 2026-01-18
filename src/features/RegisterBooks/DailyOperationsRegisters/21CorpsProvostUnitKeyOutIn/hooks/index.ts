import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "key";

export const useGetKeyOutInRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateKeyOutInRegister = () => {
    return useCreateRegister();
};

export const useUpdateKeyOutInRegister = () => {
    return useUpdateRegister();
};

export const useDeleteKeyOutInRegister = () => {
    return useDeleteRegister();
};
