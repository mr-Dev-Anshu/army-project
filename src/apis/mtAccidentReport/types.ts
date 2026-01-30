export interface MTAccidentReport {
    _id: string;
    individualDetails?: {
        individualType?: "militaryPersonnel" | "employee" | "civilian" | "servantMaid" | "shopKeeper" | "tempHiredWorker";
        [key: string]: any;
    };
    accidentDetails?: {
        accidentTime?: string | Date;
        accidentDate?: string | Date;
        placeOfAccident?: string;
        accidentType?: "normal" | "serious" | "fatal" | "verySerious";
        causeOfAccident?: string;
    };
    vehicleDetails?: {
        vehicleNumber?: string;
        vehicleModel?: string;
    };
    casualtyDetails?: {
        injuredCivil?: number;
        injuredMilitary?: number;
        diedCivil?: number;
        diedMilitary?: number;
    };
    firMactDetails?: {
        firMactNumber?: string;
        firDate?: string | Date;
        firPoliceStation?: string;
    };
    actionStatus?: "pending" | "taken";
    actionStatusRemark?: string;
    remark?: string;
    customFields?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

export interface MTAccidentReportFilters {
    search?: string;
    fromDate?: string;
    toDate?: string;
}

export type CreateMTAccidentReportData = Omit<MTAccidentReport, "_id" | "createdAt" | "updatedAt">;
