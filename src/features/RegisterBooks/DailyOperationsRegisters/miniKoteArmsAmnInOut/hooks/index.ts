import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "arms_amn";

export const useGetMiniKoteArmsAmnInOutRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateMiniKoteArmsAmnInOutRegister = () => {
    return useCreateRegister();
};

export const useUpdateMiniKoteArmsAmnInOutRegister = () => {
    return useUpdateRegister();
};

export const useDeleteMiniKoteArmsAmnInOutRegister = () => {
    return useDeleteRegister();
};
