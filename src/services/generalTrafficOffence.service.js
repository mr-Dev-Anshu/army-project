import { generalTrafficOffenceRepo } from "../reposetories/generalTrafficOffence.repo.js";
export class GeneralTrafficOffenceService {
  async getAll() {
    return await generalTrafficOffenceRepo.getAll();
  }

  async getGroupedByOffenceType(filters) {
    return await generalTrafficOffenceRepo.getGroupedByOffenceType(filters);
  }

  async getById(id) {
    const offence = await generalTrafficOffenceRepo.getById(id);

    if (!offence) {
      throw new Error("General Traffic Offence not found");
    }

    return offence;
  }

  async create(data, requestContext = null) {
    return await generalTrafficOffenceRepo.create(data, requestContext);
  }

async update(id, data) {
  const { certificates, ...restData } = data;

  let updated = null;

  // 1️⃣ Update normal fields first
  if (Object.keys(restData).length) {
    updated = await generalTrafficOffenceRepo.update(id, restData);
  }

  // 2️⃣ Append certificates
  if (certificates?.length) {
    updated = await generalTrafficOffenceRepo.appendCertificates(id, certificates);
  }

  if (!updated) throw new Error("Report not found");

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