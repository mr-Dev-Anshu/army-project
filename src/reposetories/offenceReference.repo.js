import OffenceReference from "@/models/";

export class OffenceReferenceRepository {
  async findByQuery({ offenceType, search }) {
    const filter = {};

    if (offenceType) {
      filter.offenceType = offenceType.toLowerCase();
    }

    if (search) {
      filter.$or = [
        { offenceType: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    return await OffenceReference.find(filter).sort({ createdAt: -1 });
  }

  async groupByOffenceType() {
    return await OffenceReference.aggregate([
      {
        $group: {
          _id: "$offenceType",
          references: { $push: "$reference" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          offenceType: "$_id",
          references: 1,
          count: 1,
        },
      },
    ]);
  }

  async create(data) {
    return await OffenceReference.create(data);
  }
}
