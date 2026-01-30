"use client";
import { Check, Edit2, Save, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";
import React, { useState, useEffect } from "react";
import FormAttachmentModal, { AttachedItem, AttachmentType } from "@/components/ui/FormAttachmentModal";
import { AttachmentItem as LegacyAttachmentItem } from "@/common/types/form.types";

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
  onCreate?: () => void;
  onCancel?: () => void;
  onReportNoChange?: (val: string) => void;
  hideReportNo?: boolean;
  isSubmitting?: boolean;
  onAttach?: (items: LegacyAttachmentItem[]) => void;
}

export const LeftStepper = ({
  steps,
  currentStep,
  completedSteps,
  title,
  reportNo,
  onStepClick,
  onCreate,
  onCancel,
  onReportNoChange,
  hideReportNo = false,
  isSubmitting = false,
  onAttach,
}: LeftStepperProps) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (id < currentStep) return "completed";
    return "pending";
  };

  const { state, dispatch } = useForm();

  const [editing, setEditing] = useState(false);
  const [reportValue, setReportValue] = useState(reportNo || "");
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  useEffect(() => {
    if (!editing) {
      setReportValue(reportNo || "");
    }
  }, [reportNo, editing]);

  const saveReportNo = () => {
    setEditing(false);
  };

  return (
    <div className="w-full lg:w-[380px] h-full bg-[#171717] text-white rounded-xl flex flex-col p-3 sm:p-4 md:p-6">
      {/* HEADER */}
      <div>
        <h2 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
          {title || "Create New General & Traffic Offence Record"}
        </h2>

        {!hideReportNo && (
          <div className="flex items-center gap-10 text-gray-300">
            {!editing ? (
              <>
                <p className="text-[10px] sm:text-xs">
                  REPORT NO. {reportValue || "—"}
                </p>

                <button
                  onClick={() => setEditing(true)}
                  className="hover:text-white transition"
                >
                  <Edit2 className="w-4 h-4 text-blue-500" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-300 text-[10px] sm:text-xs">
                <span>REPORT NO.</span>

                <input
                  autoFocus
                  value={reportValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setReportValue(v);
                    if (onReportNoChange) onReportNoChange(v);
                  }}
                  onBlur={saveReportNo}
                  className="bg-transparent border-b border-gray-400 outline-none px-1 w-[160px]"
                />

                <button
                  onClick={saveReportNo}
                  className="hover:text-white transition text-green-400 ml-2"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEPS */}
      <div className="mt-4 sm:mt-6  flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
        {steps.map((step, index) => {
          const status = getStatus(step.id);

          return (
            <div key={step.id} className="relative">
              <button
                onClick={() => {
                  if (state.preview) {
                    dispatch({ type: "SET_PREVIEW", payload: false });
                  }
                  onStepClick(step.id);
                }}
                className="w-full flex items-center gap-10 sm:gap-4 py-4 rounded-lg text-left transition relative z-10"
              >
                <div
                  className={`
                    flex items-center justify-center
                    rounded-full font-semibold
                    flex-shrink-0
                    w-10 h-10
                    border-2
                    ${status === "completed"
                      ? "bg-green-500 border-green-500"
                      : status === "active"
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-500 bg-[#171717] text-gray-400"
                    }
                  `}
                >
                  {status === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-base">{step.id}</span>
                  )}
                </div>

                <span
                  className={`
                    text-sm sm:text-base md:text-lg font-medium
                    ${status === "completed"
                      ? "text-green-400"
                      : status === "active"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute left-[20px] top-[66px] w-[2px]
                    border-l-2 border-dashed
                    ${status === "completed"
                      ? "border-green-500"
                      : status === "active"
                        ? "border-blue-500"
                        : "border-gray-600"
                    }
                  `}
                  style={{ height: "60px" }}
                />
              )}
            </div>
          );
        })}

        {/* ATTACH BUTTON - INLINE */}
        {onAttach && currentStep === steps.length && (
          <div className="mt-8 mb-6 px-1">
            <Button
              onClick={() => setIsAttachOpen(true)}
              className="w-full bg-white text-black hover:bg-gray-200 h-10 text-[13px] font-medium rounded-md shadow-none flex items-center justify-center gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach Signed Certificates/Form/Letters
            </Button>
          </div>
        )}
      </div>

      <FormAttachmentModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        onSave={(items) => {
          if (onAttach) {
            const legacyItems: LegacyAttachmentItem[] = items.map(i => ({
              ...i,
              type: i.type as any
            }));
            onAttach(legacyItems);
          }
        }}
      />

      {/* FOOTER */}
      <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-gray-700">
        <Button
          className="w-full sm:w-fit border border-gray-50 bg-transparent text-sm sm:text-base"
          onClick={() => onCancel && onCancel()}
        >
          Cancel
        </Button>

        <Button
          className={`w-full sm:flex-1 text-sm sm:text-base ${state.preview ? "bg-blue-600" : "bg-gray-600 cursor-not-allowed"
            }`}
          disabled={!state.preview || isSubmitting}
          onClick={() => onCreate && onCreate()}
        >
          {isSubmitting ? "Saving..." : "Save Report"}
        </Button>
      </div>
    </div >
  );
};