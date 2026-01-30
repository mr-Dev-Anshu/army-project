import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "lost_and_found";

export const useGetLostAndFoundRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateLostAndFoundRegister = () => {
    return useCreateRegister();
};

export const useUpdateLostAndFoundRegister = () => {
    return useUpdateRegister();
};

export const useDeleteLostAndFoundRegister = () => {
    return useDeleteRegister();
};
