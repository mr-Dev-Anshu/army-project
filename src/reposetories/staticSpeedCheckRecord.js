import { StaticSpeedCheckRecord } from "@/models/StaticSpeedCheckRecord";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { STATIC_SPEED_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/staticSpeedReport.js";

export class StaticSpeedCheckRecordRepository {
  async getAll() {
    const results = await StaticSpeedCheckRecord.aggregate([
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
        $sort: { createdAt: -1 }
      }
    ]);
    return results;
  }

  async getById(id) {
    const results = await StaticSpeedCheckRecord.aggregate([
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

  async create(data) {
    const record = new StaticSpeedCheckRecord(data);
    await record.save();
    const savedRecord = record.toObject();

    // Track field suggestions
    trackFieldSuggestions(data, STATIC_SPEED_REPORT_SUGGESTION_CONFIG)
      .then((res) => console.log(res, "suggestions tracked on speed check create"))
      .catch((err) => {
        console.error("Suggestions track karne mein error (SpeedCheck):", err);
      });

    return savedRecord;
  }

  async update(id, data) {
    return await StaticSpeedCheckRecord.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return await StaticSpeedCheckRecord.findByIdAndDelete(id).lean();
  }
}

export const staticSpeedCheckRecordRepo = new StaticSpeedCheckRecordRepository();