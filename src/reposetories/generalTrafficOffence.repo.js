import { GeneralTrafficOffence } from "../models/GeneralTraficOffence.js";
import mongoose from "mongoose";
export class GeneralTrafficOffenceRepository {
  async getAll() {
    const results = await GeneralTrafficOffence.aggregate([
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

  async getGroupedByOffenceType(queryParams = {}) {
    // Build dynamic match criteria based on provided query parameters
    const matchCriteria = {};

    // Filter by offenceTypes if provided (array field contains the value)
    if (queryParams.offenceType) {
      matchCriteria.offenceTypes = queryParams.offenceType;
    }

    // Filter by actionStatus if provided
    if (queryParams.status !== undefined) {
      matchCriteria.actionStatus = queryParams.status === 'true' || queryParams.status === true;
    }

    // Filter by vehicleType if provided
    if (queryParams.vehicleType) {
      matchCriteria.vehicleType = queryParams.vehicleType;
    }

    // Filter by vehicleCategory if provided
    if (queryParams.vehicleCategory) {
      matchCriteria.vehicleCategory = queryParams.vehicleCategory;
    }

    // Filter by isVehicleInvolved if provided
    if (queryParams.isVehicleInvolved !== undefined) {
      matchCriteria.isVehicleInvolved = queryParams.isVehicleInvolved === 'true' || queryParams.isVehicleInvolved === true;
    }

    // Build aggregation pipeline
    const pipeline = [];

    // Stage 1: Apply dynamic match filter only if query params exist
    if (Object.keys(matchCriteria).length > 0) {
      pipeline.push({
        $match: matchCriteria
      });
    }

    // Stage 2: Unwind offenceTypes array to create separate documents for each offence type
    pipeline.push({
      $unwind: {
        path: "$offenceTypes",
        preserveNullAndEmptyArrays: false // Exclude documents without offenceTypes
      }
    });

    // Stage 3: Group by offenceType and collect all related offence records
    pipeline.push({
      $group: {
        _id: "$offenceTypes", // Group by offence type
        offences: {
          $push: {
            _id: "$_id",
            isVehicleInvolved: "$isVehicleInvolved",
            vehicleCategory: "$vehicleCategory",
            vehicleType: "$vehicleType",
            vehicleNumber: "$vehicleNumber",
            vehicleName: "$vehicleName",
            onDutyDetails: "$onDutyDetails",
            onDutyDetailsMPReporting: "$onDutyDetailsMPReporting",
            offenceOccurenceDetails: "$offenceOccurenceDetails",
            offenceTypes: "$offenceTypes",
            offenceTypeReference: "$offenceTypeReference",
            actionStatus: "$actionStatus",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt"
          }
        },
        count: { $sum: 1 } // Count number of offences per type
      }
    });

    // Stage 4: Project final response format
    pipeline.push({
      $project: {
        _id: 0,
        offenceType: "$_id",
        count: 1,
        offences: 1
      }
    });

    // Stage 5: Sort by offenceType alphabetically
    pipeline.push({
      $sort: { offenceType: 1 }
    });

    const results = await GeneralTrafficOffence.aggregate(pipeline);
    return results;
  }
}

export const generalTrafficOffenceRepo = new GeneralTrafficOffenceRepository();
