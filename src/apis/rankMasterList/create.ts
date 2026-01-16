import api from "@/config/axios";
import type { RankMasterList, CreateRankMasterListData } from "./types";

export const createRankMasterList = async (data: CreateRankMasterListData): Promise<RankMasterList> => {
    const response = await api.post("/api/rank-master-list", data);
    return response.data;
};
