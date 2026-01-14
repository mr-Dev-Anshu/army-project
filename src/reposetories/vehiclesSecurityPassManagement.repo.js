import { VehiclesSecurityPassManagement } from "@/models/vehiclesSecurityPassManagement";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { VEHICLES_SECURITY_PASS_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/VehiclesSecurityPassManagement";

export async function createVehiclesSecurityPassRepo(data) {
    const result = await new VehiclesSecurityPassManagement(data).save();
    // Track suggestions asynchronously
    trackFieldSuggestions(data, VEHICLES_SECURITY_PASS_SUGGESTION_CONFIG);
    return result;
}

export async function findAllVehiclesSecurityPassesRepo() {
    return await VehiclesSecurityPassManagement.find({}).sort({ createdAt: -1 });
}

export async function findVehiclesSecurityPassByIdRepo(id) {
    return await VehiclesSecurityPassManagement.findById(id);
}

export async function updateVehiclesSecurityPassByIdRepo(id, data) {
    const result = await VehiclesSecurityPassManagement.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (result) {
        trackFieldSuggestions(data, VEHICLES_SECURITY_PASS_SUGGESTION_CONFIG);
    }
    return result;
}

export async function deleteVehiclesSecurityPassByIdRepo(id) {
    return await VehiclesSecurityPassManagement.findByIdAndDelete(id);
}
