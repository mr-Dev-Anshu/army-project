import Register from "@/models/Register";

export class RegisterRepository {
    async create(data) {
        const record = new Register(data);
        return await record.save();
    }

    async findById(id) {
        return await Register.findById(id).populate('offender').lean();
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
        return await Register.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('offender').lean();
    }

    async deleteById(id) {
        return await Register.findByIdAndDelete(id);
    }
}
