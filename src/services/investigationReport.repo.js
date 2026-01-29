import { MPReportRepository } from "@/reposetories/investigationReport.repo";

const repo = new MPReportRepository();

export class MPReportService {
  async createReport(data, requestContext = null) {
    return await repo.create(data, requestContext);
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
    // Check if report number matches existing if updating report number
    if (data.reportDetails?.reportNumber) {
      const existing = await repo.findByReportNumber(data.reportDetails.reportNumber);
      if (existing && existing._id.toString() !== id) {
        throw new Error("Report number already exists");
      }
    }
    const updated = await repo.updateById(id, data);
    if (!updated) throw new Error("Report not found");
    return updated;
  }

  async deleteReport(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) throw new Error("Report not found");
    return { success: true };
  }
}