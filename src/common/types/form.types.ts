// ---------- STEP STATE ----------
export interface VehicleDetailsState {
  category: string;
  vehicleType: string;
  driverType: string;
}

export interface OffenderWithoutVehicleState {
  offenderType: string;

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


export interface Witness {
  dateOfDuty: string;
  startTime: string;
  endTime: string;
  dutyLocation: string;
  dutyType: string;

  reportingMPName: string;
  rank: string;
  unit: string;
  armyNo: string;

  timeOfOffence: string;
  incidentLocation: string;
  description: string;
}

export interface FormDataState {
  vehicleInvolved: string;

  vehicleDetails: VehicleDetailsState;

  offenderWithoutVehicle: OffenderWithoutVehicleState;

  remarks?: string;
  
}



// ---------- ROOT STATE ----------
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
    };
