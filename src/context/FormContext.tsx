"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { GlobalFormState } from "@/common/types/form.types";

/* ------------------------------------
   UNIVERSAL HELPERS
------------------------------------ */
const setByPath = (obj: any, path: string, value: any) => {
  const keys = path.match(/[^[.\]]+/g) || [];
  const last = keys.pop()!;
  const ref = keys.reduce((o, k) => (o[k] ??= isNaN(Number(k)) ? {} : []), obj);
  ref[last] = value;
};
const getByPath = (obj: any, path: string) => {
  const keys = path.match(/[^[.\]]+/g) || [];
  return keys.reduce((o, k) => (o ? o[k] : undefined), obj);
};

/* ------------------------------------
   INITIAL STATE
------------------------------------ */
export const initialState: GlobalFormState = {
  currentStep: 1,
  completedSteps: [],
  preview: false,

  formData: {
    traffic: {
      vehicleInvolved: "",
      vehicleDetails: {
        category: "",
        vehicleType: "",
        driverType: "",
        vehicleName: "",
        vehicleNumber: "",
      },

      offenderWithoutVehicle: {
        offenderType: "",
        military: {
          armyNumber: "",
          rank: "",
          name: "",
          unit: "",
          fmn: "",
          command: "",
          address: "",
          iCardNumber: "",
        },
      },

      offenderDetails: {},
      onDutyDetails: {
        dateOfDuty: "",
        startTime: "",
        endTime: "",
        dutyLocation: "",
        dutyType: "",
      },

      onDutyDetailsMPReporting: {
        nameReportingMP: "",
        rank: "",
        unit: "",
        armyNumber: "",
        contactNumber: "",
      },

      offenceOccurenceDetails: {
        timeOfOffence: "",
        incidentLocation: "",
        description: "",
        briefDescription: "",
        time: "",
      },

      offenceTypes: [],
      offenceCode: [],
      offenceRefList: [],
      witnesses: [],
      selectedWitness: null,
      offenderPeople: [],
      remarks: "",
    },

    staticSpeed: {
      reportNo: "",
      remarks: "",
      vehicleInvolved: "",
      vehicleDetails: {
        category: "",
        vehicleType: "",
        driverType: "",
        vehicleNumber: "",
        vehicleName: "",
      },

      dutyBlock: {
        dateOfDuty: "",
        startTime: "",
        endTime: "",
        dutyLocation: "",
        dutyType: "",
      },

      reportingBlock: {
        nameReportingMP: "",
        rank: "",
        unit: "",
        armyNumber: "",
        contactNumber: "",
      },

      offenceBlock: {
        timeOfOffence: "",
        time: "",
        incidentLocation: "",
        description: "",
        briefDescription: "",
        description2: "",
        authSpeed: "30",
        actualSpeedNoted: "",
        overSpeedCalculated: "",
      },

      witnesses: [],
      selectedWitness: null,

      offenderDetails: {},
      offenderPeople: [],
      documents: [],
      attachments: [], // Initial empty state
    },

    mpReport: {
      reportDetails: {
        reportNo: "",
        command: "",
        firNo: "",
        firFile: null,
      },

      mpParticulars: {
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
        address: "",
        icard: "",
      },

      occurrenceDetails: {
        offenceType: "",
        offenceTypes: [],
        offenceTypeReference: [],
        place: "",
        date: "",
        time: "",
        description: "",
      },

      individualDetails: {
        vehicleInvolved: "",
        vehicleData: {},
        driverType: "",
        offenderList: [],
        tempOffender: {},
      },

      witnesses: [],
      witnessVehicleStatus: "",
      evidence: {
        attachEvidence: null,
        eyeSketch: null,
        photos: [],
        videos: [],
      },

      documents: [],

      attachments: [],

      additionalIndividual: {
        vehicleInvolved: "",
        vehicleData: {},
        driverType: "",
        tempOffender: {},
      },

      detailedReport: "",
      investigationPoints: "",
      opinion: "",

      remarks: {
        analysis: "",
        recommendation: "",
      },
    },

    shopkeeper: {
      shopName: "",
      shopAddress: "",
      unit: "",
      ownerName: "",
      ownerMobile: "",
      ownerAadhar: "",
      passNumber: "",
      priceListApproved: false,
      priceListEffectiveFrom: null,
      workers: [],
      validFrom: null,
      validTill: null,
    },

    maidServant: {} as any, // Placeholder until fully defined
    tempWorker: {} as any,   // Placeholder until fully defined

    vehiclesSecurityPassManagement: {
      _id: "",
      createdAt: "",
      updatedAt: "",
      vehicleIdentification: {
        registrationNumber: "",
        color: "",
        category: "",
        type: "",
      },
      ownerInformation: {
        name: "",
        mobileNumber: "",
        ownerType: "militaryPersonnel",
        ownerDetails: {},
      },
      vehiclePassDetails: {
        isAvailable: false,
        passNumber: "",
        issuedDate: "",
        validFrom: "",
        validTo: "",
        issuingAuthority: "",
      },
      authentication: {
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
      },
      remark: "",
      customFields: {},
    },

    immediateReportingIncident: {
      _id: "",
      individuals: [{
        armyNo: "",
        rank: "",
        name: "",
        age: "",
        totalServiceDuration: "",
        unit: "",
        unitLocation: "",
        fmn: "",
        individualWorkingStatus: "",
      }],
      incidentPlace: "",
      incidentDate: "",
      incidentTime: "",
      incidentBrief: "",
      coordinationWithPolice: "",
      incidentCoveredBy: "",
      relevantPhotos: [],
    },
  },
};

/* ------------------------------------
   ACTION TYPES
------------------------------------ */
type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" } // <-- NEW
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PATH"; path: string; value: any }
  | { type: "PUSH_PATH"; path: string; value: any }
  | { type: "REMOVE_PATH"; path: string; index: number }
  | { type: "SET_PREVIEW"; payload: boolean }
  | { type: "SET_FORM_DATA"; payload: any }
  | { type: "CLEAR_MP_ADDITIONAL" }
  | { type: "RESET_FORM" };


/* ------------------------------------
   REDUCER
------------------------------------ */
function reducer(state: GlobalFormState, action: Action): GlobalFormState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        completedSteps: state.completedSteps.includes(state.currentStep)
          ? state.completedSteps
          : [...state.completedSteps, state.currentStep],
        currentStep: state.currentStep + 1,
      };

    case "PREV_STEP":
      console.log("REDUCER PREV HIT — New Step:", state.currentStep - 1);
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1),
      };

    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "SET_PATH": {
      const newState = structuredClone(state);
      setByPath(newState, action.path, action.value);
      return newState;
    }

    case "PUSH_PATH": {
      const newState = structuredClone(state);
      const arr = getByPath(newState, action.path) || [];
      setByPath(newState, action.path, [...arr, action.value]);
      return newState;
    }

    case "REMOVE_PATH": {
      const newState = structuredClone(state);
      const arr = getByPath(newState, action.path) || [];
      arr.splice(action.index, 1);
      setByPath(newState, action.path, arr);
      return newState;
    }

    case "SET_PREVIEW":
      return { ...state, preview: action.payload };

    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };

    case "RESET_FORM":
      return initialState;

    case "CLEAR_MP_ADDITIONAL": {
      const newState = structuredClone(state);
      setByPath(
        newState,
        "formData.mpReport.individualDetails.tempOffender",
        null
      );
      setByPath(
        newState,
        "formData.mpReport.individualDetails.vehicleData",
        {}
      );
      return newState;
    }

    default:
      return state;
  }
}

/* ------------------------------------
   CONTEXT
------------------------------------ */
const FormContext = createContext<{
  state: GlobalFormState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used inside FormProvider");
  return ctx;
}
