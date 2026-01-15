export interface RankMasterList {
    _id: string;
    rankCategory: string;
    rank: string;
    rankShortForm: string;
    rankSeniorityOrder: string;
    rankActiveStatus: boolean;
    serviceArm: string;
    remarks: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRankMasterListData {
    rankCategory: string;
    rank: string;
    rankShortForm: string;
    rankSeniorityOrder: string;
    rankActiveStatus: boolean;
    serviceArm: string;
    remarks: string;
}

export interface UpdateRankMasterListData extends Partial<CreateRankMasterListData> { }

export interface RankMasterListFilters {
    // Add filters if needed, e.g. search query
    search?: string;
}
