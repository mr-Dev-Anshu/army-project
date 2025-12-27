import { MPReport } from "@/models/InvestigationReport";

export class MPReportRepository {
  async create(data) {
    const report = new MPReport(data);
    return await report.save();
  }

  async findById(id) {
    return await MPReport.findById(id);
  }

  async findByReportNumber(reportNumber) {
    return await MPReport.findOne({ "reportDetails.reportNumber": reportNumber });
  }

  async findAll(query = {}) {
    return await MPReport.find(query) 
  }

  async updateById(id, data) {
    return await MPReport.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await MPReport.findByIdAndDelete(id);
  }
}