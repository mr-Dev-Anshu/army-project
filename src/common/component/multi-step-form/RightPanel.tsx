"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye } from "lucide-react";
import { CiEraser } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from "@/context/FormContext";

import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";
import StaticSpeedReport from "@/components/reports/StaticSpeedReport";
import MpOccurrenceReport from "@/components/reports/MpOccurrenceReport";

import ConfirmationModal from "@/components/common/ConfirmationModal";

export const RightPanel = ({
  step,
  formData,
  onNext,
  onPrev,
  stepsConfig,
  mode,
  mapTrafficToReport,
  mapMpToReport,
}: any) => {
  const { state, dispatch } = useForm();

  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

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

  const renderPreviewReport = () => {
    if (mode === "traffic")
      return (
        <MilitaryPoliceReport {...mapTrafficToReport(state.formData.traffic)} />
      );

    if (mode === "static")
      return (
        <StaticSpeedReport
          {...mapTrafficToReport(state.formData.staticSpeed)}
        />
      );

    if (mode === "mp")
      return <MpOccurrenceReport {...mapMpToReport(state.formData.mpReport)} />;

    return null;
  };

  return (
    <>
      <div className="flex-1 h-full px-4 flex flex-col w-full overflow-hidden">
        <div className="border rounded-lg w-full flex flex-col flex-1 min-h-0">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between px-4 py-3 border-b bg-white">
            <h3 className="font-bold text-lg">{current?.title || "Step"}</h3>

            {!state.preview && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs bg-gray-100 text-black"
                  onClick={() => setShowClearModal(true)}
                >
                  <CiEraser size={16} /> Clear Form
                </Button>

                <Button
                  variant="outline"
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
            {/* ===== FORM MODE ===== */}
            {!state.preview && (
              <div className="h-full overflow-y-auto px-4 py-4">
                {current?.component || <p>Step Coming…</p>}
              </div>
            )}

            {/* ===== PREVIEW MODE ===== */}
            {state.preview && (
              <div className="h-full flex flex-col ">
                {/* PREVIEW TOP BAR */}
                <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b">
                  <h2 className="font-semibold text-sm tracking-wide">
                    REPORT PREVIEW
                  </h2>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={window.print}>
                      🖨 Print
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dispatch({ type: "SET_PREVIEW", payload: false });

                        // 👇 wapas last real step pe le jao
                        dispatch({
                          type: "SET_STEP",
                          payload: state.completedSteps.at(-1) ?? step,
                        });
                      }}
                    >
                      ❌
                    </Button>
                  </div>
                </div>

                {/* PREVIEW CONTENT */}
                <div className="flex-1 overflow-y-auto flex justify-center  py-6">
                  <div className="w-full max-w-[900px]">
                    {renderPreviewReport()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= FOOTER (ONLY FORM MODE) ================= */}
          {!state.preview && (
            <div className="border-t px-4 py-3 bg-white flex justify-between gap-2">
              <Button disabled={step === 1} onClick={onPrev}>
                <FaArrowLeftLong className="mr-2" /> Back
              </Button>

              {!isLastStep ? (
                <Button onClick={onNext} disabled={isNextDisabled()}>
                  Next <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    dispatch({
                      type: "SET_PATH",
                      path: "completedSteps",
                      value: Array.from(
                        new Set([...state.completedSteps, step])
                      ),
                    });

                    // 👇 IMPORTANT LINE
                    dispatch({
                      type: "SET_STEP",
                      payload: step + 1,
                    });

                    dispatch({ type: "SET_PREVIEW", payload: true });
                  }}
                >
                  Preview Report
                  <ChevronRight className="ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          setIsClearing(true);
          setTimeout(() => {
            setIsClearing(false);
            setShowClearModal(false);
          }, 300);
        }}
        title="Clear Form?"
        message="Kya aap sure ho ki poora form clear karna chahte ho? Ye action undo nahi hoga."
        confirmLabel="Yes, Clear"
        cancelLabel="Cancel"
        isProcessing={isClearing}
      />
    </>
  );
};
