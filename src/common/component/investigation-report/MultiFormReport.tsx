"use client";

import { useState } from "react";
import { initialState, useForm } from "@/context/FormContext";
import { toast } from "react-toastify";

import Step1ReportDetails from "./steps/Step1ReportingDetails";
import Step2 from "./steps/Step2Particulars";
import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
import Step4IndividualDetails from "./steps/Step4IndividualDetails";
import Step5WitnessList from "./steps/Step5WitnessList";
import Step6Evidence from "./steps/Step6Evidence";
import Step7Documents from "./steps/Step7Document";
import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
import Step10Opinion from "./steps/Step10Opinion";
import Step11Remarks from "./steps/Step11Remarks";

import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";

import { useCreateMPReport, useUpdateMPReport } from "@/features/mpReports/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import React, { useEffect } from "react";

/* ================= EVIDENCE BUILDER ================= */
const buildEvidences = (ev: any) => {
  const evidences: any[] = [];
  if (!ev) return evidences;

  if (ev?.attachEvidence?.url) {
    evidences.push({
      type: "Evidence",
      url: ev.attachEvidence.url,
      description: ev.attachEvidence.description || "",
      customFields: {},
    });
  }

  if (ev?.eyeSketch?.url) {
    evidences.push({
      type: "Eye Sketch",
      url: ev.eyeSketch.url,
      description: ev.eyeSketch.description || "",
      customFields: {},
    });
  }

  ev?.photos?.forEach((p: any) => {
    if (p?.url)
      evidences.push({
        type: "Photo",
        url: p.url,
        description: p.description || "",
        customFields: {},
      });
  });

  ev?.videos?.forEach((v: any) => {
    if (v?.url)
      evidences.push({
        type: "Video",
        url: v.url,
        description: v.description || "",
        customFields: {},
      });
  });

  return evidences;
};

export default function MultiFormReport({
  onCancel,
  existingReport,
}: {
  onCancel: () => void;
  existingReport?: any;
}) {
  const { state, dispatch } = useForm();
  const [mode] = useState("mp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { mutateAsync: createReportAsync } = useCreateMPReport();
  const { mutateAsync: updateReportAsync } = useUpdateMPReport();
  const { mutateAsync: createOffenderMutate } = useCreateOffender();

  /* ================= FETCH REPORT NO ================= */
  const reportNo = state.formData.mpReport.reportDetails.reportNo || "PRO/21 CPU/00042/106/25";

  // Hydration Effect
  useEffect(() => {
    if (existingReport) {
      console.log("Hydrating MP Report Form:", existingReport);
      const er = existingReport;
      const mpNodes = { ...initialState.formData.mpReport };

      // Map existing report to form state
      mpNodes.reportDetails = {
        reportNo: er.reportDetails?.reportNumber || "",
        command: er.reportDetails?.command || "",
        firNo: er.reportDetails?.firNumber || "",
        firFile: er.reportDetails?.firFileUrl || "",
      };

      mpNodes.mpParticulars = {
        armyNo: er.investigationHead?.armyNumber || "",
        rank: er.investigationHead?.rank || "",
        name: er.investigationHead?.name || "",
        unit: er.investigationHead?.unit || "",
        fmn: er.investigationHead?.fmn || "",
        command: er.investigationHead?.command || "",
        address: er.investigationHead?.address || "",
        icard: er.investigationHead?.iCardNumber || "",
      };

      mpNodes.occurrenceDetails = {
        offenceType: er.occurrenceDetails?.offenceType || "",
        offenceTypes: er.occurrenceDetails?.offenceTypes || [],
        offenceTypeReference: er.occurrenceDetails?.offenceTypeReference || [],
        place: er.occurrenceDetails?.placeOfOccurrence || "",
        date: er.occurrenceDetails?.dateOfOccurrence ? new Date(er.occurrenceDetails.dateOfOccurrence).toISOString().split('T')[0] : "",
        time: er.occurrenceDetails?.timeOfOccurrence ? new Date(er.occurrenceDetails.timeOfOccurrence).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : "",
        description: er.occurrenceDetails?.description || "",
      };

      // Individuals
      if (Array.isArray(er.individuals)) {
        mpNodes.individualDetails = {
          vehicleInvolved: "",
          vehicleData: {},
          driverType: "",
          tempOffender: undefined,
          offenderList: er.individuals.map((ind: any) => ({
            details: {
              armyNumber: ind.armyNo,
              rank: ind.rank,
              name: ind.name,
              unit: ind.unit,
              fmn: ind.fmn,
              address: ind.address,
              iCardNumber: ind.iCardNumber,
              remark: ind.remark,
            },
            role: ind.role,
            offenderType: ind.role, // Mapping back
            vehicleInvolved: ind.isVehicleInvolved ? "yes" : "no",
          }))
        };
      }

      // Witnesses
      if (Array.isArray(er.witnesses)) {
        mpNodes.witnesses = er.witnesses.map((w: any) => ({
          details: {
            armyNumber: w.armyNo,
            rank: w.rank,
            name: w.name,
            unit: w.unit,
            fmn: w.fmn,
            address: w.address,
            iCardNumber: w.iCardNumber,
            remark: w.remark,
          }
        }));
      }

      // Documents
      if (Array.isArray(er.documents)) {
        mpNodes.documents = er.documents;
      }

      // Evidence & Detailed Report & Remarks
      // ... map strictly if needed, mainly strictly structure matching

      mpNodes.investigationPoints = er.pointsFindOutDuringInvestigation ? er.pointsFindOutDuringInvestigation.split('\n') : [];
      mpNodes.opinion = er.opinion || "";
      mpNodes.remarks = {
        analysis: er.remarks?.analysis || "",
        recommendation: er.remarks?.recommendation || ""
      };

      mpNodes.attachments = er.customFields?.attachments || []; // Hydrate attachments

      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          ...initialState.formData,
          mpReport: mpNodes
        }
      });
    }
  }, [existingReport, dispatch]);

  const handleReportNoChange = (newReportNo: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.reportDetails.reportNo",
      value: newReportNo,
    });
  };

  /* ✅ FIX 1 — STEPS ARRAY (REQUIRED FOR LeftStepper) */
  const steps = [
    { id: 1, label: "Report Details", icon: "1" },
    { id: 2, label: "MP Particulars", icon: "2" },
    { id: 3, label: "Occurrence Details", icon: "3" },
    { id: 4, label: "Details of Individual", icon: "4" },
    { id: 5, label: "Witness", icon: "5" },
    { id: 6, label: "Evidence", icon: "6" },
    { id: 7, label: "Documents", icon: "7" },
    { id: 8, label: "Detailed Occurrence Report", icon: "8" },
    { id: 9, label: "Points found during investigation", icon: "9" },
    { id: 10, label: "Opinion", icon: "10" },
    { id: 11, label: "Remarks", icon: "11" },
  ];

  const toISODateTime = (date?: string, time?: string) =>
    date && time ? new Date(`${date}T${time}`).toISOString() : undefined;

  const mapMpToReport = (mp: any) => {
    const offenderList = mp?.individualDetails?.offenderList || [];
    const witnessList = mp?.witnesses || [];

    /* ================= 4. OFFENDERS ================= */
    const people = offenderList.map((p: any, i: number) => {
      const src = p.details ?? p;
      const val = (v: any) => (v && v !== "Nil" && v !== "--" ? v : ""); // Helper inside map

      return {
        sno: i + 1,
        armyNo: val(src.armyNumber),
        rank: val(src.rank),
        name: val(src.name),
        identityCard: val(src.iCardNumber),
        unitName: val(src.unit),
        fmn: val(src.fmn),
        address: val(src.address),
        remark: val(src.remark),
        role:
          p.offenderType === "Victim"
            ? "Victim"
            : p.offenderType === "Offender"
              ? "Offender"
              : "Unknown",
        customFields: { ...src, ...(src.customFields || {}) },
      };
    });

    /* ================= 5. WITNESSES ================= */
    const witnesses = witnessList.map((w: any, i: number) => {
      const src = w.details ?? w;
      const val = (v: any) => (v && v !== "Nil" && v !== "--" ? v : "");

      return {
        sno: i + 1,
        armyNo: val(src.armyNumber || src.armyNo),
        rank: val(src.rank),
        name: val(src.name),
        identityCard: val(src.iCardNumber),
        unitName: val(src.unit),
        fmn: val(src.fmn),
        address: val(src.address),
        remark: val(src.remark),
        customFields: { ...src, ...(src.customFields || {}) },
      };
    });

    /* ================= 9. INVESTIGATION POINTS ================= */
    const investigationPoints = Array.isArray(mp?.investigationPoints)
      ? mp.investigationPoints
      : typeof mp?.investigationPoints === "string" &&
        mp.investigationPoints.trim()
        ? mp.investigationPoints.split("\n")
        : [];

    const val = (v: any) => (v && v !== "Nil" && v !== "NA" ? v : "");

    return {
      /* ================= HEADER ================= */
      reportNo: mp?.reportDetails?.reportNo || reportNo,
      command: val(mp?.reportDetails?.command),
      firNo: val(mp?.reportDetails?.firNo),

      /* ================= 1. MP DETAILS ================= */
      mpDetails: {
        armyNo: val(mp?.mpParticulars?.armyNo),
        rank: val(mp?.mpParticulars?.rank),
        name: val(mp?.mpParticulars?.name),
        unit: val(mp?.mpParticulars?.unit),
        fmn: val(mp?.mpParticulars?.fmn),
        command: val(mp?.mpParticulars?.command),
      },

      /* ================= 2–3. OCCURRENCE DETAILS ================= */
      occurrence: {
        types: mp?.occurrenceDetails?.offenceTypes && mp.occurrenceDetails.offenceTypes.length > 0
          ? mp.occurrenceDetails.offenceTypes
          : (mp?.occurrenceDetails?.offenceType ? [mp.occurrenceDetails.offenceType] : []),
        refs: mp?.occurrenceDetails?.offenceTypeReference || [],
        place: val(mp?.occurrenceDetails?.place),
        date: val(mp?.occurrenceDetails?.date),
        time: val(mp?.occurrenceDetails?.time),
      },

      /* ================= 4. OFFENDERS ================= */
      people,

      /* ================= 5. WITNESSES ================= */
      witnesses,

      /* ================= 6. EVIDENCE ================= */
      evidence: {
        eyeSketch: mp?.evidence?.eyeSketch?.url ? "Available" : "", // Changed from "Nil" to ""
        photos:
          mp?.evidence?.photos?.length > 0
            ? `${mp.evidence.photos.length} Photos`
            : "",
        videos:
          mp?.evidence?.videos?.length > 0
            ? `${mp.evidence.videos.length} Videos`
            : "",
      },

      /* ================= 7. DOCUMENTS ================= */
      documents: (mp?.documents || []).map((d: any) => val(d?.statement)),

      /* ================= 8–10. DETAILED REPORT ================= */
      detailedReport: {
        statement: val(
          mp?.detailedOccurrenceReport?.statement ||
          mp?.detailedOccurrenceReport
        ),

        findings: Array.isArray(mp?.investigationPoints)
          ? mp.investigationPoints
          : typeof mp?.investigationPoints === "string" &&
            mp.investigationPoints.trim()
            ? mp.investigationPoints.split("\n")
            : [],

        opinion: val(mp?.opinion?.statement || mp?.opinion),
      },

      /* ================= 11. REMARKS ================= */
      remarks: {
        analysis: val(mp?.remarks?.analysis),
        recommendation: val(mp?.remarks?.recommendation),
      },

      /* ================= FOOTER ================= */
      station: val(mp?.station),
      reportDate: mp?.reportDate || new Date().toLocaleDateString("en-GB"),
    };
  };

  const mapOffenderType = (raw?: string) => {
    switch (raw) {
      case "Military":
      case "Military Person":
        return "Military Person";

      case "Employee":
        return "Employee";

      case "Servant":
      case "Maid":
      case "Servant/Maid":
        return "Servant/Maid";

      case "ShopKeeper":
      case "Shop Keeper":
        return "Shop Keeper";

      case "Temporary":
      case "Temporary Worker":
      case "Temporary Hired Worker":
        return "Temporary Hired Worker";

      default:
        return "Civilian"; // ✅ safest default
    }
  };

  /* ================= SUBMIT HANDLER ================= */
  const onSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const mp = state.formData.mpReport;

      /* ================= MAP INDIVIDUALS (EMBEDDED) ================= */
      const individualsPayload = (mp.individualDetails?.offenderList || []).map(
        (o: any) => {
          const d = o.details || {};
          const sanitize = (v: any) => (v && v !== "Nil" && v !== "" ? v : undefined);
          return {
            armyNo: sanitize(d.armyNumber) || sanitize(d.armyNo),
            rank: sanitize(d.rank),
            name: sanitize(d.name),
            unit: sanitize(d.unit),
            fmn: sanitize(d.fmn),
            address: sanitize(d.address),
            iCardNumber: sanitize(d.iCardNumber) || sanitize(d.icard) || sanitize(d.passNo),
            remark: sanitize(d.remark) || "--",
            role: o.role || o.offenderType || "Offender",
            isVehicleInvolved: Boolean(o.vehicleInvolved === "yes" || d.vehicleInvolved === "yes" || o.isVehicleInvolved),
            customFields: d,
          };
        }
      );

      /* ================= MAP WITNESSES (EMBEDDED) ================= */
      const witnessesPayload = (mp.witnesses || []).map((w: any) => {
        const d = w.details || w;
        const sanitize = (v: any) => (v && v !== "Nil" && v !== "" ? v : undefined);
        return {
          armyNo: sanitize(d.armyNumber) || sanitize(d.armyNo),
          rank: sanitize(d.rank),
          name: sanitize(d.name),
          unit: sanitize(d.unit),
          fmn: sanitize(d.fmn),
          address: sanitize(d.address),
          iCardNumber: sanitize(d.iCardNumber),
          remark: sanitize(d.remark) || "--",
          customFields: d,
        };
      });

      /* ================= MP REPORT PAYLOAD ================= */
      const payload = {
        reportDetails: {
          reportNumber: mp.reportDetails.reportNo || "NA",
          command: mp.reportDetails.command || "NA",
          firNumber: mp.reportDetails.firNo || "NA",
          firFileUrl: mp.reportDetails.firFile || "",
          customFields: {},
        },

        investigationHead: {
          armyNumber: mp.mpParticulars.armyNo || "NA",
          rank: mp.mpParticulars.rank || "NA",
          name: mp.mpParticulars.name || "NA",
          unit: mp.mpParticulars.unit || "NA",
          fmn: mp.mpParticulars.fmn || "NA",
          command: mp.mpParticulars.command || "NA",
          address: mp.mpParticulars.address || "NA",
          iCardNumber: mp.mpParticulars.icard || "NA",
          customFields: {},
        },

        occurrenceDetails: {
          offenceType: mp.occurrenceDetails.offenceType || "NA",
          offenceTypes: mp.occurrenceDetails?.offenceTypes ?? [],
          offenceTypeReference: mp.occurrenceDetails?.offenceTypeReference ?? [],
          placeOfOccurrence: mp.occurrenceDetails.place || "NA",
          dateOfOccurrence: toISODateTime(mp.occurrenceDetails.date, "00:00") || "",
          timeOfOccurrence: toISODateTime(
            mp.occurrenceDetails.date,
            mp.occurrenceDetails.time
          ) || "",
          description: mp.occurrenceDetails.description || "Nil",
          customFields: {},
        },

        // ✅ POPULATE EMBEDDED ARRAYS
        individuals: individualsPayload,
        witnesses: witnessesPayload,

        documents: (mp.documents || []).map((d: any) => ({
          statement: d.statement || "Nil",
          url: d.url || "NA",
          fileName: d.fileName || "",
          type: d.type || "Document", // Pass Type
        })),

        evidences: buildEvidences(mp.evidence),

        detailedOccurrenceReport: mp.detailedReport || "Nil",

        pointsFindOutDuringInvestigation: Array.isArray(mp.investigationPoints)
          ? mp.investigationPoints.join("\n")
          : mp.investigationPoints || "Nil",

        opinion: mp.opinion || "Nil",

        remarks: {
          analysis: mp.remarks.analysis || "Nil",
          recommendation: mp.remarks.recommendation || "Nil",
          customFields: {},
        },

        customFields: {
          attachments: mp.attachments || [] // Also capture any loose attachments from stepper
        },
      };

      console.log("🚀 MP REPORT PAYLOAD ===>", payload);

      /* ================= CREATE / UPDATE MP REPORT ================= */
      let reportRes;
      if (existingReport && existingReport._id) {
        console.log("📝 UPDATING MP Report:", existingReport._id);
        reportRes = await updateReportAsync({
          id: existingReport._id,
          data: payload
        });
        toast.success("MP Report Updated Successfully");
      } else {
        console.log("🆕 CREATING MP Report");
        reportRes = await createReportAsync(payload);
        toast.success("MP Investigation Report Created 🎉");
      }

      console.log("✅ MP REPORT RESPONSE ===>", reportRes);

      const offenceId = reportRes?._id;
      if (!offenceId) {
        toast.error("Offence ID missing");
        return;
      }

      /* ================= CREATE ALL OFFENDERS & WITNESSES (GLOBAL SEARCH) ================= */
      // We still create these for the global search / centralized offender DB if needed.
      // If the user only cares about the report document, this part is less critical but good to keep.
      const offendersToCreate: any[] = [];

      /* 1️⃣ MAIN INDIVIDUAL OFFENDERS */
      for (const o of mp?.individualDetails?.offenderList || []) {
        const d = o.details ?? o;

        const hasData = Object.values(d || {}).some(
          (v) => v !== "" && v !== null && v !== undefined
        );
        if (!hasData) continue;

        offendersToCreate.push({
          offenceId,
          offenderType: mapOffenderType(o.offenderType),
          offenderDetails: {
            type: o.role || "Offender",
            category: "individual",
            ...d,
          },
        });
      }

      /* 2️⃣ ADDITIONAL INDIVIDUAL */
      const add = mp?.additionalIndividual?.tempOffender;
      if (add?.details) {
        const d = add.details;
        const hasData = Object.values(d).some(
          (v) => v !== "" && v !== null && v !== undefined
        );

        if (hasData) {
          offendersToCreate.push({
            offenceId,
            offenderType: mapOffenderType(add.offenderType),
            offenderDetails: {
              type: "Additional Individual",
              category: "individual",
              ...d,
            },
          });
        }
      }

      /* 3️⃣ WITNESSES (USING SAME OFFENDER API) */
      for (const w of mp.witnesses || []) {
        const d = (w as any).details ?? w;
        const hasData = Object.values(d || {}).some(
          (v) => v !== "" && v !== null && v !== undefined
        );
        if (!hasData) continue;

        offendersToCreate.push({
          offenceId,
          offenderType: "Civilian",
          offenderDetails: {
            type: "Witness",
            category: "witness",
            ...d,
          },
        });
      }

      /* ================= ONE BY ONE API CALL ================= */
      for (const offenderPayload of offendersToCreate) {
        console.log("🚨 OFFENDER API PAYLOAD ===>", offenderPayload);
        await createOffenderMutate(offenderPayload);
      }

      console.log("🎯 ALL OFFENDERS + WITNESSES CREATED");
      toast.success("MP Investigation Report Created 🎉");

      /* ================= RESET FORM ================= */
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
      if (onCancel) onCancel(); // Return to dashboard
    } catch (err: any) {
      console.error("❌ FINAL SUBMIT ERROR ===>", err);

      if (
        err?.response?.data?.message?.includes("E11000 duplicate key error") &&
        err?.response?.data?.message?.includes("reportDetails.reportNumber")
      ) {
        setFormErrors({ reportNo: "Report Number already exists" });
        dispatch({ type: "SET_STEP", payload: 1 });
        toast.error("Duplicate Report Number");
      } else {
        toast.error("Failed to create report");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // ================= RIGHT PANEL STEP CONFIG =================
  const stepsConfig = {
    1: {
      title: "1. REPORT DETAILS",
      component: <Step1ReportDetails errors={formErrors} />,
    },
    2: {
      title: "2. MP PARTICULARS",
      component: <Step2 />,
    },
    3: {
      title: "3. OCCURRENCE DETAILS:",
      component: <Step3OccurrenceDetails />,
    },
    4: {
      title: "4. DETAILS OF INDIVIDUAL:",
      component: <Step4IndividualDetails />,
    },
    5: {
      title: "5. WITNESS",
      component: <Step5WitnessList />,
    },
    6: {
      title: "6. EVIDENCE",
      component: <Step6Evidence />,
    },
    7: {
      title: "7. DOCUMENTS",
      component: <Step7Documents />,
    },
    8: {
      title: "8. DETAILED OCCURRENCE REPORT",
      component: <Step8DetailedOccurrence />,
    },
    9: {
      title: "9. INVESTIGATION POINTS",
      component: <Step9InvestigationPoints />,
    },
    10: {
      title: "10. OPINION",
      component: <Step10Opinion />,
    },
    11: {
      title: "11. REMARKS",
      component: <Step11Remarks />,
    },
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          {/* LEFT SIDE STEPPER */}
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New MP Occurrence & Investigation Report"
            reportNo={reportNo}
            onCancel={onCancel}
            onCreate={onSubmitFinal}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            isSubmitting={isSubmitting} // Passed prop
            onReportNoChange={handleReportNoChange} // Wired up
            onAttach={(items) => {
              const current = state.formData.mpReport.attachments || [];
              dispatch({
                type: "SET_PATH",
                path: "formData.mpReport.attachments",
                value: [...current, ...items],
              });
            }}
          />

          {/* RIGHT SIDE DYNAMIC CONTENT */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => {
              if (state.currentStep === Object.keys(stepsConfig).length) {
                dispatch({ type: "SET_PREVIEW", payload: true });
              } else {
                dispatch({ type: "NEXT_STEP" });
              }
            }}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={stepsConfig}
            mode="mp"
            mapReport={mapMpToReport}
          />
        </div>
      </div>
    </div>
  );
}
