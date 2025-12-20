
"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, RotateCcw } from "lucide-react";

import Step2Statement from "./steps/Step2Statement";
import Step3Offence from "./steps/Step3Offence";
import Step4Remarks from "./steps/Step4Remarks";
import Step1Particulars from "./steps/Step1Particulars";
import { FormDataState } from "@/common/types/form.types";

interface Props {
  step: number;
  formData: FormDataState;
  setFormData: (d: Partial<FormDataState>) => void;
  onNext: () => void;
  onSubmitFinal: () => void;
}

const titles: Record<number, string> = {
  1: "1. PARTICULARS:",
  2: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
  3: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
  4: "4. REMARKS OF CO/2IC PROVOST UNIT:",
};

export const RightPanel = ({
  step,
  formData,
  setFormData,
  onNext,
  onSubmitFinal,
}: Props) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Particulars
            value={formData.vehicleInvolved}
            onChange={(v: string) => setFormData({ vehicleInvolved: v })}
          />
        );

      case 2:
        return (
          <Step2Statement
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 3:
        return (
          <Step3Offence
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 4:
        return (
          <Step4Remarks
            formData={formData}
            setFormData={setFormData}
          />
        );

      default:
        return <p>Step Content Coming Soon...</p>;
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.vehicleInvolved;
    return false;
  };

  return (
    <div
      className="
        flex-1 
        h-full 
        
        /* Responsive padding */
        p-4 
        sm:p-6 
        lg:p-8 
        
        flex 
        flex-col 
        
        overflow-hidden
      "
    >
      {/* ---------- HEADER ---------- */}
      <div
        className="
          flex 
          flex-col 
          sm:flex-row 
          sm:items-center 
          justify-between 
          mb-4 
          sm:mb-6 
          gap-3
        "
      >
        <h3
          className="
            font-bold 
            leading-tight
            text-lg
            sm:text-xl
            lg:text-2xl
          "
        >
          {titles[step]}
        </h3>

        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" size="sm">
            <RotateCcw size={16} /> Clear
          </Button>

          <Button variant="ghost" size="sm">
            <Eye size={16} />
          </Button>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div
        className="
          border 
          rounded-lg 
          p-4 
          sm:p-5 
          lg:px-0 
          
          mb-4 
          sm:mb-6 

          /* Mobile safe scroll */
          overflow-y-auto
          max-h-[60vh] 
          sm:max-h-[70vh] 
          lg:max-h-none
        "
      >
        {renderStep()}
      </div>

      {/* ---------- FOOTER BUTTONS ---------- */}
      <div
        className="
          mt-auto 
          flex 
          flex-col 
          sm:flex-row 
          justify-end 
          gap-2
        "
      >
        {step !== 4 && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="
              bg-blue-600 
              disabled:bg-gray-400 
              w-full 
              sm:w-auto
            "
          >
            Save & Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        )}

        {step === 4 && (
          <Button
            className="
              bg-blue-600 
              w-full 
              sm:w-auto
            "
            onClick={onSubmitFinal}
          >
            Submit & Create Offence
          </Button>
        )}
      </div>
    </div>
  );
};
