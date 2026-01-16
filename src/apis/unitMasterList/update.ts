import api from "@/config/axios";
import { UpdateUnitMasterListData, UnitMasterList } from "./types";

export const updateUnitMasterList = async (id: string, data: UpdateUnitMasterListData): Promise<UnitMasterList> => {
    const response = await api.patch(`/api/unit-master-list/${id}`, data);
    return response.data;
};
