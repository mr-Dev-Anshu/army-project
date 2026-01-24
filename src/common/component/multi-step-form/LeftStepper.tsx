"use client";
import { Check, Edit2, Save, Paperclip } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";
import { Button } from "@/components/ui/button";
import { useForm } from "@/context/FormContext";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AttachCertificateModal } from "./AttachCertificateModal";

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

  // ⭐ ADD THIS
  onCreate?: () => void;
  onCancel?: () => void;
  onReportNoChange?: (val: string) => void;
  hideReportNo?: boolean;
  isSubmitting?: boolean;
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
}: LeftStepperProps) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (id < currentStep) return "completed";
    return "pending";
  };

  const { state, dispatch } = useForm();

  const [editing, setEditing] = useState(false);
  const [reportValue, setReportValue] = useState(reportNo || "");

  useEffect(() => {
    if (!editing) {
      setReportValue(reportNo || "");
    }
  }, [reportNo, editing]);

  const saveReportNo = () => {
    setEditing(false);
    console.log("Saved Report No:", reportValue);
    // Already synced via onChange
  };

  /* ================= CERTIFICATE UPLOAD ================= */
  const [uploadingCert, setUploadingCert] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);

  const handleSaveCertificate = async (file: File, type: "certificate" | "letter") => {
    setUploadingCert(true);
    try {
      const res = await uploadFile(file);

      // Add to certificates list in global state
      const currentCerts = state.formData.mpReport?.certificates || [];
      const newCert = {
        statement: file.name,
        type: type,
        url: res.url,
        fileName: file.name,
      };

      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.certificates",
        value: [...currentCerts, newCert],
      });

      toast.success(`${type === 'certificate' ? 'Certificate' : 'Letter'} Attached Successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setUploadingCert(false);
    }
  };

  return (
    <div className="w-full lg:w-[380px] h-full bg-[#171717] text-white rounded-xl flex flex-col p-3 sm:p-4 md:p-6">
      {/* HEADER */}
      <div>
        <h2 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
          {title || "Create New General & Traffic Offence Record"}
        </h2>

        {/* Editable Report No */}
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
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex flex-col gap-2">
        {/* ATTACH OPTION */}
        {/* ATTACH OPTION */}
        {/* ATTACH OPTION - Only Step 4 */}
        {currentStep === 4 && (
          <>
            <AttachCertificateModal
              open={attachModalOpen}
              onOpenChange={setAttachModalOpen}
              onSave={handleSaveCertificate}
            />

            <Button
              className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 text-sm sm:text-base mb-2"
              onClick={() => setAttachModalOpen(true)}
              disabled={uploadingCert}
            >
              <Paperclip className="w-4 h-4" />
              {uploadingCert ? "Uploading..." : "Attach Certificates/Form/Letters"}
            </Button>

            {/* LIST ATTACHMENTS */}
            {state.formData.mpReport?.certificates?.length > 0 && (
              <div className="flex flex-col gap-2 mt-2 mb-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                {state.formData.mpReport.certificates.map((cert: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-[#262626] p-2 rounded-md border border-gray-700">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${cert.type === 'letter' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                      }`}>
                      {cert.type === 'letter' ? 'L' : 'C'}
                    </span>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 truncate hover:text-blue-400 underline decoration-dotted underline-offset-2"
                      title={cert.fileName}
                    >
                      {cert.fileName || "File"}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
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
      </div>
    </div>
  );
};
