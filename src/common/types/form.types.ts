import { VehiclesSecurityPassManagement } from "@/apis/vehiclesSecurityPassManagement/types";
import { OffenderType } from "@/apis/offender/types";


// ... existing imports ...


import { MaidServant } from "@/features/civilEmployee/maid_Servant/types";
import { Shopkeeper } from "@/features/civilEmployee/shopkeeper/types";
import { TemporaryHiredWorker } from "@/features/civilEmployee/temporaryHired/types";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
  vehicleName: string;
  vehicleNumber: string;
}

// ---------- OFFENDER ----------
export interface OffenderWithoutVehicleState {
  offenderType: OffenderType | "";

  military: {
    armyNumber: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
    address: string;
    iCardNumber: string;
  };
}

// ---------- STEP-2 ----------
export interface OnDutyDetails {
  dateOfDuty: string;
  startTime: string;
  endTime: string;
  dutyLocation: string;
  dutyType: string;
}

export interface OnDutyDetailsMPReporting {
  nameReportingMP: string;
  rank: string;
  unit: string;
  armyNumber: string;
  contactNumber: string;
}

export interface OffenceOccurenceDetails {
  timeOfOffence: string;
  time?: string;
  incidentLocation: string;
  description: string;
  briefDescription?: string;
  authSpeed?: string;
  actualSpeed?: string;
  overSpeed?: string;
}

// ---------- WITNESS ----------
export interface Witness {
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;
}

// ---------- MP REPORT MASTER ----------

export interface MpReportState {
  reportDetails: {
    reportNo: string;
    command: string;
    firNo: string;
    firFile?: string | null;
  };

  mpParticulars: {
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
    address: string;
    icard: string;
  };

  occurrenceDetails: {
    offenceType: string;
    offenceTypes: string[];
    offenceTypeReference: string[];
    place: string; // <-- same as context
    date: string;
    time: string;
    description: string;
  };

  /* ---------- STEP-4 ---------- */
  individualDetails: {
    vehicleInvolved: "yes" | "no" | "";
    vehicleData: Partial<VehicleDetailsState>;
    driverType: string;
    offenderList: any[];
    tempOffender?: any; // <-- optional support so no TS error
  };

  witnesses: Witness[];
  witnessVehicleStatus?: "yes" | "no" | "";

  evidence: {
    attachEvidence?: File | null;
    eyeSketch?: File | null;
    photos?: File[] | null;
    videos?: File[] | null;
  };

  documents: any[];
  certificates: any[];

  additionalIndividual: {
    vehicleInvolved: "yes" | "no" | "";
    vehicleData: Partial<VehicleDetailsState>;
    driverType: string;
    tempOffender: any | null;
  };

  detailedReport: string;
  investigationPoints: string;
  opinion: string;

  remarks: {
    analysis: string;
    recommendation: string;
  };
}

// ---------- DEPENDENTS ----------
export type DependentType =
  | "Civilian"
  | "Military Person"
  | "Servant/Maid"
  | "Shopkeeper & Worker"
  | "Temporary Hired Worker";


// export interface OffenderPerson {
//   relation: string;
//   whoIsIt: DependentType;
//   details?: Record<string, any>;
// }




export interface OffenderPerson {
  offenderType: string;           // "Civilian" | "Military Person" | etc
  role: "Offender" | "Co-Driver"; // backend `offenderDetails.type`
  relation?: string;

  details: {
    name?: string;
    rank?: string;
    armyNumber?: string;
    unit?: string;
    command?: string;
    fmn?: string;
    address?: string;
    iCardNumber?: string;
    [key: string]: any;
  };
}



// ---------- FORM ROOT ----------
// ---------- TRAFFIC ----------
export interface TrafficFormState {
  reportNo?: string;
  vehicleInvolved: string;
  vehicleDetails: VehicleDetailsState;
  offenderWithoutVehicle: OffenderWithoutVehicleState;

  remarks?: string;

  onDutyDetails: OnDutyDetails;
  onDutyDetailsMPReporting: OnDutyDetailsMPReporting;
  offenceOccurenceDetails: OffenceOccurenceDetails;

  offenceTypes: string[];
  offenceCode: string[];
  offenceRefList?: { _id: string; reference: string }[];

  witnesses: Witness[];
  selectedWitness?: OnDutyDetailsMPReporting | null;

  offenderDetails: Record<string, string>;
  offenderPeople: OffenderPerson[];
  coDriverOrPillion?: boolean;
  coDriverType?: string;
}

// ---------- STATIC SPEED ----------
export interface StaticSpeedFormState {
  reportNo?: string;
  remarks?: string;
  vehicleInvolved?: string;
  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  dutyBlock: {
    dateOfDuty: string;
    startTime: string;
    endTime: string;
    dutyLocation: string;
    dutyType: string;
  };

  reportingBlock: {
    nameReportingMP: string;
    rank: string;
    unit: string;
    armyNumber: string;
    contactNumber: string;
  };

  offenceBlock: {
    timeOfOffence: string;
    time: string;
    incidentLocation: string;
    description: string;
    briefDescription?: string;
    description2: string;
    authSpeed: string;
    actualSpeedNoted: string;
    overSpeedCalculated: string;
    offenceTypes?: string[];
    offenceTypeReference?: string[];
  };

  witnesses: any[];
  selectedWitness?: any;

  offenderDetails: any;
  offenderPeople: any[];


}

// ---------- FORM ROOT ----------
export interface FormDataState {
  traffic: TrafficFormState;
  staticSpeed: StaticSpeedFormState;
  mpReport: MpReportState;
  remarks?: string;
  shopkeeper: Shopkeeper,
  maidServant: MaidServant,
  tempWorker: TemporaryHiredWorker,
  vehiclesSecurityPassManagement: VehiclesSecurityPassManagement;
  immediateReportingIncident: ImmediateReportingIncident;
  // Keep these for backward compatibility if needed, or remove if unused
  // (Based on FormContext, they seem to be moved to 'traffic' but let's check usage)
  // For now, I will remove them to align with FormContext.tsx strictly.
  coDriverOrPillion?: boolean;
  coDriverType?: string;
}

// ---------- GLOBAL ----------
export interface GlobalFormState {
  currentStep: number;
  completedSteps: number[];
  preview: boolean;
  formData: FormDataState;
}
// ---------- ACTIONS ----------
export type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PATH"; path: string; value: any }
  | { type: "PUSH_PATH"; path: string; value: any }
  | { type: "REMOVE_PATH"; path: string; index: number }
  | { type: "SET_PREVIEW"; payload: boolean }
  | { type: "SET_FORM_DATA"; payload: Partial<FormDataState> }
  | { type: "SET_VEHICLE_DETAILS"; payload: Partial<VehicleDetailsState> }
  | { type: "SET_OFFENDER_TYPE"; payload: string }
  | {
    type: "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS";
    payload: Partial<OffenderWithoutVehicleState>;
  }
  | { type: "SET_OFFENDER_PEOPLE"; payload: OffenderPerson[] }
  | { type: "SET_WITNESSES"; payload: Witness[] }
  | { type: "CLEAR_MP_ADDITIONAL" }
  | { type: "RESET_FORM" }

  /* ========= STATIC SPEED ========= */
  | { type: "SET_STATIC_WITNESSES"; payload: Witness[] }
  | { type: "SET_STATIC_SPEED_DATA"; payload: any }
  | { type: "ADD_STATIC_OFFENDER"; payload: any }

  /* ========= MP REPORT MASTER ========= */
  | {
    type: "SET_MP_DATA";
    payload: Partial<MpReportState>;
  }

  /* ========= MP SECTION WISE UPDATE ========= */
  | {
    type: "SET_MP_SECTION";
    section: keyof MpReportState;
    payload: any;
  };
