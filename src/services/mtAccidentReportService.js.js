// services/mtAccidentReportService.js
import {
  createMTAccidentRepo,
  findAllMTAccidentsRepo,
  findMTAccidentByIdRepo,
  updateMTAccidentByIdRepo,
  deleteMTAccidentByIdRepo,
} from "@/repositories/mtAccidentReportRepository";

export async function createMTAccidentReport(data) {
  return await createMTAccidentRepo(data);
}

export async function getAllMTAccidentReports() {
  return await findAllMTAccidentsRepo();
}

export async function getMTAccidentReportById(id) {
  return await findMTAccidentByIdRepo(id);
}

export async function updateMTAccidentReport(id, data) {
  return await updateMTAccidentByIdRepo(id, data);
}

export async function deleteMTAccidentReport(id) {  // ← THIS MUST EXIST
  return await deleteMTAccidentByIdRepo(id);
}