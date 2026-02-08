export interface MPReport {
  _id: string;
  reportDetails: {
    reportNumber: string;
    command: string;
    firNumber?: string;
    firFileUrl?: string;
    [key: string]: any;
  };
  investigationHead: {
    armyNumber: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
    address: string;
    iCardNumber: string;
    [key: string]: any;
  };
  occurrenceDetails: {
    offenceType: string;
    placeOfOccurrence: string;
    dateOfOccurrence: string;
    timeOfOccurrence?: string;
    description: string;
    [key: string]: any;
  };
  individual?: {
    isVehicleInvolved?: boolean;
    vehicleCategory?: string;
    typeOfVehicle?: string;
    vehicleNumber?: string;
    vehicleName?: string;
    [key: string]: any;
  }[];
  witness?: {
    isVehicleInvolved?: boolean;
    vehicleCategory?: string;
    typeOfVehicle?: string;
    vehicleNumber?: string;
    vehicleName?: string;
    [key: string]: any;
  }[];
  documents?: {
    statement?: string;
    url: string;
    [key: string]: any;
  }[];
  evidences?: {
    type: string;
    url: string;
    description?: string;
    [key: string]: any;
  }[];
  detailedOccurrenceReport?: string;
  pointsFindOutDuringInvestigation?: string;
  opinion?: string;
  remarks?: {
    analysis?: string;
    recommendation?: string;
    [key: string]: any;
  };
  actionStatus?: boolean;
  actionStatusRemark?: string;
  addRemark?: string;
  initialsMPCRNCO?: boolean;
  initialsCO?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export type CreateMPReportPayload = Omit<MPReport, "_id" | "createdAt" | "updatedAt">;
export type UpdateMPReportPayload = Partial<CreateMPReportPayload>;
