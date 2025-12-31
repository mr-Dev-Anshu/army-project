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
  onNext: () => void;
  onPrev?: () => void;
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
      {/* OUTER BORDER BOX */}
      <div className="border rounded-lg w-full h-full flex flex-col">
        {/* ---------- HEADER (FIXED) ---------- */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between 
        px-4 py-3 border-b bg-white"
        >
          <h3 className="font-bold text-base sm:text-lg lg:text-xl">
            {current?.title || "Step"}
          </h3>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-xs bg-gray-100 cursor-pointer text-black"
              onClick={() => {
                if (mode === "traffic") {
                  dispatch({
                    type: "SET_PATH",
                    path: "formData.traffic",
                    value: {
                      vehicleInvolved: "",
                      vehicleDetails: {},
                      offenderWithoutVehicle: {},
                      offenderPeople: [],
                      witnesses: [],
                      selectedWitness: null,
                      offenceOccurenceDetails: {},
                      onDutyDetails: {},
                      onDutyDetailsMPReporting: {},
                      offenceTypes: [],
                      offenceCode: [],
                      remarks: "",
                    },
                  });
                }

                if (mode === "static") {
                  dispatch({
                    type: "SET_PATH",
                    path: "formData.staticSpeed",
                    value: {
                      vehicleDetails: {
                        vehicleType: "",
                        category: "",
                      },
                      offenceOccurenceDetails: {
                        description: "",
                      },
                      witnesses: [],
                    },
                  });
                }

                if (mode === "mp") {
                  dispatch({
                    type: "SET_PATH",
                    path: "formData.mpReport",
                    value: {}, // jo tum chaho structure set kar sakte ho
                  });
                }
              }}
            >
              <CiEraser size={16} />
              Clear Form
            </Button>

            <Button className="bg-black text-white" variant="outline" size="sm">
              <Eye size={16} />
            </Button>
          </div>
        </div>

        {/* ---------- SCROLL AREA (ONLY THIS SCROLLS) ---------- */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            px-4 py-4 
            text-xs sm:text-sm lg:text-base
          "
        >
          {current?.component || <p>Step Content Coming Soon...</p>}
        </div>

        {/* ---------- FOOTER (FIXED) ---------- */}
        <div className="border-t px-4 py-3 bg-white flex flex-col sm:flex-row justify-between gap-2">
          <Button
            className="bg-black text-white flex items-center justify-center"
            disabled={step === 1}
            onClick={() => onPrev?.()}
          >
            <FaArrowLeftLong size={16} className="mr-2" />
            Back
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {!isLastStep && (
              <Button
                onClick={onNext}
                disabled={isNextDisabled()}
                className="bg-blue-500 text-white disabled:bg-gray-400 
                w-full sm:w-auto"
              >
                Save & Next
                <ChevronRight className="ml-2" />
              </Button>
            )}

            {isLastStep && (
              <Button
                className="bg-black text-white w-full sm:w-auto"
                onClick={onSubmitFinal}
              >
                Submit & Create Offence
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
