import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "general_duty_diary";

export const useGetGeneralDutyDiaryRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateGeneralDutyDiaryRegister = () => {
    const mutation = useCreateRegister();
    return {
        ...mutation,
        mutateAsync: (data: any) => mutation.mutateAsync({ ...data, type: TYPE }),
    };
};

export const useUpdateGeneralDutyDiaryRegister = () => {
    const mutation = useUpdateRegister();
    return {
        ...mutation,
        mutateAsync: ({ id, data, suppressToast }: { id: string; data: any; suppressToast?: boolean }) =>
            mutation.mutateAsync({ id, payload: { ...data, type: TYPE }, suppressToast }),
    };
};

export const useDeleteGeneralDutyDiaryRegister = () => {
    return useDeleteRegister();
};
