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
}

const titles: Record<number, string> = {
  1: "1. PARTICULARS:",
  2: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
  3: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
  4: "4. REMARKS OF CO/2IC PROVOST UNIT:",
};

export const RightPanel = ({ step, formData, setFormData, onNext }: Props) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Particulars
            value={formData.vehicleInvolved}
            onChange={(v: string) =>
              setFormData({ ...formData, vehicleInvolved: v })
            }
          />
        );

      case 2:
        return <Step2Statement formData={formData} setFormData={setFormData} />;

      case 3:
        return <Step3Offence formData={formData} setFormData={setFormData} />;

      // ❗ Only keep this IF Step4Remarks exists
      case 4:
        return <Step4Remarks formData={formData} setFormData={setFormData} />;

      default:
        return <p>Step Content Coming Soon...</p>;
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.vehicleInvolved;
    return false;
  };

  return (
    <div className="flex-1 h-full p-8 flex flex-col">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between mb-6">
        <h3 className="text-2xl font-bold">{titles[step]}</h3>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <RotateCcw size={16} /> Clear
          </Button>
          <Button variant="ghost" size="sm">
            <Eye size={16} />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-6  overflow-y-auto">
        {renderStep()}
      </div>

      {step !== 4 && (
        <div className="flex justify-end mt-6 mt-auto">
          <Button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="bg-blue-600 disabled:bg-gray-400"
          >
            Save & Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
