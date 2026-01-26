import * as CertificateRepo from "@/reposetories/certificateAndForm.repo";
import fs from 'fs';
import path from 'path';

const Allowed_Types = ["certificate", "letter", "form"];

export class CertificateAndFormService {
  async create(data) {
    const { name, url, type } = data;
    if (!name || !url || !type) {
      throw new Error("name,url and type are required");
    }

    if (!Allowed_Types.includes(type)) {
      throw new Error("Invalid certificate type");
    }

    return CertificateRepo.create({ name, url, type });
  }

  async getCertificateById(id) {
    const cert = await CertificateRepo.findById(id);
    if (!cert) {
      throw new Error("Certificate not found");
    }
    return cert;
  }

  async getCertificateByType(type) {
    if (!Allowed_Types.includes(type)) {
      throw new Error("Invalid Certificate Type");
    }
    const data = CertificateRepo.findByType(type);
    // if (!data.length > 0) {
    //   throw new Error("No Certificates found for specific type");
    // }
    return data;
  }

  async getAllCertificate(){
    const data = CertificateRepo.getAllCertificate();
    if(!data){
        throw new Error("Error while fetching Certificates");
    }
    return data;
  }

  async updateCertificate(id, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.url) updateData.url = data.url;

    if (data.type) {
      if (!Allowed_Types.includes(data.type)) {
        throw new Error("Invalid certificate type");
      }
      updateData.type = data.type;
    }

    if (!Object.keys(updateData).length) {
      throw new Error("No valid fields to update");
    }

    const updated = await CertificateRepo.updateById(id, updateData);
    if (!updated) throw new Error("Certificate not found");

    // If caller provided oldUrl and a new url, attempt to delete the old file from public/uploads
    try {
      if (data.oldUrl && data.url && data.oldUrl !== data.url) {
        // oldUrl expected like '/uploads/filename.ext'
        const relative = data.oldUrl.startsWith('/') ? data.oldUrl.slice(1) : data.oldUrl;
        const filePath = path.join(process.cwd(), 'public', relative);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (err) {
      // log and continue; deletion failure shouldn't block update
      console.error('Failed to delete old file:', err);
    }
    return updated;
  }

async deleteCertificate(id) {
  // 1️⃣ Get certificate first (to access file url)
  const cert = await CertificateRepo.findById(id);
  if (!cert) {
    throw new Error("Certificate not found");
  }

  // 2️⃣ Delete file from local storage (if exists)
  try {
    if (cert.url) {
      // expected: /uploads/filename.ext
      const relativePath = cert.url.startsWith("/")
        ? cert.url.slice(1)
        : cert.url;

      const filePath = path.join(process.cwd(), "public", relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    // File delete failure should NOT block DB deletion
    console.error("Failed to delete file:", err);
  }

  // 3️⃣ Delete DB record
  const deleted = await CertificateRepo.deleteById(id);
  if (!deleted) {
    throw new Error("Certificate not found");
  }

  return deleted;
}

}

export const CertificateService = new CertificateAndFormService();
