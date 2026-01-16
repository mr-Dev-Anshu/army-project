import {
    createRankMasterListRepo,
    findAllRankMasterListsRepo,
    findRankMasterListByIdRepo,
    updateRankMasterListByIdRepo,
    deleteRankMasterListByIdRepo,
} from "@/reposetories/rankMasterList.repo";

export async function createRankMasterList(data) {
    return await createRankMasterListRepo(data);
}

export async function getAllRankMasterLists() {
    return await findAllRankMasterListsRepo();
}

export async function getRankMasterListById(id) {
    return await findRankMasterListByIdRepo(id);
}

export async function updateRankMasterList(id, data) {
    return await updateRankMasterListByIdRepo(id, data);
}

export async function deleteRankMasterList(id) {
    return await deleteRankMasterListByIdRepo(id);
}
