
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "contact_info_army";

export const useGetContactInfoArmyPersonnelRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateContactInfoArmyPersonnelRegister = () => {
    return useCreateRegister();
};

export const useUpdateContactInfoArmyPersonnelRegister = () => {
    return useUpdateRegister();
};

export const useDeleteContactInfoArmyPersonnelRegister = () => {
    return useDeleteRegister();
};
