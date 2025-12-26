import { GeneralTrafficOffence } from "../models/GeneralTraficOffence.js";
import mongoose from "mongoose";
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
      // Add counts
      {
        $addFields: {
          offendersCount: { $size: "$offenders" },
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          originalOffenceTypes: "$offenceTypes"  // Save original array before unwind
        }
      },
      // Unwind offenceTypes for grouping
      {
        $unwind: {
          path: "$offenceTypes",
          preserveNullAndEmptyArrays: true
        }
      },
      // Group by each offence type
      {
        $group: {
          _id: "$offenceTypes",
          totalOffences: { $sum: 1 },
          totalOffenders: { $sum: "$offendersCount" },
          totalWitnessingMps: { $sum: "$witnessingMpsCount" },
          offences: {
            $push: {
              _id: "$_id",
              offenceTypes: "$originalOffenceTypes",  // Restore full array!
              currentOffenceType: "$offenceTypes",     // The one this group is for
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
              vehicleName: "$vehicleName"
            }
          }
        }
      },
      // Sort groups alphabetically
      { $sort: { _id: 1 } },
      // Final projection
      {
        $project: {
          offenceType: "$_id",
          totalOffences: 1,
          totalOffenders: 1,
          totalWitnessingMps: 1,
          offences: 1,
          _id: 0
        }
      }
    ]);

    return results;
  }
  async getGroupedByOffenceType(filters = {}) {
    const matchStage = {};

    // 1. Handle filters that need type conversion or mapping
    if (filters.isVehicleInvolved !== undefined) {
      matchStage.isVehicleInvolved = filters.isVehicleInvolved === 'true';
    }

    if (filters.status !== undefined) {
      if (filters.status === 'true' || filters.status === 'Taken') matchStage.actionStatus = true;
      if (filters.status === 'false' || filters.status === 'Pending') matchStage.actionStatus = false;
    }

    if (filters.vehicleType) {
      matchStage.vehicleType = filters.vehicleType;
    }

    if (filters.vehicleCategory) {
      matchStage.vehicleCategory = filters.vehicleCategory;
    }

    // Filter by offence type (containment check before unwind)
    if (filters.offenceType && filters.offenceType !== 'All') {
      matchStage.offenceTypes = filters.offenceType;
    }

    const pipeline = [
      // Initial Match
      Object.keys(matchStage).length > 0 ? { $match: matchStage } : null,

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
          witnessingMpsCount: { $size: "$onDutyWitnessingMps" },
          originalOffenceTypes: "$offenceTypes"
        }
      },
      {
        $unwind: {
          path: "$offenceTypes",
          preserveNullAndEmptyArrays: true
        }
      },

      // Filter by offence type (strict match after unwind to isolate the group)
      (filters.offenceType && filters.offenceType !== 'All') ? { $match: { offenceTypes: filters.offenceType } } : null,

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
              vehicleName: "$vehicleName"
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          offenceType: "$_id",
          totalOffences: 1,
          totalOffenders: 1,
          totalWitnessingMps: 1,
          offences: 1,
          _id: 0
        }
      }
    ].filter(Boolean);

    const results = await GeneralTrafficOffence.aggregate(pipeline);
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
    console.log(data)
    const offence = new GeneralTrafficOffence(data);
    await offence.save();
    return offence.toObject();
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
