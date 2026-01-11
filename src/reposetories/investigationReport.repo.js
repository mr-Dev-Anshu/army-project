import { MPReport } from "@/models/InvestigationReport";
import mongoose from "mongoose";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { INVESTIGATION_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/investigationReport";

export class MPReportRepository {

  /* ================= CREATE ================= */

  async create(data) {
    const report = new MPReport(data);
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

    /* ---------- UNIT & FMN FILTER ---------- */
    if (filters.unit || filters.fmn) {
      postLookupMatch.$or = [];

      if (filters.unit) {
        postLookupMatch.$or.push(
          { "reportDetails.unit": filters.unit },
          { "onDutyDetailsMPReporting.unit": filters.unit },
          { "offenders.offenderDetails.unit": filters.unit }
        );
      }

      if (filters.fmn) {
        postLookupMatch.$or.push(
          { "reportDetails.fmn": filters.fmn },
          { "offenders.offenderDetails.fmn": filters.fmn }
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
