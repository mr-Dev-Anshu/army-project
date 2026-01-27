import { MPReportRepository } from "@/reposetories/investigationReport.repo";

const repo = new MPReportRepository();

export class MPReportService {
  async createReport(data) {
    return await repo.create(data);
  }

  async getReportById(id) {
    const report = await repo.findById(id);
    if (!report) throw new Error("Report not found");
    return report;
  }

  async getAllReports(filters = {}) {
    return await repo.findAll(filters);
  }

async updateReport(id, data) {
  // 1️⃣ Check duplicate report number
  if (data.reportDetails?.reportNumber) {
    const existing = await repo.findByReportNumber(
      data.reportDetails.reportNumber
    );

    if (existing && existing._id.toString() !== id) {
      throw new Error("Report number already exists");
    }
  }

  const { certificates, ...restData } = data;

  let updated = null;

  // 2️⃣ Append certificates (NOT replace)
  if (certificates?.length) {
    updated = await repo.appendCertificates(id, certificates);
  }

  // 3️⃣ Update other fields normally
  if (Object.keys(restData).length) {
    updated = await repo.updateById(id, restData);
  }

  if (!updated) throw new Error("Report not found");

  return updated;
}


  async deleteReport(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) throw new Error("Report not found");
    return { success: true };
  }
}