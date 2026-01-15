import {
    createUnitMasterListRepo,
    findAllUnitMasterListsRepo,
    findUnitMasterListByIdRepo,
    updateUnitMasterListByIdRepo,
    deleteUnitMasterListByIdRepo
} from "@/reposetories/unitMasterList.repo";

export async function createUnitMasterList(data) {
    return await createUnitMasterListRepo(data);
}

export async function getAllUnitMasterLists() {
    return await findAllUnitMasterListsRepo();
}

export async function getUnitMasterListById(id) {
    return await findUnitMasterListByIdRepo(id);
}

export async function updateUnitMasterList(id, data) {
    return await updateUnitMasterListByIdRepo(id, data);
}

export async function deleteUnitMasterList(id) {
    return await deleteUnitMasterListByIdRepo(id);
}
