import api from "@/config/axios";
import type { RankMasterList, RankMasterListFilters } from "./types";

export const getAllRankMasterLists = async (filters?: RankMasterListFilters): Promise<RankMasterList[]> => {
    const response = await api.get("/api/rank-master-list", { params: filters });
    return response.data;
};
