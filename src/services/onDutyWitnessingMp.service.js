import { onDutyWitnessingMpRepo } from "@/reposetories/onDutyWitnessingMp.repository";

export class OnDutyWitnessingMpService {
  async getAll() {
    return await onDutyWitnessingMpRepo.getAll();
  }

  async getById(id) {
    const witness = await onDutyWitnessingMpRepo.getById(id);
    if (!witness) throw new Error("Witnessing MP not found");
    return witness;
  }

  async getByOffenceId(offenceId) {
    return await onDutyWitnessingMpRepo.getByOffenceId(offenceId);
  }

  async create(data) {
    return await onDutyWitnessingMpRepo.create(data);
  }

  async update(id, data) {
    const updated = await onDutyWitnessingMpRepo.update(id, data);
    if (!updated) throw new Error("Witnessing MP not found");
    return updated;
  }

  async delete(id) {
    const deleted = await onDutyWitnessingMpRepo.delete(id);
    if (!deleted) throw new Error("Witnessing MP not found");
    return { success: true, message: "Witnessing MP deleted successfully" };
  }
}

export const onDutyWitnessingMpService = new OnDutyWitnessingMpService();