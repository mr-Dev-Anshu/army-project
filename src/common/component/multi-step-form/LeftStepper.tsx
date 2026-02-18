"use client";
import { Check, Edit2, Save, Upload, Paperclip, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, initialState } from "@/context/FormContext";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import FormAttachmentModal, { AttachedItem } from "@/components/ui/FormAttachmentModal";

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
  module?: "traffic" | "static";
  attachments?: AttachedItem[];
  onAttachmentsChange?: (attachments: AttachedItem[]) => void;
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
  module = "traffic",
  attachments = [],
  onAttachmentsChange,
}: LeftStepperProps) => {
  const getStatus = (id: number) => {
    if (id === currentStep) return "active";
    if (id < currentStep) return "completed";
    return "pending";
  };

  const { state, dispatch } = useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  /* ================= IMPORT HANDLER ================= */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        console.log(`📂 Imported JSON for [${module}]:`, json);

        // 1. Prepare Fresh State
        const newState = structuredClone(initialState);

        // 2. Select Target Form State
        let targetForm: any;
        if (module === "static") {
          targetForm = newState.formData.staticSpeed;
        } else {
          targetForm = newState.formData.traffic;
        }

        // 3. MAP BASIC INFO
        targetForm.reportNo = json.reportId || json.reportNo || reportValue;

        // 4. MAP VEHICLE DETAILS
        const isVehInvolved = json.isVehicleInvolved === true || json.vehicleInvolved === "yes" || module === "static";

        if (isVehInvolved) {
          targetForm.vehicleInvolved = "yes";

          // Map Category
          let cat = json.vehicleCategory || "";
          if (cat === "2-Wheeler") cat = "2w";
          else if (cat === "4-Wheeler") cat = "4w";

          // Map Type
          let type = json.vehicleType || "";
          if (type === "Civilian Vehicle") type = "civilian";
          else if (type === "DD Vehicle") type = "dd";

          targetForm.vehicleDetails = {
            category: cat,
            vehicleType: type,
            driverType: json.driverType || "Military Person",
            vehicleName: json.vehicleName || "",
            vehicleNumber: json.vehicleNumber || "",
          };
        } else {
          targetForm.vehicleInvolved = "no";
          if (json.offenderWithoutVehicle) {
            targetForm.offenderWithoutVehicle = json.offenderWithoutVehicle;
          }
        }

        // 5. MAP OFFENDERS (Driver/Co-Driver)
        if (Array.isArray(json.offenders)) {
          const mappedOffenders = json.offenders.map((o: any) => {
            const details = o.offenderDetails || {};

            // Determine role
            const role = details.type || (o.category === "Offender" ? "Driver" : "Offender");

            return {
              type: o.offenderType || "Civilian",
              whoIsIt: role,
              details: {
                ...details,
                // 🔥 CRITICAL FIX: Map ALL Verbose Keys to Standard Keys
                rank: details["Select Rank"] || details.rank || "",

                armyNumber: details.armyNumber || details["Army Rider / Driver Number"] || details.armyNo || "",

                iCardNumber: details.iCardNumber || details["ID Card Number"] || details["I Card Number"] || details.iCardNo || "",

                name: details.name || details["Full Name"] || "",

                unit: details.unit || details["Unit"] || "",
                fmn: details.fmn || details["FMN"] || "",
                command: details.command || details["Command"] || "",
                address: details.address || details["Address"] || "",

                so: details.so || details["Father's Name (Son of)"] || details["Father's / Husband's Name"] || "",

                passNo: details.passNo || details["Pass No."] || details["Maid/Servant Pass Number"] || "",

                passIssueDate: details.passIssueDate || details["Pass Issue Date"] || "",
                passExpireDate: details.passExpireDate || details["Pass Expire Date"] || "",

                armyOfficialName: details.armyOfficialName || details["Army Official Name"] || "",
              },
            };
          });

          // 🔥 FIX: Sort so "Driver" is ALWAYS at index 0 for the form
          mappedOffenders.sort((a: any, b: any) => {
            if (a.whoIsIt === "Driver") return -1;
            if (b.whoIsIt === "Driver") return 1;
            return 0;
          });

          targetForm.offenderPeople = mappedOffenders;
        }

        // 6. MAP OTHER SECTIONS
        if (module === "static") {
          if (json.onDutyDetails) {
            targetForm.dutyBlock = {
              ...json.onDutyDetails,
              dateOfDuty: json.onDutyDetails.dateOfDuty || "",
              startTime: json.onDutyDetails.startTime ? new Date(json.onDutyDetails.startTime).toTimeString().slice(0, 5) : "",
              endTime: json.onDutyDetails.endTime ? new Date(json.onDutyDetails.endTime).toTimeString().slice(0, 5) : "",
            };
          }
          if (json.onDutyDetailsMPReporting) targetForm.reportingBlock = json.onDutyDetailsMPReporting;
          if (json.offenceOccurenceDetails) {
            targetForm.offenceBlock = {
              ...json.offenceOccurenceDetails,
              actualSpeedNoted: json.offenceOccurenceDetails.actualSpeedNoted || "",
              authSpeed: json.offenceOccurenceDetails.authSpeed || "",
              overSpeedCalculated: json.offenceOccurenceDetails.overSpeedCalculated || "",
            };
          }
          targetForm.remarks = json.remark || json.remarks || "";

        } else {
          if (json.onDutyDetails) targetForm.onDutyDetails = json.onDutyDetails;
          if (json.onDutyDetailsMPReporting) targetForm.onDutyDetailsMPReporting = json.onDutyDetailsMPReporting;
          if (json.offenceOccurenceDetails) targetForm.offenceOccurenceDetails = json.offenceOccurenceDetails;
          if (json.offenceTypes) targetForm.offenceTypes = json.offenceTypes;
          if (json.offenceTypeReference) targetForm.offenceCode = json.offenceTypeReference;
          if (json.remarks) targetForm.remarks = json.remarks;
        }

        dispatch({ type: "SET_FORM_DATA", payload: newState.formData });

        if (targetForm.reportNo) {
          setReportValue(targetForm.reportNo);
          if (onReportNoChange) onReportNoChange(targetForm.reportNo);
        }

        toast.success(`Imported to ${module}!`);

      } catch (err) {
        console.error("Import Error:", err);
        toast.error("Failed to parse JSON file.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full lg:w-[380px] h-full bg-[#171717] text-white rounded-xl flex flex-col p-3 sm:p-4 md:p-6">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
            {title || "Create New Record"}
          </h2>
          <div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {/* <button
              onClick={handleImportClick}
              className="text-gray-400 hover:text-white transition p-1"
              title="Import JSON"
            >
              <Upload className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {!hideReportNo && (
          <div className="flex items-center gap-10 text-gray-300">
            {!editing ? (
              <>
                <p className="text-[10px] sm:text-xs">
                  REPORT NO. {reportValue || "—"}
                </p>
                <button onClick={() => setEditing(true)} className="hover:text-white transition">
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
                <button onClick={saveReportNo} className="hover:text-white transition text-green-400 ml-2">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6  flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
        {steps.map((step, index) => {
          const status = getStatus(step.id);
          return (
            <div key={step.id} className="relative">
              <button
                onClick={() => {
                  if (state.preview) dispatch({ type: "SET_PREVIEW", payload: false });
                  onStepClick(step.id);
                }}
                className="w-full flex items-center gap-10 sm:gap-4 py-4 rounded-lg text-left transition relative z-10"
              >
                <div className={`flex items-center justify-center rounded-full font-semibold flex-shrink-0 w-10 h-10 border-2 ${status === "completed" ? "bg-green-500 border-green-500" : status === "active" ? "bg-blue-500 border-blue-500 text-white" : "border-gray-500 bg-[#171717] text-gray-400"}`}>
                  {status === "completed" ? <Check className="w-5 h-5" /> : <span className="text-base">{step.id}</span>}
                </div>
                <span className={`text-sm sm:text-base md:text-lg font-medium ${status === "completed" ? "text-green-400" : status === "active" ? "text-blue-400" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`absolute left-[20px] top-[66px] w-[2px] border-l-2 border-dashed ${status === "completed" ? "border-green-500" : status === "active" ? "border-blue-500" : "border-gray-600"}`} style={{ height: "60px" }} />
              )}
            </div>
          );
        })}

        {/* UPLOAD DOCUMENTS SECTION */}
        {onAttachmentsChange && currentStep === steps.length && (
          <div className="border-t border-gray-700 pt-6 space-y-4">


            <Button
              onClick={() => {
                console.log('Attach button clicked, opening modal...');
                setIsAttachOpen(true);
              }}
              className="w-full bg-white text-black hover:bg-gray-200 h-10 text-[13px] font-medium rounded-md shadow-none flex items-center justify-center gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach Signed Certificates/Form/Letters
            </Button>

            {/* Display uploaded attachments */}
            {attachments && attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((att: AttachedItem, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-gray-600 rounded-lg px-3 py-2 bg-[#1f1f1f]"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-200 truncate">{att.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {att.type?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newAttachments = [...attachments];
                        newAttachments.splice(idx, 1);
                        onAttachmentsChange?.(newAttachments);
                      }}
                      className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attachment Modal */}
      <FormAttachmentModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        onSave={(newAttachments) => {
          if (onAttachmentsChange) {
            onAttachmentsChange([...(attachments || []), ...newAttachments]);
          }
        }}
      />

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button className="w-full sm:w-fit border border-gray-50 bg-transparent text-sm sm:text-base" onClick={() => onCancel && onCancel()}>Cancel</Button>
        <Button className={`w-full sm:flex-1 text-sm sm:text-base ${state.preview ? "bg-blue-600" : "bg-gray-600 cursor-not-allowed"}`} disabled={!state.preview || isSubmitting} onClick={() => onCreate && onCreate()}>
          {isSubmitting ? "Saving..." : "Save Report"}
        </Button>
      </div>
    </div>
  );
};