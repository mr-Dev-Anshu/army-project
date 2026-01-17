import { saveOrUpdateArmyPersonnelRepo } from "@/reposetories/individual.repo";

/**
 * Reusable utility to save or update army personnel details.
 * Can be called with a single object or an array of objects.
 * @param {Object|Array} data - The individual(s) data containing armyNo and other details.
 */
export async function saveOrUpdateArmyPersonnel(data) {
    return await saveOrUpdateArmyPersonnelRepo(data);
}
