
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "mobile_phone";

export const useGetMobilePhoneInOutRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateMobilePhoneInOutRegister = () => {
    return useCreateRegister();
};

export const useUpdateMobilePhoneInOutRegister = () => {
    return useUpdateRegister();
};

export const useDeleteMobilePhoneInOutRegister = () => {
    return useDeleteRegister();
};
