import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { GeneralTrafficOffence } from "../models/GeneralTraficOffence.js";
import mongoose from "mongoose";
import { GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/GeneralTraficOffence.js";
import { setCurrentUserId } from "@/lib/mongoose-plugins/auditsFields.js";

export class GeneralTrafficOffenceRepository {
  async getAll() {
    const results = await GeneralTrafficOffence.aggregate([
      // Join related collections
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
          refIds: {
            $map: {
              input: { $ifNull: ["$offenceTypeReference", []] },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs"
        }
      },
      // Add counts and resolved references
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          offenceTypeReference: {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference"
                }
              },
              else: "$offenceTypeReference"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    return results;
  }

  async getById(id) {
    const results = await GeneralTrafficOffence.aggregate([
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
          refIds: {
            $map: {
              input: { $ifNull: ["$offenceTypeReference", []] },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs"
        }
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          offenceTypeReference: {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference"
                }
              },
              else: "$offenceTypeReference"
            }
          }
        }
      },
      {
        $limit: 1
      }
    ]);
    return results.length > 0 ? results[0] : null;
  }

  async getGroupedByOffenceType(filters = {}) {

    const matchStage = {};

    /* ================= VEHICLE / STATUS FILTERS ================= */

    if (filters.isVehicleInvolved !== undefined) {
      matchStage.isVehicleInvolved = filters.isVehicleInvolved === "true";
    }

    if (filters.status !== undefined) {
      if (filters.status === "true" || filters.status === "Taken") {
        matchStage.actionStatus = true;
      }
      if (filters.status === "false" || filters.status === "Pending") {
        matchStage.actionStatus = false;
      }
    }

    /* 
       NOTE: Unit, FMN, and Place filters are now moved to postLookupMatch 
       because they might depend on looked-up fields (e.g., offenders).
    */

    if (filters.vehicleType) {
      matchStage.vehicleType = filters.vehicleType;
    }

    if (filters.vehicleCategory) {
      matchStage.vehicleCategory = filters.vehicleCategory;
    }

    /* ================= DATE FILTER (FIXED – NO CONFLICT) ================= */

    // PRIORITY 1: Start → End Date
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

    // PRIORITY 2: Single Date (ONLY if from/to not present)
    else if (filters.date) {
      const dateStr = filters.date.split("T")[0];
      const startDate = new Date(dateStr);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(dateStr);
      endDate.setUTCHours(23, 59, 59, 999);

      matchStage.$or = [
        {
          "offenceOccurenceDetails.timeOfOffence": {
            $gte: startDate,
            $lte: endDate,
          },
        },
        {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ];
    }

    /* ================= OFFENCE TYPE (PRE-UNWIND FILTER) ================= */

    /* ================= OFFENCE TYPE (PRE-UNWIND FILTER) ================= */

    if (filters.offenceType && filters.offenceType !== "All") {
      matchStage.offenceTypes = { $in: filters.offenceType.split(",") };
    }

    /* ================= AGGREGATION PIPELINE ================= */

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

      /* ================= POST LOOKUP FILTERS ================= */
      (() => {
        const rules = [];

        if (filters.unit) {
          const pattern = filters.unit.split(',').map(s => s.trim()).join('|');
          const regex = new RegExp(pattern, "i");
          rules.push({
            $or: [
              { "customFields.unit": { $regex: regex } },
              { "onDutyDetailsMPReporting.unit": { $regex: regex } },
              { "offenders.offenderDetails.unit": { $regex: regex } },
              { "offenders.offenderDetails.unitName": { $regex: regex } }
            ]
          });
        }

        if (filters.fmn) {
          const pattern = filters.fmn.split(',').map(s => s.trim()).join('|');
          const regex = new RegExp(pattern, "i");
          rules.push({
            $or: [
              { "customFields.fmn": { $regex: regex } },
              { "offenders.offenderDetails.fmn": { $regex: regex } }
            ]
          });
        }

        if (filters.placeOfOffence) {
          const pattern = filters.placeOfOffence.split(',').map(s => s.trim()).join('|');
          const regex = new RegExp(pattern, "i");
          rules.push({
            $or: [
              { "customFields.placeOfOffence": { $regex: regex } },
              { "onDutyDetails.dutyLocation": { $regex: regex } },
              { "offenceOccurenceDetails.incidentLocation": { $regex: regex } }
            ]
          });
        }

        return rules.length > 0 ? { $match: { $and: rules } } : null;
      })(),

      {
        $addFields: {
          refIds: {
            $map: {
              input: { $ifNull: ["$offenceTypeReference", []] },
              as: "rid",
              in: {
                $convert: {
                  input: "$$rid",
                  to: "objectId",
                  onError: null,
                  onNull: null
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "offencereferences",
          localField: "refIds",
          foreignField: "_id",
          as: "resolvedRefs"
        }
      },
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          originalOffenceTypes: "$offenceTypes",
          offenceTypeReference: {
            $cond: {
              if: { $gt: [{ $size: "$resolvedRefs" }, 0] },
              then: {
                $map: {
                  input: "$resolvedRefs",
                  as: "r",
                  in: "$$r.reference"
                }
              },
              else: "$offenceTypeReference"
            }
          }
        },
      },

      {
        $unwind: {
          path: "$offenceTypes",
          preserveNullAndEmptyArrays: true,
        },
      },

      // STRICT offenceType filter AFTER unwind
      filters.offenceType && filters.offenceType !== "All"
        ? { $match: { offenceTypes: { $in: filters.offenceType.split(",") } } }
        : null,

      {
        $group: {
          _id: "$offenceTypes",
          totalOffences: { $sum: 1 },
          totalOffenders: { $sum: "$offendersCount" },
          totalWitnessingMps: { $sum: "$witnessingMpsCount" },
          offences: {
            $push: {
              _id: "$_id",
              offenceTypes: "$originalOffenceTypes",
              currentOffenceType: "$offenceTypes",
              createdAt: "$createdAt",
              vehicleNumber: "$vehicleNumber",
              isVehicleInvolved: "$isVehicleInvolved",
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
              reportId: "$reportId",
              offenceTypeReference: "$offenceTypeReference",
              resolvedRefs: "$resolvedRefs",
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

    /* ================= EXECUTE ================= */

    const results = await GeneralTrafficOffence.aggregate(pipeline);
    return results;
  }

  async update(id, data) {
    console.log(data);
    
    return await GeneralTrafficOffence.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  /* ========================= CREATE ========================= */

  async create(data, requestContext = null) {
    const record = new GeneralTrafficOffence(data);

    if (requestContext && requestContext.userId) {
      record.createdBy = requestContext.userId;
      record.updatedBy = requestContext.userId;

      try {
        setCurrentUserId(requestContext.userId);
        console.log(
          "GeneralTrafficOffenceRepository - setCurrentUserId:",
          requestContext.userId
        );
      } catch (err) {
        console.error(
          "GeneralTrafficOffenceRepository - Failed to setCurrentUserId:",
          err
        );
      }
    }

    await record.save();
    const saved = record.toObject();

    trackFieldSuggestions(data, GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG)
      .then((res) => console.log(res, "suggestions tracked on general offence create"))
      .catch((err) => console.error("Suggestion tracking error (GeneralOffence):", err));

    return saved;
  }

  async delete(id) {
    return await GeneralTrafficOffence.findByIdAndDelete(id).lean();
  }
    async appendCertificates(id, certificates) {
    return await GeneralTrafficOffence.findByIdAndUpdate(
      id,
      {
        $push: {
          certificates: { $each: certificates },
        },
      },
      { new: true, runValidators: true }
    );
  }
}

export const generalTrafficOffenceRepo = new GeneralTrafficOffenceRepository();