// services/vehiclesSecurityPassManagement.service.js
import {
    createVehiclesSecurityPassRepo,
    findAllVehiclesSecurityPassesRepo,
    findVehiclesSecurityPassByIdRepo,
    updateVehiclesSecurityPassByIdRepo,
    deleteVehiclesSecurityPassByIdRepo,
} from "@/reposetories/vehiclesSecurityPassManagement.repo";

export async function createVehiclesSecurityPass(data) {
    return await createVehiclesSecurityPassRepo(data);
}

export async function getAllVehiclesSecurityPasses() {
    return await findAllVehiclesSecurityPassesRepo();
}

export async function getVehiclesSecurityPassById(id) {
    return await findVehiclesSecurityPassByIdRepo(id);
}

export async function updateVehiclesSecurityPass(id, data) {
    return await updateVehiclesSecurityPassByIdRepo(id, data);
}

export async function deleteVehiclesSecurityPass(id) {
    return await deleteVehiclesSecurityPassByIdRepo(id);
}
