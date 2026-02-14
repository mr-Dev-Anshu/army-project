import trackFieldSuggestions from "@/lib/fieldSuggestionTracker.js";
import { MTAccidentReport } from "@/models/MTAccidentReport.js";
import { MT_ACCIDENT_REPORT_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/MTAccidentReport.js";

export class MTAccidentReportRepository {

    async getAll(filters = {}) {
        const query = {};

        if (filters.search) {
            query.$or = [
                { "accidentDetails.placeOfAccident": { $regex: filters.search, $options: "i" } },
                { "vehicleDetails.vehicleNumber": { $regex: filters.search, $options: "i" } }
            ];
        }

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

        const existing = await MTAccidentReport.findById(id);
        if (!existing) return null;

        /*
        ----------------------------------------------
        MERGE INDIVIDUALS (IMPORTANT)
        ----------------------------------------------
        */
        if (Array.isArray(data.individuals)) {

            const mergedIndividuals = data.individuals.map((newInd, index) => {

                const oldInd = existing.individuals?.[index]?.toObject?.() || {};

                return {
                    ...oldInd,
                    ...newInd,

                    individualDetails: {
                        ...(oldInd.individualDetails || {}),
                        ...(newInd.individualDetails || {})
                    },

                    coDriver: {
                        ...(oldInd.coDriver || {}),
                        ...(newInd.coDriver || {})
                    },

                    militaryRelative: {
                        ...(oldInd.militaryRelative || {}),
                        ...(newInd.militaryRelative || {})
                    },

                    passengers: Array.isArray(newInd.passengers)
                        ? newInd.passengers
                        : oldInd.passengers || []
                };
            });

            data.individuals = mergedIndividuals;
        }

        /*
        ----------------------------------------------
        SAFE UPDATE
        ----------------------------------------------
        */
        const updated = await MTAccidentReport.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        return updated;
    }

    async delete(id) {
        return await MTAccidentReport.findByIdAndDelete(id);
    }
}

export const mtAccidentReportRepo = new MTAccidentReportRepository();
