import { mtAccidentReportRepo } from "@/reposetories/mtAccidentReport.repo";

export const createMTAccidentReport = async (data) => {
    return await mtAccidentReportRepo.create(data);
};

export const getAllMTAccidentReports = async (filters) => {
    return await mtAccidentReportRepo.getAll(filters);
};

export const getMTAccidentReportById = async (id) => {
    return await mtAccidentReportRepo.getById(id);
};

export const updateMTAccidentReport = async (id, data) => {
    return await mtAccidentReportRepo.update(id, data);
};

export const deleteMTAccidentReport = async (id) => {
    return await mtAccidentReportRepo.delete(id);
};
