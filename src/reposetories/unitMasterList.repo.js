import UnitMasterList from "@/models/unitMasterList";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { UNIT_MASTER_LIST_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/UnitMasterList";

export async function createUnitMasterListRepo(data) {
    const result = await new UnitMasterList(data).save();
    // Track suggestions asynchronously
    trackFieldSuggestions(data, UNIT_MASTER_LIST_SUGGESTION_CONFIG);
    return result;
}

export async function findAllUnitMasterListsRepo() {
    return await UnitMasterList.find({}).sort({ createdAt: -1 });
}

export async function findUnitMasterListByIdRepo(id) {
    return await UnitMasterList.findById(id);
}

export async function updateUnitMasterListByIdRepo(id, data) {
    const result = await UnitMasterList.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (result) {
        trackFieldSuggestions(data, UNIT_MASTER_LIST_SUGGESTION_CONFIG);
    }
    return result;
}

export async function deleteUnitMasterListByIdRepo(id) {
    return await UnitMasterList.findByIdAndDelete(id);
}
