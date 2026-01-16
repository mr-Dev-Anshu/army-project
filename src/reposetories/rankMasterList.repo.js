import RankMasterList from "@/models/rankMasterList";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { RANK_MASTER_LIST_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/RankMasterList";

export async function createRankMasterListRepo(data) {
    const result = await new RankMasterList(data).save();
    // Track suggestions asynchronously
    trackFieldSuggestions(data, RANK_MASTER_LIST_SUGGESTION_CONFIG);
    return result;
}

export async function findAllRankMasterListsRepo() {
    return await RankMasterList.find({}).sort({ createdAt: -1 });
}

export async function findRankMasterListByIdRepo(id) {
    return await RankMasterList.findById(id);
}

export async function updateRankMasterListByIdRepo(id, data) {
    const result = await RankMasterList.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (result) {
        trackFieldSuggestions(data, RANK_MASTER_LIST_SUGGESTION_CONFIG);
    }
    return result;
}

export async function deleteRankMasterListByIdRepo(id) {
    return await RankMasterList.findByIdAndDelete(id);
}
