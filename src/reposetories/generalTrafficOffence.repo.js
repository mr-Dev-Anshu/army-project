import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { GeneralTrafficOffence } from "../models/GeneralTraficOffence.js";
import mongoose from "mongoose";
import { GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/GeneralTraficOffence.js";

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
            $map: {
              input: "$resolvedRefs",
              as: "r",
              in: "$$r.reference"
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
            $map: {
              input: "$resolvedRefs",
              as: "r",
              in: "$$r.reference"
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

    //  unit and fmn

    if (filters.unit) {
      matchStage["customFields.unit"] = filters.unit;
    }

    if (filters.fmn) {
      matchStage["customFields.fmn"] = filters.fmn;
    }

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

    if (filters.offenceType && filters.offenceType !== "All") {
      matchStage.offenceTypes = filters.offenceType;
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
            $map: {
              input: "$resolvedRefs",
              as: "r",
              in: "$$r.reference"
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
        ? { $match: { offenceTypes: filters.offenceType } }
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

    return await GeneralTrafficOffence.aggregate(pipeline);
  }



  async create(data) {
    console.log(data);
    const offence = new GeneralTrafficOffence(data);
    await offence.save();
    const savedOffence = offence.toObject();

    // Track field suggestions (from feature branch)
    trackFieldSuggestions(data, GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG)
      .then((res) => console.log(res, "suggestions tracked on create"))
      .catch((err) => {
        console.error("Suggestions track karne mein error:", err);
      });

    return savedOffence;
  }

  async update(id, data) {
    return await GeneralTrafficOffence.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return await GeneralTrafficOffence.findByIdAndDelete(id).lean();
  }
}

export const generalTrafficOffenceRepo = new GeneralTrafficOffenceRepository();