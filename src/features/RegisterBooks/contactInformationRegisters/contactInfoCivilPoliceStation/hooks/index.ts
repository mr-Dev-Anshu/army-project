
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "contact_info_civil_police";

export const useGetContactInfoCivilPoliceRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateContactInfoCivilPoliceRegister = () => {
    return useCreateRegister();
};

export const useUpdateContactInfoCivilPoliceRegister = () => {
    return useUpdateRegister();
};

export const useDeleteContactInfoCivilPoliceRegister = () => {
    return useDeleteRegister();
};
