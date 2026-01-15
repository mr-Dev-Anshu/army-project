import api from "@/config/axios";
import type { RankMasterList } from "./types";

export const getRankMasterListById = async (id: string): Promise<RankMasterList> => {
    const response = await api.get(`/api/rank-master-list/${id}`);
    return response.data;
};
