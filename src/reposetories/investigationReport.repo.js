import { MPReport } from "@/models/InvestigationReport";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { INVESTIGATION_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/investigationReport";
import { setCurrentUserId } from "@/lib/mongoose-plugins/auditsFields.js";

export class MPReportRepository {

  /* ================= CREATE ================= */

  async create(data, requestContext = null) {
    const report = new MPReport(data);

    // Attach audit information from request context if available
    if (requestContext && requestContext.userId) {
      report.createdBy = requestContext.userId;
      report.updatedBy = requestContext.userId;

      try {
        setCurrentUserId(requestContext.userId);
        console.log(
          "MPReportRepository - setCurrentUserId:",
          requestContext.userId
        );
      } catch (err) {
        console.error(
          "MPReportRepository - Failed to setCurrentUserId:",
          err
        );
      }
    }

    const saved = await report.save();

    trackFieldSuggestions(
      saved.toObject(),
      INVESTIGATION_REPORT_SUGGESTION_CONFIG
    ).catch((err) => {
      console.error("Tracking Suggestions Error (MPReport):", err);
    });

    return saved;
  }

  /* ================= FIND BY ID ================= */

  async findById(id) {
    const results = await MPReport.aggregate([
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
          refIds: {
            $map: {
              input: {
                $ifNull: ["$occurrenceDetails.offenceTypeReference", []],
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
          "occurrenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$occurrenceDetails.offenceTypeReference",
            },
          },
        },
      },
      { $limit: 1 },
    ]);

    return results.length > 0 ? results[0] : null;
  }

  /* ================= FIND ALL WITH FILTERS ================= */

  async findAll(filters = {}) {

    const postLookupMatch = {};

    /* ---------- UNIT & FMN & PLACE FILTER ---------- */
    // Note: We move these to post-lookup matching in the pipeline, but we define the logic here.
    // However, the `postLookupMatch` object is currently being assigned exact values.
    // Instead of building `postLookupMatch` object here, we will build a dynamic match stage inside the pipeline construction 
    // to handle regexes cleanly.

    /* ---------- DATE RANGE FILTER ---------- */
    // Date ranges should be kept in postLookupMatch for now, or moved too.
    if (filters.fromDate || filters.toDate) {
      postLookupMatch.createdAt = {};

      if (filters.fromDate) {
        postLookupMatch.createdAt.$gte = new Date(filters.fromDate);
      }

      if (filters.toDate) {
        postLookupMatch.createdAt.$lte = new Date(
          filters.toDate + "T23:59:59.999Z"
        );
      }
    }

    /* ---------- DATE RANGE FILTER ---------- */
    if (filters.fromDate || filters.toDate) {
      postLookupMatch.createdAt = {};

      if (filters.fromDate) {
        postLookupMatch.createdAt.$gte = new Date(filters.fromDate);
      }

      if (filters.toDate) {
        postLookupMatch.createdAt.$lte = new Date(
          filters.toDate + "T23:59:59.999Z"
        );
      }
    }

    const pipeline = [
      /* ---------- LOOKUPS FIRST ---------- */
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

      /* ================= DYNAMIC REGEX FILTER (UNIT/FMN/PLACE) ================= */
      (() => {
        const rules = [];

        if (filters.unit) {
          const regex = new RegExp(filters.unit, "i");
          rules.push({
            $or: [
              { "reportDetails.unit": { $regex: regex } },
              { "investigationHead.unit": { $regex: regex } },
              { "onDutyDetailsMPReporting.unit": { $regex: regex } },
              { "offenders.offenderDetails.unit": { $regex: regex } },
              { "individuals.unit": { $regex: regex } }
            ]
          });
        }

        if (filters.fmn) {
          const regex = new RegExp(filters.fmn, "i");
          rules.push({
            $or: [
              { "reportDetails.fmn": { $regex: regex } },
              { "investigationHead.fmn": { $regex: regex } },
              { "offenders.offenderDetails.fmn": { $regex: regex } },
              { "individuals.fmn": { $regex: regex } }
            ]
          });
        }

        if (filters.placeOfOffence) {
          const regex = new RegExp(filters.placeOfOffence, "i");
          rules.push({
            $or: [
              { "occurrenceDetails.placeOfOccurrence": { $regex: regex } },
              { "placeOfOccurrence": { $regex: regex } }, // legacy support
              { "onDutyDetailsMPReporting.place": { $regex: regex } },
              { "customFields.placeOfOffence": { $regex: regex } }
            ]
          });
        }

        return rules.length > 0 ? { $match: { $and: rules } } : null;
      })(),

      /* ---------- APPLY FILTERS AFTER LOOKUP ---------- */
      Object.keys(postLookupMatch).length
        ? { $match: postLookupMatch }
        : null,

      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          refIds: {
            $map: {
              input: {
                $ifNull: ["$occurrenceDetails.offenceTypeReference", []],
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
          "occurrenceDetails.offenceTypeReference": {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference",
                },
              },
              else: "$occurrenceDetails.offenceTypeReference",
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ].filter(Boolean);

    return await MPReport.aggregate(pipeline);
  }

  /* ================= UPDATE ================= */

  async updateById(id, data) {
    return await MPReport.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* ================= DELETE ================= */

  async deleteById(id) {
    return await MPReport.findByIdAndDelete(id);
  }
}
