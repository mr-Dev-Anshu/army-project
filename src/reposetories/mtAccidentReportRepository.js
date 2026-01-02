import { MTAccidentReport } from "@/models/MTAccidentReport";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { MT_ACCIDENT_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/mtAccidentReport.js";

export class MTAccidentReportRepository {
  async getAll() {
    console.log("MTAccidentReportRepository.getAll() called");
    const results = await MTAccidentReport.aggregate([
      {
        $sort: { createdAt: -1 }
      }
    ]);
    console.log("MTAccidentReportRepository.getAll() - results count:", results?.length || 0);
    console.log("MTAccidentReportRepository.getAll() - results:", results);
    return results;
  }

  async getById(id) {
    const results = await MTAccidentReport.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $limit: 1
      }
    ]);

    return results.length > 0 ? results[0] : null;
  }

  async create(data) {
    const report = new MTAccidentReport(data);
    await report.save();
    const savedReport = report.toObject();

    // Track field suggestions
    trackFieldSuggestions(data, MT_ACCIDENT_REPORT_SUGGESTION_CONFIG)
      .then((res) => console.log(res, "suggestions tracked on MT accident create"))
      .catch((err) => {
        console.error("Suggestions track karne mein error (MTAccident):", err);
      });

    return savedReport;
  }

  async update(id, data) {
    return await MTAccidentReport.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return await MTAccidentReport.findByIdAndDelete(id).lean();
  }
}

export const mtAccidentReportRepo = new MTAccidentReportRepository();

// Legacy exports for backward compatibility
export async function createMTAccidentRepo(data) {
  return mtAccidentReportRepo.create(data);
}

export async function findAllMTAccidentsRepo() {
  return mtAccidentReportRepo.getAll();
}

export async function findMTAccidentByIdRepo(id) {
  return mtAccidentReportRepo.getById(id);
}

export async function updateMTAccidentByIdRepo(id, data) {
  return mtAccidentReportRepo.update(id, data);
}

export async function deleteMTAccidentByIdRepo(id) {
  return mtAccidentReportRepo.delete(id);
}