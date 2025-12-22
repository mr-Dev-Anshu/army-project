
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

//     offenderDetails: {},

//     // STEP-2
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
//       authSpeed: "30", // default
//       actualSpeed: "",
//       overSpeed: "",
//     },

//     offenceTypes: [],
//     offenceCode: [],

//     // STEP-3 / PHASE-2
//     witnesses: [
//       {
//         dutyBlock: {
//           dateOfDuty: "",
//           startTime: "",
//           endTime: "",
//           dutyLocation: "",
//           dutyType: "",
//         },
//         reportingBlock: {
//           nameReportingMP: "",
//           rank: "",
//           unit: "",
//           armyNumber: "",
//         },
//         offenceBlock: {
//           timeOfOffence: "",
//           incidentLocation: "",
//           description: "",
//         },
//       },
//     ],

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

//     // ⭐ WITNESSES HANDLE HERE
//     case "SET_WITNESSES":
//       return {
//         ...state,
//         formData: {
//           ...state.formData,
//           witnesses: action.payload,
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
    /* ================= TRAFFIC FORM ================= */
    traffic: {
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
      },

      offenceTypes: [],
      offenceCode: [],

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

    /* ================= STATIC SPEED FORM ================= */
    staticSpeed: {
      vehicleDetails: {
        category: "",
        vehicleType: "",
        driverType: "",
      },

      witnesses: [],

      offenceOccurenceDetails: {
        timeOfOffence: "",
        incidentLocation: "",
        description: "",
        authSpeed: "30",
        actualSpeed: "",
        overSpeed: "",
      },
    },
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

    /* ========= GENERIC FORM DATA MERGE ========= */
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };

    /* ========= TRAFFIC VEHICLE ========= */
    case "SET_VEHICLE_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            vehicleDetails: {
              ...state.formData.traffic.vehicleDetails,
              ...action.payload,
            },
          },
        },
      };

    case "SET_OFFENDER_TYPE":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            offenderWithoutVehicle: {
              ...state.formData.traffic.offenderWithoutVehicle,
              offenderType: action.payload,
            },
          },
        },
      };

    case "SET_OFFENDER_WITHOUT_VEHICLE_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            offenderWithoutVehicle: {
              ...state.formData.traffic.offenderWithoutVehicle,
              ...action.payload,
            },
          },
        },
      };

    case "SET_OFFENDER_PEOPLE":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            offenderPeople: action.payload,
          },
        },
      };

    case "SET_OFFENDER_DETAILS":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            offenderDetails: {
              ...state.formData.traffic.offenderDetails,
              ...action.payload,
            },
          },
        },
      };

    /* ========= TRAFFIC WITNESSES ========= */
    case "SET_WITNESSES":
      return {
        ...state,
        formData: {
          ...state.formData,
          traffic: {
            ...state.formData.traffic,
            witnesses: action.payload,
          },
        },
      };

    /* ========= STATIC SPEED WITNESSES ========= */
    case "SET_STATIC_WITNESSES":
      return {
        ...state,
        formData: {
          ...state.formData,
          staticSpeed: {
            ...state.formData.staticSpeed,
            witnesses: action.payload,
          },
        },
      };

    /* ========= STATIC SPEED UPDATE ========= */
    case "SET_STATIC_SPEED_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          staticSpeed: {
            ...state.formData.staticSpeed,
            ...action.payload,
          },
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
