import { StaticSpeedCheckRecord } from "@/models/StaticSpeedCheckRecord";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { STATIC_SPEED_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/staticSpeedReport.js";

export class StaticSpeedCheckRecordRepository {

  /* ========================= GET ALL (UNCHANGED) ========================= */

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

  /* ========================= GET BY ID (UNCHANGED) ========================= */

  async getById(id) {
    const results = await StaticSpeedCheckRecord.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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

  /* ========================= FILTERED QUERY (NEW – SAFE) ========================= */

  async getFilteredRecords(filters = {}) {
    const matchStage = {};

    /* ---------- DATE RANGE (PRIORITY) ---------- */
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

    /* ---------- SINGLE DATE (FALLBACK) ---------- */
    else if (filters.date) {
      const dateStr = filters.date.split("T")[0];

      const startDate = new Date(dateStr);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(dateStr);
      endDate.setUTCHours(23, 59, 59, 999);

      matchStage.$or = [
        { createdAt: { $gte: startDate, $lte: endDate } },
        {
          "offenceOccurenceDetails.timeOfOffence": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ];
    }

    /* ---------- UNIT FILTER ---------- */
    if (filters.unit) {
      matchStage.$or = [
        { "onDutyDetailsMPReporting.unit": filters.unit },
        { "offenders.offenderDetails.unit": filters.unit },
      ];
    }

    /* ---------- FMN FILTER ---------- */
    if (filters.fmn) {
      matchStage.$or = [
        { fmn: filters.fmn },
        { "offenders.offenderDetails.fmn": filters.fmn },
      ];
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

  /* ========================= CREATE (UNCHANGED) ========================= */

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
