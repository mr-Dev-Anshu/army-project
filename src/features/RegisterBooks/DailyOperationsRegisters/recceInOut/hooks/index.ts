import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "recce";

export const useGetRecceInOutRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateRecceInOutRegister = () => {
    return useCreateRegister();
};

export const useUpdateRecceInOutRegister = () => {
    return useUpdateRegister();
};

export const useDeleteRecceInOutRegister = () => {
    return useDeleteRegister();
};
