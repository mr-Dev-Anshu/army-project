import { MPReport } from "@/models/InvestigationReport";
import mongoose from "mongoose";
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
    const results = await MPReport.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders"
        }
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps"
        }
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" }
        }
      },
      {
        $limit: 1
      }
    ]);

    return results.length > 0 ? results[0] : null;
  }

  async findByReportNumber(reportNumber) {
    const results = await MPReport.aggregate([
      {
        $match: {
          "reportDetails.reportNumber": reportNumber
        }
      },
      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders"
        }
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps"
        }
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" }
        }
      },
      {
        $limit: 1
      }
    ]);

    return results.length > 0 ? results[0] : null;
  }

  async findAll(query = {}) {
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders"
        }
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps"
        }
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" }
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