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

  async getFilteredRecords(filters) {
    return await staticSpeedCheckRecordRepo.getFilteredRecords(filters);
  }

  // Alias for backward compatibility if needed, or deprecate
  async getByDateRange(filters) {
    return this.getFilteredRecords(filters);
  }

  async getGroupedByOffenceType(filters) {
    return await staticSpeedCheckRecordRepo.getGroupedByOffenceType(filters);
  }


  async create(data) {
    return await staticSpeedCheckRecordRepo.create(data);
  }

  async update(id, data) {
   const { certificates, ...restData } = data;
   
     let updated = null;
   
     // 1️⃣ Update normal fields first
     if (Object.keys(restData).length) {
       updated = await staticSpeedCheckRecordRepo.update(id, restData);
     }
   
     // 2️⃣ Append certificates
     if (certificates?.length) {
       updated = await staticSpeedCheckRecordRepo.appendCertificates(id, certificates);
     }
   
     if (!updated) throw new Error("Report not found");
   
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