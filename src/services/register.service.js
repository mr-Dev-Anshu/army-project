import { RegisterRepository } from "@/reposetories/register.repo";
import { saveOrUpdateArmyPersonnel } from "@/services/individual.service";

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

    async createRegister(data) {
        // 1. Save/Update individual if present
        await this._processIndividualData(data);

        // 2. Create Register Entry
        return await repo.create(data);
    }

    async getRegisterById(id) {
        const register = await repo.findById(id);
        if (!register) throw new Error("Register entry not found");
        return register;
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

        // 2. Update Register Entry
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
