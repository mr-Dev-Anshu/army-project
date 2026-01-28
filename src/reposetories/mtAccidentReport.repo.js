import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { MTAccidentReport } from "@/models/MTAccidentReport.js";
import { MT_ACCIDENT_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/MTAccidentReport.js";

export class MTAccidentReportRepository {
    async getAll(filters = {}) {
        const query = {};

        if (filters.search) {
            // Basic search implementation - expand as needed
            query.$or = [
                { "accidentDetails.placeOfAccident": { $regex: filters.search, $options: "i" } },
                { "vehicleDetails.vehicleNumber": { $regex: filters.search, $options: "i" } }
            ];
        }

        // Date filters
        if (filters.fromDate || filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate) {
                query.createdAt.$gte = new Date(filters.fromDate);
            }
            if (filters.toDate) {
                query.createdAt.$lte = new Date(filters.toDate);
            }
        }

        return await MTAccidentReport.find(query).sort({ createdAt: -1 });
    }

    async getById(id) {
        return await MTAccidentReport.findById(id);
    }

    async create(data) {
        const report = new MTAccidentReport(data);
        await report.save();

        try {
            trackFieldSuggestions(data, MT_ACCIDENT_REPORT_SUGGESTION_CONFIG);
        } catch (error) {
            console.error("Error tracking suggestions:", error);
        }

        return report;
    }

    async update(id, data) {
        // If you need to track suggestions on update as well, you can add it here
        return await MTAccidentReport.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return await MTAccidentReport.findByIdAndDelete(id);
    }
}

export const mtAccidentReportRepo = new MTAccidentReportRepository();
