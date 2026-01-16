import api from "@/config/axios";
import { CreateUnitMasterListData, UnitMasterList } from "./types";

export const createUnitMasterList = async (data: CreateUnitMasterListData): Promise<UnitMasterList> => {
    const response = await api.post("/api/unit-master-list", data);
    return response.data;
};
