import { StaticSpeedCheckRecord } from "@/models/StaticSpeedCheckRecord";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { STATIC_SPEED_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/staticSpeedReport.js";

export class StaticSpeedCheckRecordRepository {

  /* ========================= GET ALL ========================= */

  async getAll() {
    return await StaticSpeedCheckRecord.aggregate([
      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders",
        },
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }

  /* ========================= GET BY ID ========================= */

  async getById(id) {
    const results = await StaticSpeedCheckRecord.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders",
        },
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
        },
      },
      { $limit: 1 },
    ]);

    return results.length > 0 ? results[0] : null;
  }

  /* ========================= DATE RANGE FILTER (NEW) ========================= */

  async getByDateRange(filters = {}) {
    const matchStage = {};

    // ✅ Start → End Date filter
    if (filters.fromDate || filters.toDate) {
      matchStage.createdAt = {};

      if (filters.fromDate) {
        matchStage.createdAt.$gte = new Date(filters.fromDate);
      }

      if (filters.toDate) {
        matchStage.createdAt.$lte = new Date(
          filters.toDate + "T23:59:59.999Z"
        );
      }
    }

    const pipeline = [
      Object.keys(matchStage).length > 0 ? { $match: matchStage } : null,

      {
        $lookup: {
          from: "offenders",
          localField: "_id",
          foreignField: "offenceId",
          as: "offenders",
        },
      },
      {
        $lookup: {
          from: "ondutywitnessingmps",
          localField: "_id",
          foreignField: "offenceId",
          as: "onDutyWitnessingMps",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
        },
      },
      { $sort: { createdAt: -1 } },
    ].filter(Boolean);

    return await StaticSpeedCheckRecord.aggregate(pipeline);
  }

  /* ========================= CREATE ========================= */

  async create(data) {
    const record = new StaticSpeedCheckRecord(data);
    await record.save();
    const savedRecord = record.toObject();

    trackFieldSuggestions(data, STATIC_SPEED_REPORT_SUGGESTION_CONFIG)
      .then((res) =>
        console.log(res, "suggestions tracked on speed check create")
      )
      .catch((err) => {
        console.error("Suggestion tracking error (SpeedCheck):", err);
      });

    return savedRecord;
  }

  /* ========================= UPDATE ========================= */

  async update(id, data) {
    return await StaticSpeedCheckRecord.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  /* ========================= DELETE ========================= */

  async delete(id) {
    return await StaticSpeedCheckRecord.findByIdAndDelete(id).lean();
  }
}

export const staticSpeedCheckRecordRepo =
  new StaticSpeedCheckRecordRepository();
