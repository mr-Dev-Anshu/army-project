// services/mtAccidentReportService.js
import {
  createMTAccidentRepo,
  findAllMTAccidentsRepo,
  findMTAccidentByIdRepo,
  updateMTAccidentByIdRepo,
  deleteMTAccidentByIdRepo,
} from "@/reposetories/mtAccidentReportRepository";

/* ================= CREATE ================= */
export async function createMTAccidentReport(data) {
  try {
    console.log("🟡 Service received payload:", data);

    const saved = await createMTAccidentRepo(data);

    console.log("🟢 Service saved report:", saved?._id);

    return saved;
  } catch (error) {
    console.error("🔴 Service create error:", error);
    throw error;
  }
}

/* ================= GET ALL ================= */
export async function getAllMTAccidentReports() {
  try {
    console.log("🟡 Service: fetching all MT accidents");
    return await findAllMTAccidentsRepo();
  } catch (err) {
    console.error("🔥 Service GET error:", err);
    throw err;
  }
}

/* ================= GET BY ID ================= */
export async function getMTAccidentReportById(id) {
  return await findMTAccidentByIdRepo(id);
}

/* ================= UPDATE ================= */
export async function updateMTAccidentReport(id, data) {
  return await updateMTAccidentByIdRepo(id, data);
}

/* ================= DELETE ================= */
export async function deleteMTAccidentReport(id) {
  return await deleteMTAccidentByIdRepo(id);
}