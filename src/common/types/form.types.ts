// import { OffenderType } from "@/apis/offender/types";


// // ---------- VEHICLE ----------
// export interface VehicleDetailsState {
//   category: string;
//   vehicleType: string;
//   driverType: string;
// }

// // ---------- OFFENDER ----------
// export interface OffenderWithoutVehicleState {
//   offenderType: OffenderType;

//   military: {
//     armyNumber: string;
//     rank: string;
//     name: string;
//     unit: string;
//     fmn: string;
//     command: string;
//     address: string;
//     iCardNumber: string;
//   };
// }

// // ---------- STEP-2 ----------
// export interface OnDutyDetails {
//   dateOfDuty: string;
//   startTime: string;
//   endTime: string;
//   dutyLocation: string;
//   dutyType: string;
// }

// export interface OnDutyDetailsMPReporting {
//   nameReportingMP: string;
//   rank: string;
//   unit: string;
//   armyNumber: string;
// }

// export interface OffenceOccurenceDetails {
//   timeOfOffence: string;
//   incidentLocation: string;
//   description: string;
// }

// // ---------- WITNESS ----------
// export interface Witness {
//   dutyBlock?: OnDutyDetails;
//   reportingBlock?: OnDutyDetailsMPReporting;
//   offenceBlock?: OffenceOccurenceDetails;
// }

// // ---------- DEPENDENTS ----------
// export type DependentType =
//   | "Military Personnel"
//   | "Servant / Maid"
//   | "Shopkeeper & Worker"
//   | "Temporary Hired Worker";

// export interface OffenderPerson {
//   relation: string;
//   whoIsIt: DependentType;
// }

// // ---------- FORM ROOT ----------
// export interface FormDataState {
//   vehicleInvolved: string;
//   vehicleDetails: VehicleDetailsState;
//   offenderWithoutVehicle: OffenderWithoutVehicleState;

//   remarks?: string;

//   onDutyDetails: OnDutyDetails;
//   onDutyDetailsMPReporting: OnDutyDetailsMPReporting;
//   offenceOccurenceDetails: OffenceOccurenceDetails;

//   offenceTypes: string[];
//   offenceCode: string[];

//   witnesses: Witness[];         
//   offendeDetails:Record<string,string>;
//   offenderPeople: OffenderPerson[];
// }

// // ---------- GLOBAL ----------
// export interface GlobalFormState {
//   currentStep: number;
//   completedSteps: number[];
//   formData: FormDataState;
// }

// // ---------- ACTIONS ----------
// export type Action =
//   | { type: "NEXT_STEP" }
//   | { type: "SET_STEP"; payload: number }
//   | { type: "SET_FORM_DATA"; payload: Partial<FormDataState> }
//   | { type: "SET_VEHICLE_DETAILS"; payload: Partial<VehicleDetailsState> }
//   | { type: "SET_OFFENDER_TYPE"; payload: string }
//   | {
//       type: "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS";
//       payload: Partial<OffenderWithoutVehicleState>;
//     }
//   | { type: "SET_OFFENDER_PEOPLE"; payload: OffenderPerson[] }
//   | { type: "SET_WITNESSES"; payload: Witness[] };   // ← ADDED




import { OffenderType } from "@/apis/offender/types";

export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
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
}

export interface OffenceOccurenceDetails {
  timeOfOffence: string;
  incidentLocation: string;
  description: string;
}

// ---------- WITNESS ----------
export interface Witness {
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;
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
  | { type: "SET_WITNESSES"; payload: Witness[] };
