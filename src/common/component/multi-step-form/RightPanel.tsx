
"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye } from "lucide-react";
import { CiEraser } from "react-icons/ci";
import { FormDataState } from "@/common/types/form.types";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from "@/context/FormContext";

interface StepConfig {
  title: string;
  component: React.ReactNode;
}

interface Props {
  step: number;
  formData: FormDataState;
  setFormData?: (path: string, value: unknown) => void;
  onNext: () => void;
  onPrev?: () => void; // ⬅️ made optional
  onSubmitFinal: () => void;
  stepsConfig: Record<string, StepConfig>;
  mode?: "traffic" | "static" | "mp";
}

export const RightPanel = ({
  step,
  formData,
  onNext,
  onPrev,
  onSubmitFinal,
  stepsConfig,
  mode,
}: Props) => {
  const { dispatch } = useForm();

  const current = stepsConfig?.[String(step)];
  const totalSteps = Object.keys(stepsConfig || {}).length;
  const isLastStep = step === totalSteps;

  const isNextDisabled = () => {
    if (mode === "static" && step === 1) {
      const vd = formData.staticSpeed?.vehicleDetails;
      return !(vd?.vehicleType && vd?.category);
    }

    if (mode === "traffic" && step === 1) {
      return !formData.traffic?.vehicleInvolved;
    }

    return false;
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-5 lg:p-8 flex flex-col w-full overflow-hidden">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-5 lg:mb-6 gap-2 sm:gap-3">
        <h3
          className="font-bold leading-tight 
          text-base sm:text-lg lg:text-xl"
        >
          {current?.title || "Step"}
        </h3>

        <div className="flex gap-2 ">
          <Button
            size="sm"
            className="text-xs bg-gray-100 text-black sm:text-xs"
          >
            <CiEraser size={14} className="sm:size-[16px]" /> Clear Form
          </Button>

          <Button className="bg-black text-white" variant="outline" size="sm">
            <Eye size={14} className="sm:size-[16px]" />
          </Button>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div
        className="
        border rounded-lg 
        p-3 sm:p-4 lg:px-6
        mb-3 sm:mb-5 
        overflow-y-auto
        max-h-[58vh] sm:max-h-[70vh] lg:max-h-none 
        text-xs sm:text-sm lg:text-base
      "
      >
        {current?.component || <p>Step Content Coming Soon...</p>}
      </div>

  

      {/* ---------- FOOTER ---------- */}
      <div className="mt-auto flex flex-col sm:flex-row justify-between gap-2">
        <Button
          className="bg-black text-white flex items-center justify-center"
          disabled={step === 1}
          onClick={() => {
            console.log("BACK CLICKED", step);
            onPrev?.();
          }}
        >
          <FaArrowLeftLong size={14} className="sm:size-[16px] mr-2" />
        </Button>

        {/* RIGHT SIDE — NEXT / SUBMIT */}
        <div className="flex gap-2 w-full sm:w-auto">
          {!isLastStep && (
            <Button
              onClick={onNext}
              disabled={isNextDisabled()}
              className="bg-blue-500 text-white disabled:bg-gray-400 
          w-full sm:w-auto text-xs sm:text-sm lg:text-base"
            >
              Save & Next
              <ChevronRight size={14} className="sm:size-[16px] ml-2" />
            </Button>
          )}

          {isLastStep && (
            <Button
              className="bg-black text-white w-full sm:w-auto text-xs sm:text-sm lg:text-base"
              onClick={onSubmitFinal}
            >
              Submit & Create Offence
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
