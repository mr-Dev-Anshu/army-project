import Register from "@/models/Register";

import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { REGISTER_BOOKS_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/RegisterBooks";

export class RegisterRepository {
    async create(data) {
        const record = new Register(data);
        const savedRecord = await record.save();

        // Track suggestions
        trackFieldSuggestions(savedRecord.toObject(), REGISTER_BOOKS_SUGGESTION_CONFIG)
            .catch(err => console.error("Error tracking register suggestions:", err));

        return savedRecord;
    }

    async findById(id) {
        return await Register.findById(id).populate('offender').lean();
    }

    async findByReportNo(reportNo) {
        // Search in details.reportNo
        return await Register.findOne({ "details.reportNo": reportNo }).populate('offender').lean();
    }

    async findAll(filters = {}, sort = { createdAt: -1 }, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const query = Register.find(filters).populate('offender').sort(sort);

        // Only apply pagination if limit is provided and positive
        if (limit > 0) {
            query.skip(skip).limit(limit);
        }

        return await query.lean();
    }

    async count(filters = {}) {
        return await Register.countDocuments(filters);
    }

    async updateById(id, data) {
        const updated = await Register.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('offender').lean();

        if (updated) {
            trackFieldSuggestions(updated, REGISTER_BOOKS_SUGGESTION_CONFIG)
                .catch(err => console.error("Error tracking register suggestions on update:", err));
        }

        return updated;
    }

    async deleteById(id) {
        return await Register.findByIdAndDelete(id);
    }
}
