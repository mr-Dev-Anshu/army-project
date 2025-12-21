import { useForm } from "@/context/FormContext";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4Remarks from "../multi-step-form/steps/Step4Remarks";
import StaticSpeedStep1Particulars from "./steps/Step1";
import Step2Statement from "./steps/step2";
import Step3Offence from "./steps/step3";


export default function StaticSpeedForm() {
  const { state, dispatch } = useForm();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed/\nOrders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  // ------------ ⭐ IMPORTANT: Static Speed Steps Config ⭐ ------------
  const stepsConfig = {
    1: {
      title: "1. PARTICULARS:",
      component: (
        <StaticSpeedStep1Particulars
        
        />
      ),
    },

    2: {
      title: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
      component: (
        <Step2Statement
          formData={state.formData}
          setFormData={(d) =>
            dispatch({ type: "SET_FORM_DATA", payload: d })
          }
        />
      ),
    },

    3: {
      title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
      component: (
        <Step3Offence
          formData={state.formData}
          setFormData={(d) =>
            dispatch({ type: "SET_FORM_DATA", payload: d })
          }
        />
      ),
    },

    4: {
      title: "4. REMARKS OF CO/2IC PROVOST UNIT:",
      component: (
        <Step4Remarks
          formData={state.formData}
          setFormData={(d) =>
            dispatch({ type: "SET_FORM_DATA", payload: d })
          }
        />
      ),
    },
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">

          {/* LEFT PANEL */}
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New Static Speed Check Record"
            reportNo="PRO/21 CPU/00042/106/25"
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          {/* RIGHT PANEL */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={() => {}}
            stepsConfig={stepsConfig}   //  ← ⭐ YAHAN PASS KAR DIYA
          />
        </div>
      </div>
    </div>
  );
}
