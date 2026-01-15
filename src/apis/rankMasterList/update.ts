import api from "@/config/axios";
import type { RankMasterList, UpdateRankMasterListData } from "./types";

export const updateRankMasterList = async (id: string, data: UpdateRankMasterListData): Promise<RankMasterList> => {
    const response = await api.patch(`/api/rank-master-list/${id}`, data);
    return response.data;
};
