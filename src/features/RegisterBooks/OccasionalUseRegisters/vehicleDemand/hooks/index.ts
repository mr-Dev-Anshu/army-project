import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "vehicle_demand";

export const useGetVehicleDemandRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateVehicleDemandRegister = () => {
    return useCreateRegister();
};

export const useUpdateVehicleDemandRegister = () => {
    return useUpdateRegister();
};

export const useDeleteVehicleDemandRegister = () => {
    return useDeleteRegister();
};
