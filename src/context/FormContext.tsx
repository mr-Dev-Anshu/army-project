// "use client";
// import { createContext, useContext, useReducer, ReactNode } from "react";
// import { Action, GlobalFormState } from "@/common/types/form.types";

// const initialState: GlobalFormState = {
//   currentStep: 1,
//   completedSteps: [],

//   formData: {
//     vehicleInvolved: "",

//     vehicleDetails: {
//       category: "",
//       vehicleType: "",
//       driverType: "",
//     },

//     offenderWithoutVehicle: {
//       offenderType: "",
//       military: {
//         armyNumber: "",
//         rank: "",
//         name: "",
//         unit: "",
//         fmn: "",
//         command: "",
//         address: "",
//         iCardNumber: "",
//       },
//     },

//     //  NEW — STORE OFFENDER FORM DATA HERE
//     offenderDetails: {},

//     //  PHASE-1
//     onDutyDetails: {
//       dateOfDuty: "",
//       startTime: "",
//       endTime: "",
//       dutyLocation: "",
//       dutyType: "",
//     },

//     onDutyDetailsMPReporting: {
//       nameReportingMP: "",
//       rank: "",
//       unit: "",
//       armyNumber: "",
//     },

//     offenceOccurenceDetails: {
//       timeOfOffence: "",
//       incidentLocation: "",
//       description: "",
//     },

//     offenceTypes: [],
//     offenceCode: [],

//     //  PHASE-2
//     witnesses: [],
//     offenderPeople: [],
//   },
// };

// function reducer(state: GlobalFormState, action: Action): GlobalFormState {
//   switch (action.type) {
//     case "NEXT_STEP":
//       return {
//         ...state,
//         completedSteps: state.completedSteps.includes(state.currentStep)
//           ? state.completedSteps
//           : [...state.completedSteps, state.currentStep],
//         currentStep: state.currentStep + 1,
//       };

//     case "SET_STEP":
//       return { ...state, currentStep: action.payload };

//     case "SET_FORM_DATA":
//       return {
//         ...state,
//         formData: { ...state.formData, ...action.payload },
//       };

//     case "SET_VEHICLE_DETAILS":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           vehicleDetails: {
//             ...state.formData.vehicleDetails,
//             ...action.payload,
//           },
//         },
//       };

//     case "SET_OFFENDER_TYPE":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           offenderWithoutVehicle: {
//             ...state.formData.offenderWithoutVehicle,
//             offenderType: action.payload,
//           },
//         },
//       };

//     case "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           offenderWithoutVehicle: {
//             ...state.formData.offenderWithoutVehicle,
//             ...action.payload,
//           },
//         },
//       };

//     case "SET_OFFENDER_PEOPLE":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           offenderPeople: action.payload,
//         },
//       };

//     //  NEW — SAVE DYNAMIC OFFENDER FIELDS
//     case "SET_OFFENDER_DETAILS":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           offenderDetails: {
//             ...state.formData.offenderDetails,
//             ...action.payload,
//           },
//         },
//       };

//     default:
//       return state;
//   }
// }

// const FormContext = createContext<{
//   state: GlobalFormState;
//   dispatch: React.Dispatch<Action>;
// } | null>(null);

// export function FormProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   return (
//     <FormContext.Provider value={{ state, dispatch }}>
//       {children}
//     </FormContext.Provider>
//   );
// }

// export function useForm() {
//   const ctx = useContext(FormContext);
//   if (!ctx) throw new Error("useForm must be used inside FormProvider");
//   return ctx;
// }

"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { Action, GlobalFormState } from "@/common/types/form.types";

const initialState: GlobalFormState = {
  currentStep: 1,
  completedSteps: [],

  formData: {
    vehicleInvolved: "",

    vehicleDetails: {
      category: "",
      vehicleType: "",
      driverType: "",
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

    // STEP-2
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
    },

    offenceOccurenceDetails: {
      timeOfOffence: "",
      incidentLocation: "",
      description: "",
      authSpeed: "30", // default
      actualSpeed: "",
      overSpeed: "",
    },

    offenceTypes: [],
    offenceCode: [],

    // STEP-3 / PHASE-2
    witnesses: [
      {
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
        },
        offenceBlock: {
          timeOfOffence: "",
          incidentLocation: "",
          description: "",
        },
      },
    ],

    offenderPeople: [],
  },
};

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

    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "SET_FORM_DATA":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };

    case "SET_VEHICLE_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          vehicleDetails: {
            ...state.formData.vehicleDetails,
            ...action.payload,
          },
        },
      };

    case "SET_OFFENDER_TYPE":
      return {
        ...state,
        formData: {
          ...state.formData,
          offenderWithoutVehicle: {
            ...state.formData.offenderWithoutVehicle,
            offenderType: action.payload,
          },
        },
      };

    case "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          offenderWithoutVehicle: {
            ...state.formData.offenderWithoutVehicle,
            ...action.payload,
          },
        },
      };

    case "SET_OFFENDER_PEOPLE":
      return {
        ...state,
        formData: {
          ...state.formData,
          offenderPeople: action.payload,
        },
      };

    case "SET_OFFENDER_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          offenderDetails: {
            ...state.formData.offenderDetails,
            ...action.payload,
          },
        },
      };

    // ⭐ WITNESSES HANDLE HERE
    case "SET_WITNESSES":
      return {
        ...state,
        formData: {
          ...state.formData,
          witnesses: action.payload,
        },
      };

    default:
      return state;
  }
}

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
