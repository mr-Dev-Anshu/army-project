import api from "@/config/axios";
import { UnitMasterList, UnitMasterListFilters } from "./types";

export const getAllUnitMasterLists = async (filters?: UnitMasterListFilters): Promise<UnitMasterList[]> => {
    const response = await api.get("/api/unit-master-list", { params: filters });
    return response.data;
};
