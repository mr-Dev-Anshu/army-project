import { MPReport } from "@/models/InvestigationReport";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { INVESTIGATION_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/investigationReport";

export class MPReportRepository {
  async create(data) {
    const report = new MPReport(data);
    const saved = await report.save();

    // Fire and forget suggestion tracking
    trackFieldSuggestions(saved.toObject(), INVESTIGATION_REPORT_SUGGESTION_CONFIG).catch(err => {
      console.error("Tracking Suggestions Error (MPReport):", err);
    });

    return saved;
  }

  async findById(id) {
    return await MPReport.findById(id);
  }

  async findByReportNumber(reportNumber) {
    return await MPReport.findOne({ "reportDetails.reportNumber": reportNumber });
  }

  async findAll(query = {}) {
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          offenders: {
            $filter: {
              input: { $ifNull: ["$individuals", []] },
              as: "individual",
              cond: { $eq: ["$$individual.role", "Offender"] }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ];
    return await MPReport.aggregate(pipeline);
  }

  async updateById(id, data) {
    return await MPReport.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await MPReport.findByIdAndDelete(id);
  }
}