


import { OffenderType } from "@/apis/offender/types";

export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
  vehicleName: string;

}

// ---------- OFFENDER ----------
export interface OffenderWithoutVehicleState {
  offenderType: OffenderType;

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
  contactNumber:string;
}

export interface OffenceOccurenceDetails {
  timeOfOffence: string;
  time?: string;
  incidentLocation: string;
  description: string;
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



/* ================= MP INVESTIGATION REPORT ================= */
export interface MpReportState {

  reportDetails: {
    reportNo: string;
    command: string;
    firNo: string;
    firFile?: File | null;
  };

  mpParticulars: {
    armyNo : string;
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
    placeOfOccurrence: string;
    date: string;
    time: string;
    description: string;
  };

  /* Step-4 same traffic style handle hoga */
individualDetails: {
  vehicleInvolved: "yes" | "no" | "";
  vehicleData: Partial<VehicleDetailsState>;
  driverType: string;
  offenderList: any[];
};


  witnesses: Witness[];
  evidence: {
    generalEvidence?: File | null;
    sketch?: File | null;
    photos?: File[] | null;
    videos?: File[] | null;
  };

  documents: {
    statement: string;
    url?: string;
    attachments: string[];
  };

  detailedReport: string;
  findings: string;
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
}

// ---------- FORM ROOT ----------
export interface FormDataState {
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

  offendeDetails: Record<string, string>;
  offenderPeople: OffenderPerson[];
  coDriverOrPillion?: boolean;
  mpReport: MpReportState;
}

// ---------- GLOBAL ----------
export interface GlobalFormState {
  currentStep: number;
  completedSteps: number[];
  formData: FormDataState;
}
// ---------- ACTIONS ----------
export type Action =
  | { type: "NEXT_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_FORM_DATA"; payload: Partial<FormDataState> }
  | { type: "SET_VEHICLE_DETAILS"; payload: Partial<VehicleDetailsState> }
  | { type: "SET_OFFENDER_TYPE"; payload: string }
  | {
      type: "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS";
      payload: Partial<OffenderWithoutVehicleState>;
    }
  | { type: "SET_OFFENDER_PEOPLE"; payload: OffenderPerson[] }
  | { type: "SET_WITNESSES"; payload: Witness[] }

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
