
import { useGetAllRegisters, useUpdateRegister, useDeleteRegister, useCreateRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

// Use the exact type enum string defined in the model
const REGISTER_TYPE = "mp-general-diary-daily-occurrence-book";

export const useGetMpGeneralDiaryEntries = (filters: any = {}) => {
    return useGetAllRegisters(REGISTER_TYPE, filters);
};

export const useCreateMpGeneralDiaryEntry = () => {
    // Manual creation enabled
    return useCreateRegister();
};

export const useUpdateMpGeneralDiaryEntry = () => {
    return useUpdateRegister();
};

export const useDeleteMpGeneralDiaryEntry = () => {
    return useDeleteRegister();
};
