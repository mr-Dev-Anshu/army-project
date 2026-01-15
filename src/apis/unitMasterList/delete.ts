import api from "@/config/axios";

export const deleteUnitMasterList = async (id: string): Promise<void> => {
    await api.delete(`/api/unit-master-list/${id}`);
};
