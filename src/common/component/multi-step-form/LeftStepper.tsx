"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";

interface Step {
  id: number;
  label: string;
  icon: string | React.ReactNode;
}

interface Props {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (id: number) => void;
  title?: string;
  reportNo?: string;
}

export const LeftStepper = ({
  steps,
  currentStep,
  completedSteps,
  title,
  reportNo,
  onStepClick,
}: Props) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (Array.isArray(completedSteps) && completedSteps.includes(id))
      return "completed";
    return "pending";
  };

  useForm();
  const { dispatch } = useForm();

  return (
    <div className="w-full lg:w-[380px] h-full p-4 sm:p-5 md:p-6 bg-gray-900 text-white rounded-xl flex flex-col">
      {/* HEADER */}
      <div>
        <h2 className="font-bold mb-3 sm:mb-4 text-lg sm:text-xl">
          {title || "Create New General & Traffic Offence Record"}
        </h2>

        {reportNo && (
          <p className="text-xs text-gray-400">REPORT NO. {reportNo}</p>
        )}
      </div>

      {/* STEPS */}
      <div
        className="mt-6 flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        {steps.map((step, index) => {
          const status = getStatus(step.id);

          return (
            <div key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg text-left transition
                  ${
                    status === "active"
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-full font-semibold
                    w-10 h-10 sm:w-12 sm:h-12
                    ${
                      status === "completed"
                        ? "bg-green-500"
                        : status === "active"
                        ? "bg-blue-500"
                        : "bg-gray-600"
                    }
                  `}
                >
                  {status === "completed" ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>

                <span className="text-base sm:text-lg text-gray-300 whitespace-pre-line">
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="ml-9 pl-4 h-8 border-l-2 border-dashed border-gray-700" />
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button className="w-full sm:w-fit border border-gray-50 bg-transparent">
          Cancel
        </Button>

        <Button
      className="w-full sm:flex-1 bg-blue-600"
      onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
    >
      Preview & Save Report
    </Button>
      </div>
    </div>
  );
};
 