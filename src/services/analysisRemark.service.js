import {
  createRemarkRepo,
  findAllRemarksRepo,
  findRemarkByIdRepo,
  updateRemarkByIdRepo,
  deleteRemarkByIdRepo,
} from "@/reposetories/analysisRemark.repo";

export async function createAnalysisRemark(data) {
  return await createRemarkRepo(data);
}

export async function getAllAnalysisRemarks() {
  return await findAllRemarksRepo();
}

export async function getAnalysisRemarkById(id) {
  return await findRemarkByIdRepo(id);
}

export async function updateAnalysisRemark(id, data) {
  return await updateRemarkByIdRepo(id, data);
}

export async function deleteAnalysisRemark(id) {
  return await deleteRemarkByIdRepo(id);
}
