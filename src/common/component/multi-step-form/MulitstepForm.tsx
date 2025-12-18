'use client'
import { useReducer } from "react";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";


const steps = [
  { id: 1, label: "Particulars", icon: "1" },
  { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
  { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
  { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
];


type State = {
  currentStep: number;
  completedSteps: number[];
  formData: {
    vehicleInvolved: string;
  };
};

type Action =
  | { type: "NEXT_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_FORM_DATA"; payload: Partial<State["formData"]> };


const initialState: State = {
  currentStep: 1,
  completedSteps: [],
  formData: {
    vehicleInvolved: "",
  },
};


function reducer(state: State, action: Action): State {
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
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}


export default function MultiStepForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white  rounded-lg overflow-hidden">
        <div className="flex min-h-[600px]">
          
          {/* LEFT STEPPER */}
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            onStepClick={(id) =>
              dispatch({ type: "SET_STEP", payload: id })
            }
          />

          {/* RIGHT PANEL */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
          />
        </div>
      </div>
    </div>
  );
}
