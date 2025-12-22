


"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, RotateCcw } from "lucide-react";
import { FormDataState } from "@/common/types/form.types";

interface StepConfig {
  title: string;
  component: React.ReactNode;
}

interface Props {
  step: number;
  formData: FormDataState;
  setFormData: (d: Partial<FormDataState>) => void;
  onNext: () => void;
  onSubmitFinal: () => void;

  // NOTE: Record<string> so string + number keys dono chale
  stepsConfig: Record<string, StepConfig>;
}

export const RightPanel = ({
  step,
  formData,
  onNext,
  onSubmitFinal,
  stepsConfig,
}: Props) => {

  // convert step to string safely
  const current = stepsConfig?.[String(step)];

  const isNextDisabled = () => {
    if (step === 1) return !formData.vehicleInvolved;
    return false;
  };

  return (
    <div className="
        flex-1 
        h-full 
        p-4 sm:p-6 lg:p-8 
        flex flex-col 
        w-full
        overflow-hidden
      "
    >
      {/* ---------- HEADER ---------- */}
      <div className="
          flex flex-col 
          sm:flex-row sm:items-center 
          justify-between 
          mb-4 sm:mb-6 
          gap-3
        "
      >
        <h3 className="font-bold leading-tight text-lg sm:text-xl lg:text-2xl">
          {current?.title || "Step"}
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
      <div className="
          border rounded-lg 
          p-4  sm:p-5 lg:px-6
          mb-4 sm:mb-6 
          overflow-y-auto
          max-h-[60vh] sm:max-h-[70vh] lg:max-h-none
        "
      >
        {current?.component || <p>Step Content Coming Soon...</p>}
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="mt-auto flex flex-col sm:flex-row justify-end gap-2">
        {step !== 4 && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="bg-blue-600 disabled:bg-gray-400 w-full sm:w-auto"
          >
            Save & Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        )}

        {step === 4 && (
          <Button
            className="bg-blue-600 w-full sm:w-auto"
            onClick={onSubmitFinal}
          >
            Submit & Create Offence
          </Button>
        )}
      </div>
    </div>
  );
};
