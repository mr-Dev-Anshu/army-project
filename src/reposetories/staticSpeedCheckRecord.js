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
          refIds: {
            $map: {
              input: {
                $ifNull: ["$offenceOccurenceDetails.offenceTypeReference", []],
              },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          "offenceOccurenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$offenceOccurenceDetails.offenceTypeReference",
            },
          },
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
          refIds: {
            $map: {
              input: {
                $ifNull: ["$offenceOccurenceDetails.offenceTypeReference", []],
              },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          "offenceOccurenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$offenceOccurenceDetails.offenceTypeReference",
            },
          },
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
          "offenceOccurenceDetails.time": {
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

    // Support existing logic
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
          refIds: {
            $map: {
              input: {
                $ifNull: ["$offenceOccurenceDetails.offenceTypeReference", []],
              },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          "offenceOccurenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$offenceOccurenceDetails.offenceTypeReference",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ].filter(Boolean);

    return await StaticSpeedCheckRecord.aggregate(pipeline);
  }

  async getGroupedByOffenceType(filters = {}) {
    const matchStage = {};

    /* ================= STATUS FILTERS ================= */
    if (filters.status !== undefined) {
      if (filters.status === "true" || filters.status === "Taken") {
        matchStage.actionStatus = true;
      }
      if (filters.status === "false" || filters.status === "Pending") {
        matchStage.actionStatus = false;
      }
    }

    //  unit and fmn
    if (filters.unit) {
      matchStage["onDutyDetailsMPReporting.unit"] = filters.unit;
    }

    // FMN isn't directly on static speed, usually inside offender or mapped manually
    // but assuming structure similar to traffic:
    // matchStage["customFields.fmn"] = filters.fmn; // If applicable

    if (filters.vehicleCategory) {
      matchStage.vehicleCategory = filters.vehicleCategory;
    }

    /* ================= DATE FILTER ================= */
    if (filters.fromDate || filters.toDate) {
      matchStage.createdAt = {};
      if (filters.fromDate) {
        matchStage.createdAt.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        matchStage.createdAt.$lte = new Date(filters.toDate + "T23:59:59.999Z");
      }
    } else if (filters.date) {
      const dateStr = filters.date.split("T")[0];
      const startDate = new Date(dateStr);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(dateStr);
      endDate.setUTCHours(23, 59, 59, 999);

      matchStage.$or = [
        { "offenceOccurenceDetails.time": { $gte: startDate, $lte: endDate } },
        { createdAt: { $gte: startDate, $lte: endDate } },
      ];
    }

    /* ================= OFFENCE TYPE (PRE-UNWIND) ================= */
    if (filters.offenceType && filters.offenceType !== "All") {
      matchStage["offenceOccurenceDetails.offenceTypes"] = filters.offenceType;
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
          refIds: {
            $map: {
              input: {
                $ifNull: ["$offenceOccurenceDetails.offenceTypeReference", []],
              },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs",
        },
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          originalOffenceTypes: "$offenceOccurenceDetails.offenceTypes",
          "offenceOccurenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$offenceOccurenceDetails.offenceTypeReference",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$offenceOccurenceDetails.offenceTypes",
          preserveNullAndEmptyArrays: true,
        },
      },
      // STRICT FILTER AFTER UNWIND
      filters.offenceType && filters.offenceType !== "All"
        ? {
          $match: {
            "offenceOccurenceDetails.offenceTypes": filters.offenceType,
          },
        }
        : null,

      {
        $group: {
          _id: "$offenceOccurenceDetails.offenceTypes",
          totalOffences: { $sum: 1 },
          totalOffenders: { $sum: "$offendersCount" },
          totalWitnessingMps: { $sum: "$witnessingMpsCount" },
          offences: {
            $push: {
              _id: "$_id",
              offenceTypes: "$originalOffenceTypes",
              currentOffenceType: "$offenceOccurenceDetails.offenceTypes",
              createdAt: "$createdAt",
              vehicleNumber: "$vehicleNumber",
              vehicleCategory: "$vehicleCategory",
              offenceOccurenceDetails: "$offenceOccurenceDetails",
              offenders: "$offenders",
              onDutyWitnessingMps: "$onDutyWitnessingMps",
              offendersCount: "$offendersCount",
              witnessingMpsCount: "$witnessingMpsCount",
              customFields: "$customFields",
              onDutyDetails: "$onDutyDetails",
              onDutyDetailsMPReporting: "$onDutyDetailsMPReporting",
              actionStatus: "$actionStatus",
              vehicleName: "$vehicleName",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          offenceType: "$_id",
          totalOffences: 1,
          totalOffenders: 1,
          totalWitnessingMps: 1,
          offences: 1,
          _id: 0,
        },
      },
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
