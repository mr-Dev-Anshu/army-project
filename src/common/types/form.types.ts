import { OffenderType } from "@/apis/offender/types";

/* ================= OFFENDER PERSON (FIX) ================= */
export interface OffenderPerson {
  offenderType: string;
  name: string;
  rank?: string;
  armyNumber?: string;
  unit?: string;
  fmn?: string;
  address?: string;
  aadharNumber?: string;
  iCardNumber?: string;
}


/* ================= MT ACCIDENT REPORT ================= */
export interface MTAccidentReportState {
  individualType: string;

  dateOfAccident: string;
  timeOfAccident: string;
  placeOfAccident: string;
  typeOfAccident: string;
  probableCause: string;

  vehicleNumber: string;
  makeAndModel: string;

  injuredCivil: number;
  injuredMilitary: number;
  diedCivil: number;
  diedMilitary: number;

  firCaseNumber: string;
  firDate: string;
  firPoliceStation: string;

  actionStatus: boolean;
  remark: string;

  offenderDetails?: Record<string, any>;
}

/* ================= VEHICLE ================= */
export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
  vehicleName: string;
  vehicleNumber: string;
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

/* ================= DUTY ================= */
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

/* ================= OFFENCE ================= */
export interface OffenceOccurenceDetails {
  timeOfOffence?: string;
  incidentLocation: string;
  description: string;
  authSpeed?: string;
  actualSpeedNoted?: string;
  overSpeedCalculated?: string;
}

/* ================= WITNESS ================= */
export interface Witness {
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;
}

/* ================= TRAFFIC ================= */
export interface TrafficState {
  vehicleInvolved: "yes" | "no" | "";
  remarks: string;
  description?: string;

  coDriverOrPillion?: boolean;
  coDriverType?: string;
  offenceType?: string;

  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  offenderWithoutVehicle: OffenderWithoutVehicleState;

  offenderDetails: Record<string, unknown>;
  offenderPeople: any[];

  onDutyDetails: OnDutyDetails;
  onDutyDetailsMPReporting: OnDutyDetailsMPReporting;

  offenceOccurenceDetails: OffenceOccurenceDetails;
  offenceTypes: string[];
  offenceCode: string[];

  witnesses: Witness[];
  selectedWitness: number | null;
}

/* ================= STATIC SPEED ================= */
export interface StaticSpeedState {
  vehicleInvolved: "yes" | "no" | "";
  remarks: string;
  offenceType?: string;
  description?: string;
  vehicleDetails: {
    category: string;
    vehicleType: string;
    driverType: string;
    vehicleNumber: string;
    vehicleName: string;
  };

  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;

  witnesses: Witness[];
  selectedWitness: number | null;

  offenderDetails: Record<string, unknown>;
  offenderPeople: any[];
}

/* ================= MP REPORT ================= */
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
    offenderList: any[];
    tempOffender?: any;
  };

  witnesses: Witness[];
  evidence: {
    attachEvidence?: File | null;
    eyeSketch?: File | null;
    photos?: File[] | null;
    videos?: File[] | null;
  };

  documents: any[];

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

/* ================= ROOT FORM ================= */
export interface FormDataState {
  traffic: TrafficState;
  staticSpeed: StaticSpeedState;
  mpReport: MpReportState;

  /** ✅ FIXED: MT Accident added */
  mtAccidentReport: MTAccidentReportState;
}

/* ================= GLOBAL ================= */
export interface GlobalFormState {
  currentStep: number;
  completedSteps: number[];
  preview: boolean;
  formData: FormDataState;
}
