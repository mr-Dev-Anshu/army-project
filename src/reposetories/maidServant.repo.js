// repositories/maidServantSecurityPassRepository.js

import { MaidServantSecurityPass } from "@/models/MaidServant";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { MAID_SERVANT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/MaidServant";

export async function createMaidServantRepo(data) {
  const pass = new MaidServantSecurityPass(data);
  const result = await pass.save();
  trackFieldSuggestions(data, MAID_SERVANT_SUGGESTION_CONFIG);
  return result;
}

export async function findAllMaidServantRepo() {
  return await MaidServantSecurityPass.find({}).sort({ createdAt: -1 });
}

export async function findMaidServantByIdRepo(id) {
  return await MaidServantSecurityPass.findById(id);
}

export async function updateMaidServantByIdRepo(id, data) {
  const result = await MaidServantSecurityPass.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (result) {
    trackFieldSuggestions(data, MAID_SERVANT_SUGGESTION_CONFIG);
  }
  return result;
}

export async function deleteMaidServantByIdRepo(id) {
  return await MaidServantSecurityPass.findByIdAndDelete(id);
}