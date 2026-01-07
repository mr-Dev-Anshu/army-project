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
}
