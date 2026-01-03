import { MTAccidentReport } from "@/models/MTAccidentReport";

export const createMTAccidentReport = async (data) => {
    const report = await MTAccidentReport.create(data);
    return report;
};

export const getAllMTAccidentReports = async () => {
    return await MTAccidentReport.find().sort({ createdAt: -1 });
};
