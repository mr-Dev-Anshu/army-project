import { StaticSpeedCheckRecord } from "@/models/StaticSpeedCheckRecord";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { STATIC_SPEED_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/staticSpeedReport.js";
import { setCurrentUserId } from "@/lib/mongoose-plugins/auditsFields.js";

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

    /* ---------- UNIT & FMN FILTER (Moved to Post-Lookup) ---------- */
    // Logic moved to pipeline for regex support and lookup access

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

      /* ================= DYNAMIC REGEX FILTER (UNIT/FMN) ================= */
      (() => {
        const rules = [];

        if (filters.unit) {
          const regex = new RegExp(filters.unit, "i");
          rules.push({
            $or: [
              { "onDutyDetailsMPReporting.unit": { $regex: regex } },
              { "offenders.offenderDetails.unit": { $regex: regex } }
            ]
          });
        }

        if (filters.fmn) {
          const regex = new RegExp(filters.fmn, "i");
          rules.push({
            $or: [
              { "fmn": { $regex: regex } }, // Assuming fmn might be at root or customFields
              { "offenders.offenderDetails.fmn": { $regex: regex } }
            ]
          });
        }

        if (filters.placeOfOffence) {
          const regex = new RegExp(filters.placeOfOffence, "i");
          rules.push({
            $or: [
              { "offenceOccurenceDetails.incidentLocation": { $regex: regex } },
              { "onDutyDetails.dutyLocation": { $regex: regex } }
            ]
          });
        }

        return rules.length > 0 ? { $match: { $and: rules } } : null;
      })(),
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

    //  unit and fmn (MOVED TO POST-LOOKUP)
    // if (filters.unit) {
    //   matchStage["onDutyDetailsMPReporting.unit"] = filters.unit;
    // }

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

      /* ================= DYNAMIC REGEX FILTER (UNIT/FMN) ================= */
      (() => {
        const rules = [];

        if (filters.unit) {
          const regex = new RegExp(filters.unit, "i");
          rules.push({
            $or: [
              { "onDutyDetailsMPReporting.unit": { $regex: regex } },
              { "offenders.offenderDetails.unit": { $regex: regex } }
            ]
          });
        }

        if (filters.fmn) {
          const regex = new RegExp(filters.fmn, "i");
          rules.push({
            $or: [
              { "fmn": { $regex: regex } },
              { "offenders.offenderDetails.fmn": { $regex: regex } }
            ]
          });
        }

        if (filters.placeOfOffence) {
          const regex = new RegExp(filters.placeOfOffence, "i");
          rules.push({
            $or: [
              { "offenceOccurenceDetails.incidentLocation": { $regex: regex } },
              { "onDutyDetails.dutyLocation": { $regex: regex } }
            ]
          });
        }

        return rules.length > 0 ? { $match: { $and: rules } } : null;
      })(),
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

  /* ========================= CREATE ========================= */

  async create(data, requestContext = null) {
    const record = new StaticSpeedCheckRecord(data);

    // If we have request context with user ID, set audit fields and plugin context
    if (requestContext && requestContext.userId) {
      record.createdBy = requestContext.userId;
      record.updatedBy = requestContext.userId;

      try {
        setCurrentUserId(requestContext.userId);
        console.log(
          "StaticSpeedCheckRecordRepository - setCurrentUserId:",
          requestContext.userId
        );
      } catch (err) {
        console.error(
          "StaticSpeedCheckRecordRepository - Failed to setCurrentUserId:",
          err
        );
      }
    }

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
