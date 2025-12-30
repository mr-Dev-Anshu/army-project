"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";
import React from "react";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface LeftStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  title?: string;
  reportNo?: string;
  onStepClick: (id: number) => void;
}

export const LeftStepper = ({
  steps,
  currentStep,
  completedSteps,
  title,
  reportNo,
  onStepClick,
}: LeftStepperProps) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (completedSteps?.includes(id)) return "completed";
    return "pending";
  };

  const { dispatch } = useForm();

  return (
    <div
      className="
      w-full 
      lg:w-[380px] 
      h-full 
      bg-gray-900 text-white 
      rounded-xl 
      flex flex-col 
      p-3 sm:p-4 md:p-6
    "
    >
      {/* HEADER */}
      <div>
        <h2 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
          {title || "Create New General & Traffic Offence Record"}
        </h2>

        {reportNo && (
          <p className="text-[10px] sm:text-xs text-gray-400">
            REPORT NO. {reportNo}
          </p>
        )}
      </div>

      {/* STEPS */}
      <div
        className="
          mt-4 sm:mt-6 
          flex-1 
          overflow-y-auto 
          space-y-2
          pr-1 
          custom-scrollbar
        "
      >
        {steps.map((step, index) => {
          const status = getStatus(step.id);

          return (
            <div key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`
                  w-full 
                  flex 
                  items-start 
                  gap-2 sm:gap-3 
                  p-2.5 sm:p-3 md:p-4 
                  rounded-lg 
                  text-left 
                  transition
                  ${
                    status === "active"
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center
                    rounded-full font-semibold
                    flex-shrink-0
                    aspect-square
                    w-9 sm:w-10 md:w-12
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
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    step.icon
                  )}
                </div>

                <span
                  className="
                    text-sm sm:text-base md:text-lg 
                    text-gray-300 
                    leading-tight
                    break-words
                  "
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="ml-[34px] sm:ml-[32px] md:ml-[42px] pl-4 h-6 sm:h-8 border-l-2 border-dashed border-gray-700" />
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button
          className="
            w-full 
            sm:w-fit 
            border border-gray-50 
            bg-transparent
            text-sm sm:text-base
          "
        >
          Cancel
        </Button>

        <Button
          className="w-full sm:flex-1 bg-blue-600 text-sm sm:text-base"
          onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
        >
          Preview & Save Report
        </Button>
      </div>
    </div>
  );
};
