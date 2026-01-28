"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye } from "lucide-react";
import { CiEraser } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import { initialState, useForm } from "@/context/FormContext";
import { IoMdClose } from "react-icons/io";

import StaticSpeedReport from "@/components/reports/StaticSpeedReport";
import MpOccurrenceReport from "@/components/reports/MpOccurrenceReport";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { TrafficFormState, StaticSpeedFormState, MpReportState } from "@/common/types/form.types";
import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";

/* ================= TYPES ================= */
interface RightPanelProps {
  step: number;
  formData: any;
  onNext: () => void;
  onPrev: () => void;
  stepsConfig: Record<string, any>;
  mode: "traffic" | "static" | "mp";

  mapReport?: (data: any) => any;
  extraButtons?: React.ReactNode;
}

export const RightPanel = ({
  step,
  formData,
  onNext,
  onPrev,
  stepsConfig,
  mode,
  mapReport,
  extraButtons,
}: RightPanelProps) => {
  const { state, dispatch } = useForm();

  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const safeStep = Number(step);
  const current = stepsConfig?.[safeStep];

  const totalSteps = Object.keys(stepsConfig || {}).length;
  const isLastStep = step === totalSteps;



  const isNextDisabled = () => {
    /* ===== STATIC ===== */
    if (mode === "static" && step === 1) {
      const v = formData.staticSpeed?.vehicleInvolved;

      // 🚗 vehicle involved → vehicle details required
      if (v === "yes") {
        return !(
          formData.staticSpeed?.vehicleDetails?.vehicleType &&
          formData.staticSpeed?.vehicleDetails?.category
        );
      }

      // 🚶 no vehicle → at least one offender required
      if (v === "no") {
        return !(
          Array.isArray(formData.staticSpeed?.offenderPeople) &&
          formData.staticSpeed.offenderPeople.length > 0
        );
      }

      // nothing selected yet
      return true;
    }

    /* ===== TRAFFIC ===== */
    if (mode === "traffic" && step === 1)
      return !formData.traffic?.vehicleInvolved;

    return false;
  };


  // /* ================= NEXT DISABLE ================= */
  // const isNextDisabled = () => {
  //   if (mode === "static" && step === 1)
  //     return !(
  //       formData.staticSpeed?.vehicleDetails?.vehicleType &&
  //       formData.staticSpeed?.vehicleDetails?.category
  //     );

  //   if (mode === "traffic" && step === 1)
  //     return !formData.traffic?.vehicleInvolved;

  //   return false;
  // };

  const renderPreviewReport = () => {
    if (!mapReport) {
      console.error("❌ mapReport missing");
      return <p className="text-red-500">Preview not available</p>;
    }

    if (mode === "traffic") {
      return (
        <MilitaryPoliceReport
          {...mapReport(state.formData.traffic)}
        />
      );
    }

    if (mode === "static") {
      return (
        <StaticSpeedReport
          {...mapReport(state.formData.staticSpeed)}
        />
      );
    }

    if (mode === "mp") {
      return (
        <MpOccurrenceReport
          {...mapReport(state.formData.mpReport)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div className="flex-1 h-full px-4 flex flex-col w-full overflow-hidden">
        <div className="border rounded-lg w-full flex flex-col flex-1 min-h-0">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between px-4 py-3 border-b bg-white">
            <h3 className="font-bold text-lg">
              {current?.title || "Step"}
            </h3>

            {!state.preview && (
              <div className="flex gap-2 ">
                <Button
                  size="sm"
                  className="text-xs bg-gray-100 cursor-pointer text-black"
                  onClick={() => setShowClearModal(true)}
                >
                  <CiEraser size={16} /> Clear Form
                </Button>

                <Button
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "SET_PREVIEW", payload: true })
                  }
                  className="bg-black text-white"
                >
                  <Eye />
                </Button>
              </div>
            )}
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {!state.preview && (
              <div className="h-full overflow-y-auto px-4 py-4">
                {current?.component || <p>Step Coming…</p>}
              </div>
            )}

            {state.preview && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
                  <h2 className="font-semibold text-sm">
                    REPORT PREVIEW
                  </h2>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-black text-white text-xl"
                      onClick={window.print}
                    >
                      🖨
                    </Button>

                    <Button
                      className="bg-black text-xl text-white"
                      onClick={() => {
                        dispatch({ type: "SET_PREVIEW", payload: false });
                        dispatch({
                          type: "SET_STEP",
                          payload:
                            state.completedSteps.at(-1) ?? step,
                        });
                      }}
                    >
                      <IoMdClose />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto flex justify-center py-6">
                  <div className="w-full max-w-[900px]">
                    {renderPreviewReport()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= FOOTER ================= */}
          {!state.preview && (
            <div className="border-t px-4 py-3 bg-white flex justify-between gap-2 items-center">
              <div className="flex gap-2">
                <Button
                  className="py-6 px-14 text-white"
                  disabled={step === 1}
                  onClick={onPrev}
                >
                  <FaArrowLeftLong className="mr-2 " /> Back
                </Button>
                {extraButtons}
              </div>

              {!isLastStep ? (
                <Button className="bg-[#0088FF] p-6 px-10" onClick={onNext} disabled={isNextDisabled()}>
                  Next <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-[#34C759] text-white py-6 px-14 rounded-md"
                  onClick={() => {
                    dispatch({
                      type: "SET_PATH",
                      path: "completedSteps",
                      value: Array.from(
                        new Set([...state.completedSteps, step])
                      ),
                    });
                    dispatch({ type: "SET_PREVIEW", payload: true });
                  }}
                >
                  Preview Report
                  <Eye />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= CLEAR MODAL ================= */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          setIsClearing(true);

          setTimeout(() => {
            // 🔥 PURE FORM RESET
            dispatch({
              type: "SET_FORM_DATA",
              payload: initialState.formData,
            });

            // 🔥 STEP RESET
            dispatch({ type: "SET_STEP", payload: 1 });

            // 🔥 PREVIEW OFF
            dispatch({ type: "SET_PREVIEW", payload: false });

            setIsClearing(false);
            setShowClearModal(false);
          }, 300);
        }}

        title="Clear Form?"
        message="Are you sure you want to clear the entire form?"
        confirmLabel="Yes, Clear"
        cancelLabel="Cancel"
        isProcessing={isClearing}
      />
    </>
  );
};
