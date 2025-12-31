// "use client";
// import { Button } from "@/components/ui/button";
// import { ChevronRight, Eye } from "lucide-react";
// import { CiEraser } from "react-icons/ci";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { useForm } from "@/context/FormContext";
// import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";

// interface StepConfig {
//   title: string;
//   component: React.ReactNode;
// }

// export const RightPanel = ({
//   step,
//   formData,
//   onNext,
//   onPrev,
//   stepsConfig,
//   mode,
//   mapTrafficToReport,
// }: any) => {
//   const { state, dispatch } = useForm();

//   const current = stepsConfig?.[String(step)];
//   const totalSteps = Object.keys(stepsConfig || {}).length;
//   const isLastStep = step === totalSteps;

//   const isNextDisabled = () => {
//     if (mode === "static" && step === 1) {
//       const vd = formData.staticSpeed?.vehicleDetails;
//       return !(vd?.vehicleType && vd?.category);
//     }

//     if (mode === "traffic" && step === 1)
//       return !formData.traffic?.vehicleInvolved;

//     return false;
//   };

//   return (
//     <div className="flex-1 h-full p-3 sm:p-5 lg:p-8 flex flex-col w-full overflow-hidden">
//       <div className="border rounded-lg w-full h-full flex flex-col">
//         {/* HEADER */}
//         <div className="flex justify-between px-4 py-3 border-b bg-white">
//           <h3 className="font-bold text-lg">{current?.title || "Step"}</h3>

//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               className="text-xs bg-gray-100 text-black"
//               onClick={() =>
//                 dispatch({
//                   type: "SET_PATH",
//                   path: "formData.traffic",
//                   value: {},
//                 })
//               }
//             >
//               <CiEraser size={16} /> Clear
//             </Button>

//             <Button variant="outline" size="sm">
//               <Eye size={16} />
//             </Button>
//           </div>
//         </div>

//         {/* SCROLL BODY */}
//         <div className="flex-1 overflow-y-auto px-4 py-4">
//           {!state.preview ? (
//             current?.component || <p>Step Coming…</p>
//           ) : (
//             <MilitaryPoliceReport
//               {...mapTrafficToReport(state.formData.traffic)}
//             />
//           )}
//         </div>

//         {/* FOOTER */}
//         {!state.preview && (
//           <div className="border-t px-4 py-3 bg-white flex justify-between gap-2">
//             <Button
//               className="bg-black text-white"
//               disabled={step === 1}
//               onClick={() => onPrev?.()}
//             >
//               <FaArrowLeftLong className="mr-2" />
//               Back
//             </Button>

//             {!isLastStep ? (
//               <Button
//                 onClick={onNext}
//                 disabled={isNextDisabled()}
//                 className="bg-blue-500 text-white"
//               >
//                 Save & Next
//                 <ChevronRight className="ml-2" />
//               </Button>
//             ) : (
//               <Button
//                 className="bg-blue-500 text-white"
//                 onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
//               >
//                 Preview Report
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Cross, Eye } from "lucide-react";
import { CiEraser } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from "@/context/FormContext";
import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";

export const RightPanel = ({
  step,
  formData,
  onNext,
  onPrev,
  stepsConfig,
  mode,
  mapTrafficToReport,
}: any) => {
  const { state, dispatch } = useForm();

  const current = stepsConfig?.[String(step)];
  const totalSteps = Object.keys(stepsConfig || {}).length;
  const isLastStep = step === totalSteps;

  const isNextDisabled = () => {
    if (mode === "static" && step === 1)
      return !(
        formData.staticSpeed?.vehicleDetails?.vehicleType &&
        formData.staticSpeed?.vehicleDetails?.category
      );

    if (mode === "traffic" && step === 1)
      return !formData.traffic?.vehicleInvolved;

    return false;
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-5 lg:p-8 flex flex-col w-full overflow-hidden">
      <div className="border rounded-lg w-full h-full flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between px-4 py-3 border-b bg-white">
          <h3 className="font-bold text-lg">{current?.title || "Step"}</h3>

          {!state.preview && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="text-xs bg-gray-100 text-black"
                onClick={() =>
                  dispatch({
                    type: "SET_PATH",
                    path: "formData.traffic",
                    value: {},
                  })
                }
              >
                <CiEraser size={16} /> Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
              >
                <Eye size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* ==== FORM MODE ==== */}
          {!state.preview && (current?.component || <p>Step Coming…</p>)}

          {/* ==== PREVIEW MODE ==== */}
          {state.preview && (
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between mb-3">
                <h2 className="text-xl font-bold">REPORT PREVIEW</h2>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    🖨️ Print
                  </Button>

                  <Button
                    size="sm"
                    className="bg-black text-white"
                    onClick={() =>
                      dispatch({ type: "SET_PREVIEW", payload: false })
                    }
                  >
                    close
                  </Button>
                </div>
              </div>

              <div className="border bg-white shadow-lg rounded-md p-4">
                <MilitaryPoliceReport
                  {...mapTrafficToReport(state.formData.traffic)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {!state.preview && (
          <div className="border-t px-4 py-3 bg-white flex justify-between gap-2">
            <Button
              className="bg-black text-white"
              disabled={step === 1}
              onClick={() => onPrev?.()}
            >
              <FaArrowLeftLong className="mr-2" />
              Back
            </Button>

            {/* NOT LAST STEP */}
            {!isLastStep && (
              <Button
                onClick={onNext}
                disabled={isNextDisabled()}
                className="bg-blue-500 text-white"
              >
                Save & Next
                <ChevronRight className="ml-2" />
              </Button>
            )}

            {/* LAST STEP → OPEN PREVIEW */}
            {isLastStep && (
              <Button
                className="bg-blue-500 text-white"
                onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
              >
                 Preview Report
                <ChevronRight className="ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
