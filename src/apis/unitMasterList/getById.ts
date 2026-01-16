import api from "@/config/axios";
import { UnitMasterList } from "./types";

export const getUnitMasterListById = async (id: string): Promise<UnitMasterList> => {
    const response = await api.get(`/api/unit-master-list/${id}`);
    return response.data;
};
