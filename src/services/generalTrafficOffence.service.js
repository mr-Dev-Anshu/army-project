import { generalTrafficOffenceRepo } from "../reposetories/generalTrafficOffence.repo.js";
export class GeneralTrafficOffenceService {
  async getAll() {
    return await generalTrafficOffenceRepo.getAll();
  }

  async getById(id) {
    const offence = await generalTrafficOffenceRepo.getById(id);

    if (!offence) {
      throw new Error("General Traffic Offence not found");
    }

    return offence;
  }

  async create(data) {
    return await generalTrafficOffenceRepo.create(data);
  }

  async update(id, data) {
    const updated = await generalTrafficOffenceRepo.update(id, data);

    if (!updated) {
      throw new Error("General Traffic Offence not found");
    }

    return updated;
  }

  async delete(id) {
    const deleted = await generalTrafficOffenceRepo.delete(id);

    if (!deleted) {
      throw new Error("General Traffic Offence not found");
    }

    return { success: true, message: "Offence deleted successfully" };
  }
}

export const generalTrafficOffenceService = new GeneralTrafficOffenceService();