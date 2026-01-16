import { OffenceReferenceRepository } from "@/reposetories/offenceReference.repo";

const repo = new OffenceReferenceRepository();

export class OffenceReferenceService {
  async getAll(query) {
    if (query.groupBy === "offenceType") {
      return await repo.groupByOffenceType();
    }
    return await repo.findByQuery(query);
  }

  async create(data) {
    return await repo.create(data);
  }

  async delete(query) {
    if (query.offenceType) {
      return await repo.deleteByOffenceType(query.offenceType);
    }
    if (query.id) {
      return await repo.deleteById(query.id);
    }
    throw new Error("Invalid delete request");
  }

  async updateReferences(offenceType, references) {
    // Transactional-like behavior: Delete all for type, then create new ones
    await repo.deleteByOffenceType(offenceType);

    // Ensure all new references have the correct offenceType
    const payload = references.map(ref => ({
      offenceType: offenceType,
      reference: ref
    }));

    return await repo.create(payload);
  }
}
