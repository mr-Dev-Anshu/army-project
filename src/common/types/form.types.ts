import { OffenderType } from "@/apis/offender/types";
import { MaidServant } from "@/features/civilEmployee/maid_Servant/types";
import { Shopkeeper } from "@/features/civilEmployee/shopkeeper/types";
import { TemporaryHiredWorker } from "@/features/civilEmployee/temporaryHired/types";

/* ================= VEHICLE ================= */
export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
  vehicleName: string;
  vehicleNumber:string;
}

/* ================= OFFENDER ================= */
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

/* ================= STEP-2 ================= */
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

/* ================= PURE OFFENCE BLOCK ================= */
export interface OffenceOccurenceDetails {
  timeOfOffence?: string;
  time?: string;
  incidentLocation: string;
  description: string;
  description2?: string;
  authSpeed?: string;
  actualSpeed?: string;
  actualSpeedNoted?: string;
  overSpeed?: string;
 overSpeedCalculated?: string;
}

/* ================= WITNESS (AS IT IS) ================= */
export interface Witness {
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;
}

export interface TrafficState {
 vehicleInvolved: "yes" | "no" | "";
  remarks: string;
  description?:string;

  coDriverOrPillion?: boolean;
  coDriverType?: string;
  offenceType?:string;

  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  offenderWithoutVehicle: OffenderWithoutVehicleState;

  offenderDetails: Record<string, unknown>;
  onDutyDetails: OnDutyDetails;
  onDutyDetailsMPReporting: OnDutyDetailsMPReporting;

  offenceOccurenceDetails: OffenceOccurenceDetails;
  offenceTypes: string[];
  offenceCode: string[];

  witnesses: Witness[];
selectedWitness: number | null;


  offenderPeople: OffenderPerson[];
}

/* ================= STATIC SPEED (BEST STRUCTURE) ================= */
export interface StaticSpeedState {
 vehicleInvolved: "yes" | "no" | "";
 remarks:string;
 offenceType?:string; 
 description?:string;
  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  /* Same BLOCK concept → clear separation */
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;

  witnesses: Witness[];
selectedWitness: number | null;


  offenderDetails: Record<string, unknown>;
  offenderPeople: OffenderPerson[];
}

/* ================= MP REPORT STATE (unchanged) ================= */
export interface MpOffender {
  driverType?: string;
  [key: string]: any;
}
export interface MpReportState {
  reportDetails: {
    reportNo: string;
    command: string;
    firNo: string;
    firFile?: File | null;
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
    place: string; // <-- same as context
    date: string;
    time: string;
    description: string;
  };

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

  documents: {
    statement: string;
    url: string;
  }[];

  additionalIndividual: {
    vehicleInvolved: "yes" | "no" | "";
    vehicleData: Partial<VehicleDetailsState>;
    driverType: string;
    tempOffender: unknown | null;
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
  | "Military Person"
  | "Servant/Maid"
  | "Shopkeeper & Worker"
  | "Temporary Hired Worker";

export interface OffenderPerson {
  relation: string;
  whoIsIt: DependentType;
  details?: Record<string, any>;
}


// ---------- FORM ROOT ----------
// ---------- TRAFFIC ----------
export interface TrafficFormState {
  vehicleInvolved: string;
  vehicleDetails: VehicleDetailsState;
  offenderWithoutVehicle: OffenderWithoutVehicleState;

  remarks?: string;

  onDutyDetails: OnDutyDetails;
  onDutyDetailsMPReporting: OnDutyDetailsMPReporting;
  offenceOccurenceDetails: OffenceOccurenceDetails;

  offenceTypes: string[];
  offenceCode: string[];

  witnesses: Witness[];
  selectedWitness?: OnDutyDetailsMPReporting | null;

  offenderDetails: Record<string, string>;
  offenderPeople: OffenderPerson[];
  coDriverOrPillion?: boolean;
  coDriverType?: string;
}

// ---------- STATIC SPEED ----------
export interface StaticSpeedFormState {
  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  witnesses: any[];
  selectedWitness?: any;

  offenderDetails: any;
  offenderPeople: any[];

  offenceOccurenceDetails: {
    timeOfOffence: string;
    incidentLocation: string;
    description: string;
    authSpeed: string;
    actualSpeedNoted: string;
    overSpeedCalculated: string;
    dateOfDuty?: string; // observed in usage
    startTime?: string;
    endTime?: string;
    dutyLocation?: string;
    dutyType?: string;
    nameReportingMP?: string;
    rank?: string;
    unit?: string;
    relation?: string;
    [key: string]: string | undefined;
  };
}

/* ================= ROOT FORM ================= */
export interface FormDataState {
  traffic: TrafficState;
  staticSpeed: StaticSpeedState;
  mpReport: MpReportState;
  remarks?: string;
  shopkeeper:Shopkeeper,
  maidServant:MaidServant,
  tempWorker:TemporaryHiredWorker,
  // Keep these for backward compatibility if needed, or remove if unused
  // (Based on FormContext, they seem to be moved to 'traffic' but let's check usage)
  // For now, I will remove them to align with FormContext.tsx strictly.
  coDriverOrPillion?: boolean;
  coDriverType?: string;
}

/* ================= GLOBAL ================= */
export interface GlobalFormState {
  currentStep: number;
  completedSteps: number[];
  formData: FormDataState;
  preview: boolean; 
}
/* ================= ACTIONS ================= */
export type Action =
  | { type: "NEXT_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PATH"; path: string; value: unknown }
  | { type: "PUSH_PATH"; path: string; value: unknown }
  | { type: "REMOVE_PATH"; path: string; index: number }
  | { type: "SET_FORM_DATA"; payload: FormDataState }   
  | { type: "CLEAR_MP_ADDITIONAL" }                      
  | { type: "SET_PREVIEW"; payload: boolean };           
