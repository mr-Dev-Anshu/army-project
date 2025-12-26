import { useForm } from "@/context/FormContext";

import { toast } from "react-toastify";
import Step1ReportDetails from "./steps/Step1ReportingDetails";
import Step2 from "./steps/Step2Particulars";
import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4IndividualDetails from "./steps/Step4IndividualDetails";
import Step5WitnessList from "./steps/Step5WitnessList";
import { title } from "process";
import Step6Evidence from "./steps/Step6Evidence";
import Step7Documents from "./steps/Step7Document";
import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
import Step10Opinion from "./steps/Step10Opinion";
import Step11Remarks from "./steps/Step11Remarks";

export default function MultiFormReport() {
  const { state, dispatch } = useForm();
  // ================= MP STEPPER STEPS =================
  const steps = [
    { id: 1, label: "Report Details", icon: "1" },
    { id: 2, label: "MP Particulars", icon: "2" },
    { id: 3, label: "Occurrence Details", icon: "3" },
    { id: 4, label: "Details of Individual", icon: "4" },
    { id: 5, label: "Witness", icon: "5" },
    { id: 6, label: "Evidence", icon: "6" },
    { id: 7, label: "Documents", icon: "7" },
    { id: 8, label: "Detailed Occurrence Report", icon: "8" },
    { id: 9, label: "Points found during investigation", icon: "9" },
    { id: 10, label: "Opinion", icon: "10" },
    { id: 11, label: "Remarks of CO/21C Provost Unit", icon: "11" },
  ];

  // ================= FINAL SUBMIT (Abhi sirf dummy toast, baad me API laga dena) =================
  const onSubmitFinal = async () => {
    toast.success("MP Investigation Report Submitted Successfully 🎉");
  };

  // ================= RIGHT PANEL STEP CONFIG =================
  const stepsConfig = {
    1: { title: "Report Details", component: <Step1ReportDetails /> },

    2: { title: "MP Particulars", component: <Step2 /> },

    3: {
      title: "Occurrence Details",
      component: <Step3OccurrenceDetails />,
    },
    4:{
        title: "Details of Individual",
        component:<Step4IndividualDetails/>
    },
    5:{
        title:"Witness",
        component :<Step5WitnessList/>
    },
    6:{
        title   :"Evidence",
        component :<Step6Evidence/>
    },
    7:{
        title:"Documents",
        component:<Step7Documents/>
    },
    8:{
        title:"Detailed Occurrence Report",
        component:<Step8DetailedOccurrence/>
    },
    9:{
        title:"Points found during investigation",
        component:<Step9InvestigationPoints/>
    },
    10:{
        title:"Opinion",
        component: <Step10Opinion/>
    },
    11:{
        title:"Remarks of CO/21C Provost Unit",
        component:<Step11Remarks/>
    }
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          {/* LEFT SIDE STEPPER */}
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New MP Occurrence & Investigation Report"
            reportNo="PRO/21 CPU/00042/106/25"
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          {/* RIGHT SIDE DYNAMIC CONTENT */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mode="mp"
          />
        </div>
      </div>
    </div>
  );
}
