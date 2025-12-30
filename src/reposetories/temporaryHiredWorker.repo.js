import {TemporaryHiredWorker} from "@/models/TemporaryHiredWorker";

export async function createWorkerRepo(data) {
  const worker = new TemporaryHiredWorker(data);
  return await worker.save();
}

export async function findAllWorkersRepo() {
  return await TemporaryHiredWorker.find({}).sort({ createdAt: -1 });
}

export async function findWorkerByIdRepo(id) {
  return await TemporaryHiredWorker.findById(id);
}

export async function updateWorkerByIdRepo(id, data) {
  return await TemporaryHiredWorker.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteWorkerByIdRepo(id) {
  return await TemporaryHiredWorker.findByIdAndDelete(id);
}