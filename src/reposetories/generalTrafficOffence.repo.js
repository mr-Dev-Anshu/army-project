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
}

export const generalTrafficOffenceRepo = new GeneralTrafficOffenceRepository();
