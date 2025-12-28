import { OffenderType } from "@/apis/offender/types";

/* ================= VEHICLE ================= */
export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
  vehicleName: string;
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
  timeOfOffence: string;
  time?: string;
  incidentLocation: string;
  description: string;
  authSpeed?: string;
  actualSpeed?: string;
  overSpeed?: string;
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

  coDriverOrPillion?: boolean;
  coDriverType?: string;

  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
  };

  offenderWithoutVehicle: OffenderWithoutVehicleState;

  offenderDetails: Record<string, unknown>;
  onDutyDetails: OnDutyDetails;
  onDutyDetailsMPReporting: OnDutyDetailsMPReporting;

  offenceOccurenceDetails: OffenceOccurenceDetails;
  offenceTypes: string[];
  offenceCode: string[];

  witnesses: Witness[];
  selectedWitness: Witness | null;

  offenderPeople: OffenderPerson[];
}

/* ================= STATIC SPEED (BEST STRUCTURE) ================= */
export interface StaticSpeedState {
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
  selectedWitness: Witness | null;

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
    place: string;
    date: string;
    time: string;
    description: string;
  };

  individualDetails: {
    vehicleInvolved: "yes" | "no" | "";
    vehicleData: Partial<VehicleDetailsState>;
    driverType: string;
    offenderList: MpOffender[];
    tempOffender?: MpOffender;
  };

 witnesses: Record<string, any>[];

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

/* ================= DEPENDENTS ================= */
export type DependentType =
  | "Military Person"
  | "Servant/Maid"
  | "Shopkeeper & Worker"
  | "Temporary Hired Worker";

export interface OffenderPerson {
  type: "Driver" | "CoDriver";
  details: {
    name?: string;
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
}

/* ================= GLOBAL ================= */
export interface GlobalFormState {
  currentStep: number;
  completedSteps: number[];
  formData: FormDataState;
}

/* ================= ACTIONS ================= */
export type Action =
  | { type: "NEXT_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PATH"; path: string; value: unknown }
  | { type: "PUSH_PATH"; path: string; value: unknown }
  | { type: "REMOVE_PATH"; path: string; index: number };
