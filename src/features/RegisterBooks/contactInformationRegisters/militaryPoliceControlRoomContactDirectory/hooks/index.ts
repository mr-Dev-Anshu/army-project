
import { useGetAllRegisters, useCreateRegister, useUpdateRegister, useDeleteRegister } from "@/features/RegisterBooks/hooks/useRegisterBooks";

const TYPE = "contact_info_mp_control_room";

export const useGetMilitaryPoliceControlRoomRegisters = (filters = {}) => {
    return useGetAllRegisters(TYPE, filters);
};

export const useCreateMilitaryPoliceControlRoomRegister = () => {
    return useCreateRegister();
};

export const useUpdateMilitaryPoliceControlRoomRegister = () => {
    return useUpdateRegister();
};

export const useDeleteMilitaryPoliceControlRoomRegister = () => {
    return useDeleteRegister();
};
