import { offenderRepo } from "../reposetories/offender.repo";

export class OffenderService {
  async getAll() {
    return await offenderRepo.getAll();
  }

  async getById(id) {
    const offender = await offenderRepo.getById(id);
    if (!offender) throw new Error("Offender not found");
    return offender;
  }

  async getByOffenceId(offenceId) {
    return await offenderRepo.getByOffenceId(offenceId);
  }

  async create(data) {
    return await offenderRepo.create(data);
  }

  async update(id, data) {
    const updated = await offenderRepo.update(id, data);
    if (!updated) throw new Error("Offender not found");
    return updated;
  }

  async delete(id) {
    const deleted = await offenderRepo.delete(id);
    if (!deleted) throw new Error("Offender not found");
    return { success: true, message: "Offender deleted successfully" };
  }
}

export const offenderService = new OffenderService();