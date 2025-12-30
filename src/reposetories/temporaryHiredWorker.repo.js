import { TemporaryHiredWorker } from "@/models/TemporaryHiredWorker";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { TEMPORARY_HIRED_WORKER_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/TemporaryHiredWorker";

export async function createWorkerRepo(data) {
  const worker = new TemporaryHiredWorker(data);
  const result = await worker.save();
  // Track suggestions asynchronously
  trackFieldSuggestions(data, TEMPORARY_HIRED_WORKER_SUGGESTION_CONFIG);
  return result;
}

export async function findAllWorkersRepo() {
  return await TemporaryHiredWorker.find({}).sort({ createdAt: -1 });
}

export async function findWorkerByIdRepo(id) {
  return await TemporaryHiredWorker.findById(id);
}

export async function updateWorkerByIdRepo(id, data) {
  const result = await TemporaryHiredWorker.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (result) {
    trackFieldSuggestions(data, TEMPORARY_HIRED_WORKER_SUGGESTION_CONFIG);
  }
  return result;
}

export async function deleteWorkerByIdRepo(id) {
  return await TemporaryHiredWorker.findByIdAndDelete(id);
}