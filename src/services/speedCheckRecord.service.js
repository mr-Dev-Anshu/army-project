import { staticSpeedCheckRecordRepo } from "@/reposetories/staticSpeedCheckRecord";

export class StaticSpeedCheckRecordService {
  async getAll() {
    return await staticSpeedCheckRecordRepo.getAll();
  }

  async getById(id) {
    const record = await staticSpeedCheckRecordRepo.getById(id);
    if (!record) {
      throw new Error("Static Speed Check Record not found");
    }
    return record;
  }

  async create(data) {
    return await staticSpeedCheckRecordRepo.create(data);
  }

  async update(id, data) {
    const updated = await staticSpeedCheckRecordRepo.update(id, data);
    if (!updated) {
      throw new Error("Static Speed Check Record not found");
    }
    return updated;
  }

  async delete(id) {
    const deleted = await staticSpeedCheckRecordRepo.delete(id);
    if (!deleted) {
      throw new Error("Static Speed Check Record not found");
    }
    return { success: true, message: "Static Speed Check Record deleted successfully" };
  }
}

export const staticSpeedCheckRecordService = new StaticSpeedCheckRecordService();