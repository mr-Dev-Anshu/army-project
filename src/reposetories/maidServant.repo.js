// repositories/maidServantSecurityPassRepository.js

import { MaidServantSecurityPass } from "@/models/MaidServant";

export async function createMaidServantRepo(data) {
  const pass = new MaidServantSecurityPass(data);
  return await pass.save();
}

export async function findAllMaidServantRepo() {
  return await MaidServantSecurityPass.find({}).sort({ createdAt: -1 });
}

export async function findMaidServantByIdRepo(id) {
  return await MaidServantSecurityPass.findById(id);
}

export async function updateMaidServantByIdRepo(id, data) {
  return await MaidServantSecurityPass.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteMaidServantByIdRepo(id) {
  return await MaidServantSecurityPass.findByIdAndDelete(id);
}