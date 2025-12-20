// "use client";
// import { Check, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useForm } from "@/context/FormContext";
// import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";

// interface Step {
//   id: number;
//   label: string;
//   icon: string;
// }

// interface Props {
//   steps: Step[];
//   currentStep: number;
//   completedSteps: number[];
//   onStepClick: (id: number) => void;
// }

// export const LeftStepper = ({
//   steps,
//   currentStep,
//   completedSteps,
//   onStepClick,
// }: Props) => {
//   const getStatus = (id: number) => {
//     if (id === currentStep) return "active";
//     if (Array.isArray(completedSteps) && completedSteps.includes(id))
//       return "completed";
//     return "pending";
//   };

//   const { state } = useForm();
  

//   return (
//     <div className="w-full h-full lg:w-100 flex flex-col justify-between bg-gray-900 text-white p-6 rounded-xl">
//       <h2 className="text-xl font-bold mb-8">
//         Create New General & Traffic Offence Record
//       </h2>

//       <div className="space-y-1 relative -top-36">
//         {steps.map((step, index) => {
//           const status = getStatus(step.id);

//           return (
//             <div key={step.id}>
//               <button
//                 onClick={() => onStepClick(step.id)}
//                 className={`w-full flex items-start gap-3 p-3 rounded-lg text-left ${
//                   status === "active" ? "bg-gray-800" : "hover:bg-gray-800"
//                 }`}
//               >
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center text-md font-semibold ${
//                     status === "completed"
//                       ? "bg-green-500"
//                       : status === "active"
//                       ? "bg-blue-500"
//                       : "bg-gray-600"
//                   }`}
//                 >
//                   {status === "completed" ? <Check size={24} /> : step.icon}
//                 </div>

//                 <span className="text-lg whitespace-pre-line text-gray-300">
//                   {step.label}
//                 </span>
//               </button>

//               {index < steps.length - 1 && (
//                 <div className="ml-4 pl-4 h-8 border-l-2 border-dashed border-gray-600" />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-8 w-fit flex gap-2">
//         <Button className="w-fit border-1 border-gray-50 bg-transparent">
//           Cancel
//         </Button>
//         <Button  className="w-full bg-blue-600">
//           Preview & Save Report
//         </Button>
//       </div>
//     </div>
//   );
// };



"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";

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
    if (Array.isArray(completedSteps) && completedSteps.includes(id))
      return "completed";
    return "pending";
  };

  useForm();

  return (
    <div
      className="
        w-full 
        lg:w-100 
        h-full 
        p-4 
        sm:p-5 
        md:p-6
        
        bg-gray-900 
        text-white 
        rounded-xl 
        flex 
        flex-col 
        justify-between
      "
    >
      {/* Heading */}
      <h2
        className="
          font-bold 
          mb-6 
          sm:mb-8 
          text-lg 
          sm:text-xl
        "
      >
        Create New General & Traffic Offence Record
      </h2>

      {/* Steps List */}
      <div
        className="
          space-y-1 
          relative 
       
          lg:-top-36 
          max-h-[60vh] 
          md:max-h-[70vh] 
          lg:max-h-none 
          overflow-y-auto
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
                  gap-3 
                  p-3 
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
                {/* Step Icon */}
                <div
                  className={`
                    flex
                    items-center
                    justify-center

                    rounded-full 
                    font-semibold

                    /* responsive size */
                    w-10 h-10 
                    sm:w-12 sm:h-12

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
                    <Check
                      className="
                        w-6 h-6
                        sm:w-6 sm:h-6
                      "
                    />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Label */}
                <span
                  className="
                    text-base
                    sm:text-lg
                    text-gray-300
                    whitespace-pre-line
                  "
                >
                  {step.label}
                </span>
              </button>

              {/* Divider */}
              {index < steps.length - 1 && (
                <div className="ml-4 pl-4 h-8 border-l-2 border-dashed border-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div
        className="
          mt-6 
          sm:-mt-52 
          flex 
          flex-col 
          sm:flex-row 
          gap-2
          w-full
        "
      >
        <Button
          className="
            w-full 
            sm:w-fit 
            border 
            border-gray-50 
            bg-transparent
          "
        >
          Cancel
        </Button>

        <Button
          className="
            w-full 
            sm:flex-1 
            bg-blue-600
          "
        >
          Preview & Save Report
        </Button>
      </div>
    </div>
  );
};
