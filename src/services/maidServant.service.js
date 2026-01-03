// services/maidServantSecurityPassService.js
import {
  createMaidServantRepo,
  findAllMaidServantRepo,
  findMaidServantByIdRepo,
  updateMaidServantByIdRepo,
  deleteMaidServantByIdRepo,
} from "@/reposetories/maidServant.repo";

export async function createMaidServantSecurityPass(data) {
  return await createMaidServantRepo(data);
}

export async function getAllMaidServantSecurityPasses() {
  return await findAllMaidServantRepo();
}

export async function getMaidServantSecurityPassById(id) {
  return await findMaidServantByIdRepo(id);
}

export async function updateMaidServantSecurityPass(id, data) {
  return await updateMaidServantByIdRepo(id, data);
}

export async function deleteMaidServantSecurityPass(id) {
  return await deleteMaidServantByIdRepo(id);
}