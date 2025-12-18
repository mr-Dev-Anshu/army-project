import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  label: string;
  icon: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (id: number) => void;
}

export const LeftStepper = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: Props) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (completedSteps.includes(id)) return "completed";
    return "pending";
  };

  return (
    <div className="w-full lg:w-100 flex flex-col justify-between bg-gray-900 text-white p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-8">
        Create New General & Traffic Offence Record
      </h2>

      <div className="space-y-1">
        {steps.map((step, index) => {
          const status = getStatus(step.id);

          return (
            <div key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left ${
                  status === "active" ? "bg-gray-800" : "hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    status === "completed"
                      ? "bg-green-500"
                      : status === "active"
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                >
                  {status === "completed" ? <Check size={18} /> : step.icon}
                </div>

                <span className="text-sm whitespace-pre-line text-gray-300">
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="ml-4 pl-4 h-8 border-l-2 border-dashed border-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 w-fit flex gap-2">
        <Button  className="w-fit border-1 border-gray-50 bg-transparent">
          Cancel
        </Button>
        <Button className="w-full bg-blue-600">
          Preview & Save Report
        </Button>
      </div>
    </div>
  );
};
