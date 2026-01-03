// services/temporaryHiredWorkerService.js

import { createWorkerRepo, deleteWorkerByIdRepo, findAllWorkersRepo, findWorkerByIdRepo, updateWorkerByIdRepo } from "@/reposetories/temporaryHiredWorker.repo";

export async function createTemporaryHiredWorker(data) {
  return await createWorkerRepo(data);
}

export async function getAllTemporaryHiredWorkers() {
  return await findAllWorkersRepo();
}

export async function getTemporaryHiredWorkerById(id) {
  return await findWorkerByIdRepo(id);
}

export async function updateTemporaryHiredWorker(id, data) {
  return await updateWorkerByIdRepo(id, data);
}

export async function deleteTemporaryHiredWorker(id) {
  return await deleteWorkerByIdRepo(id);
}