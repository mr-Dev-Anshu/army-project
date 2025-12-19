import { useForm } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";


export default function MultiStepForm() {
  const { state, dispatch } = useForm();

  const steps = [
  { id: 1, label: "Particulars", icon: "1" },
  { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
  { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
  { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
];

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg overflow-hidden h-full">
        
        <div className="flex h-full">

          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            onStepClick={(id) =>
              dispatch({ type: "SET_STEP", payload: id })
            }
          />

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
