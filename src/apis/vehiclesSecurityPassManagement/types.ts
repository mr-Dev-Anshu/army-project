export interface VehicleIdentification {
    registrationNumber: string;
    color?: string;
    category?: string;
    type?: string;
}

export interface OwnerInformation {
    name?: string;
    mobileNumber?: string;
    ownerType?:
    | "militaryPersonnel"
    | "employee"
    | "civilian"
    | "servantMaid"
    | "shopKeeper"
    | "tempHiredWorker";
    armyNo?: string;
    rank?: string;
    unit?: string;
    fmn?: string;
    command?: string;
    address?: string;
}

export interface VehiclePassDetails {
    isAvailable: boolean;
    passNumber?: string;
    issuedDate?: string | Date; // Using string | Date for flexibility
    validFrom?: string | Date;
    validTo?: string | Date;
    issuingAuthority?: string;
}

export interface Authentication {
    initialsMPCPNCO?: string;
    initialsQMSJCO?: string;
    initials2IC?: string;
}

export interface VehiclesSecurityPassManagement {
    _id: string;
    vehicleIdentification: VehicleIdentification;
    ownerInformation: OwnerInformation;
    vehiclePassDetails?: VehiclePassDetails;
    authentication?: Authentication;
    remark?: string;
    customFields?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export type CreateVehiclesSecurityPassData = Omit<
    VehiclesSecurityPassManagement,
    "_id" | "createdAt" | "updatedAt"
>;

export type UpdateVehiclesSecurityPassData = Partial<CreateVehiclesSecurityPassData>;

export interface VehiclesSecurityPassFilters {
    // Add filters as needed, e.g., pagination, search
    page?: number;
    limit?: number;
    search?: string;
}
