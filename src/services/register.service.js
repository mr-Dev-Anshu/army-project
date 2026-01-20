import { RegisterRepository } from "@/reposetories/register.repo";
import { saveOrUpdateArmyPersonnel } from "@/services/individual.service";
import { offenderRepo } from "@/reposetories/offender.repo";

const repo = new RegisterRepository();

export class RegisterService {
    /**
     * Extract individual data from register payload and save/update it.
     * Checks inside details.individual OR details (flat) for armyNo.
     */
    async _processIndividualData(data) {
        if (!data.details) return;

        let individualData = null;

        // Check if details has individual object
        if (data.details.individual && data.details.individual.armyNo) {
            individualData = data.details.individual;
        }
        // Check if details itself has armyNo
        else if (data.details.armyNo) {
            individualData = data.details;
        }

        if (individualData) {
            try {
                await saveOrUpdateArmyPersonnel(individualData);
            } catch (error) {
                console.error("Failed to update individual data from register service:", error);
                // Continue execution, don't fail the register creation
            }
        }
    }

    async _processOffenderData(data, registerId = null) {
        if (!data.details || !data.details.offenceOccurred || !data.details.offenderDetails || !data.details.offenderCategory) {
            return null;
        }

        const offenderPayload = {
            offenderDetails: data.details.offenderDetails,
            offenderType: data.details.offenderCategory, // Mapping category to offenderType for compatibility if needed, or use category
            category: "Offender",
        };

        if (registerId) {
            const existingRegister = await repo.findById(registerId);
            if (existingRegister && existingRegister.offender) {
                // Update existing offender
                const offenderId = typeof existingRegister.offender === 'object' ? existingRegister.offender._id : existingRegister.offender;
                await offenderRepo.update(offenderId, offenderPayload);
                return offenderId;
            }
        }

        // Create new
        const newOffender = await offenderRepo.create(offenderPayload);
        return newOffender._id;
    }

    async createRegister(data) {
        // 1. Save/Update individual if present
        await this._processIndividualData(data);

        // 2. Process Offender
        const offenderId = await this._processOffenderData(data);
        if (offenderId) {
            data.offender = offenderId;
            // Remove redundant data from details
            if (data.details) {
                delete data.details.offenderCategory;
                delete data.details.offenderDetails;
            }
        }

        // 3. Create Register Entry
        return await repo.create(data);
    }

    async getRegisterById(id) {
        const register = await repo.findById(id);
        if (!register) throw new Error("Register entry not found");
        return register;
    }

    async getRegisterByReportNo(reportNo) {
        return await repo.findByReportNo(reportNo);
    }

    async getRegistersByType(type, filters = {}, pagination = {}) {
        // Ensure type is filtered
        const query = { type, ...filters };
        return await repo.findAll(query, { createdAt: -1 }, pagination);
    }

    async getAllRegisters(filters = {}, pagination = {}) {
        return await repo.findAll(filters, { createdAt: -1 }, pagination);
    }

    async updateRegister(id, data) {
        // 1. Save/Update individual if present in update data
        await this._processIndividualData(data);

        // 2. Process Offender
        const offenderId = await this._processOffenderData(data, id);
        if (offenderId) {
            data.offender = offenderId;
            // Remove redundant data from details
            if (data.details) {
                delete data.details.offenderCategory;
                delete data.details.offenderDetails;
            }
        }

        // 3. Update Register Entry
        const updated = await repo.updateById(id, data);

        if (!updated) throw new Error("Register entry not found");
        return updated;
    }

    async deleteRegister(id) {
        const deleted = await repo.deleteById(id);
        if (!deleted) throw new Error("Register entry not found");
        return { success: true };
    }
}
