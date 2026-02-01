import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "vehicle";

export const useGetVehicleInOutRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateVehicleInOutRegister = () => {
    return useCreateRegister();
};

export const useUpdateVehicleInOutRegister = () => {
    return useUpdateRegister();
};

export const useDeleteVehicleInOutRegister = () => {
    return useDeleteRegister();
};
