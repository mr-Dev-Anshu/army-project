import api from "@/config/axios";
import type { RankMasterList } from "./types";

export const deleteRankMasterList = async (id: string): Promise<RankMasterList> => {
    const response = await api.delete(`/api/rank-master-list/${id}`);
    return response.data;
};
