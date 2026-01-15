export interface UnitIdentifier {
    unitType: string;
    unit: string;
    unitShortForm: string;
    serviceArm: string;
    parentFormation: string;
    locationStation: string;
}

export interface UnitHierarchyAndControl {
    command: string;
    corps: string;
    brigade: string;
    division: string;
    seniorityOrder: string;
}

export interface UnitClassification {
    unitStatus: "permanent" | "attached" | "visiting" | "detached" | "onTemporaryDuty";
    attachmentValidFrom?: string;
    attachmentValidTo?: string;
    attachedTo?: string;
}

export interface UnitMasterList {
    _id: string;
    unitIdentifier: UnitIdentifier;
    unitHierarchyAndControl: UnitHierarchyAndControl;
    unitClassification?: UnitClassification;
    unitActiveStatus: boolean;
    remarks?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateUnitMasterListData {
    unitIdentifier: UnitIdentifier;
    unitHierarchyAndControl: UnitHierarchyAndControl;
    unitClassification?: UnitClassification;
    unitActiveStatus: boolean;
    remarks?: string;
}

export interface UpdateUnitMasterListData extends Partial<CreateUnitMasterListData> { }

export interface UnitMasterListFilters {
    search?: string;
}
