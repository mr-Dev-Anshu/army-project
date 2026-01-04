// src/repositories/mtAccidentReportRepository.js
import { MTAccidentReport } from "@/models/MTAccidentReport";

export async function createMTAccidentRepo(data) {
  const report = new MTAccidentReport(data);
  return await report.save();
}

export async function findAllMTAccidentsRepo() {
  return await MTAccidentReport.find({}).sort({ createdAt: -1 });
}

export async function findMTAccidentByIdRepo(id) {
  return await MTAccidentReport.findById(id);
}

export async function updateMTAccidentByIdRepo(id, data) {
  return await MTAccidentReport.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteMTAccidentByIdRepo(id) {
  return await MTAccidentReport.findByIdAndDelete(id);
}