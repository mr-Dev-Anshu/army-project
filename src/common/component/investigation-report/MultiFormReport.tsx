"use client";

import { initialState, useForm } from "@/context/FormContext";
import { toast } from "react-toastify";
import Step1ReportDetails from "./steps/Step1ReportingDetails";
import Step2 from "./steps/Step2Particulars";
import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4IndividualDetails from "./steps/Step4IndividualDetails";
import Step5WitnessList from "./steps/Step5WitnessList";
import { title } from "process";
import Step6Evidence from "./steps/Step6Evidence";
import Step7Documents from "./steps/Step7Document";
import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
import Step10Opinion from "./steps/Step10Opinion";
import Step11Remarks from "./steps/Step11Remarks";

import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";

import { useCreateMPReport } from "@/features/mpReports/hooks";

/* ================= EVIDENCE BUILDER ================= */
const buildEvidences = (ev: any) => {
  const evidences: any[] = [];
  if (!ev) return evidences;

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
}: {
  onCancel: () => void;
}) {
  const { state, dispatch } = useForm();
  const [mode] = useState("mp");
  const { mutateAsync: createReportAsync } = useCreateMPReport();

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
    date && time ? new Date(`${date}T${time}`).toISOString() : null;

  const mapMpToReport = (mp: any) => {
    const individuals = mp?.individualDetails?.offenderList || [];
    const rawWitnesses = mp?.witnesses || [];
    const ev = mp?.evidence || {};

    return {
      /* ✅ ADD THIS (THIS IS THE FIX) */
      mpDetails: {
        armyNo: mp?.mpParticulars?.armyNo || "",
        rank: mp?.mpParticulars?.rank || "",
        name: mp?.mpParticulars?.name || "",
        unit: mp?.mpParticulars?.unit || "",
        fmn: mp?.mpParticulars?.fmn || "",
        command: mp?.mpParticulars?.command || "",
      },

      /* 🔹 KEEP YOUR EXISTING STRUCTURE */
      reportNo: mp?.reportDetails?.reportNo || "",
      command: mp?.reportDetails?.command || "",
      firNo: mp?.reportDetails?.firNo || "",
      reportDate: new Date().toLocaleDateString("en-GB"),
      station: mp?.remarks?.station || "",

      occurrence: {
        offenceType: mp?.occurrenceDetails?.offenceType || "",
        place: mp?.occurrenceDetails?.place || "",
        date: mp?.occurrenceDetails?.date || "",
        time: mp?.occurrenceDetails?.time || "",
      },

      people: individuals.map((p: any, i: number) => ({
        sno: i + 1,
        armyNo: p.armyNumber || "",
        rank: p.rank || "",
        name: p.name || "",
        identityCard: p.iCardNumber || "",
        unitName: p.unit || "",
        fmn: p.fmn || "",
        address: p.address || "",
        remark: p.remark || "--",
        role: "Offender",
      })),

      witnesses: rawWitnesses.map((w: any, i: number) => ({
        sno: i + 1,
        armyNo: w.armyNumber || "",
        rank: w.rank || "",
        name: w.name || "",
        identityCard: w.iCardNumber || "",
        unitName: w.unit || "",
        fmn: w.fmn || "",
        address: w.address || "",
        remark: w.remark || "--",
      })),

      briefOfOccurrence: mp?.occurrenceDetails?.description || "",

      evidence: {
        eyeSketch: ev?.eyeSketch?.url ? "Attached" : "Nil",
        photos: ev?.photos?.length ? "Attached" : "Nil",
        videos: ev?.videos?.length ? "Attached" : "Nil",
      },
      documents: (mp.documents || []).map((d: any) => ({
        statement: d.statement || "",
        url: d.url || "",
        customFields: {},
      })),

      detailedReport: {
        statement:
          mp?.detailedReport?.statement ||
          mp?.detailedOccurrenceReport?.statement ||
          "",
        findings: Array.isArray(mp?.investigationPoints)
          ? mp.investigationPoints
          : mp?.investigationPoints
            ? [mp.investigationPoints]
            : [],
        opinion: mp?.opinion || "",
      },

      remarks: {
        analysis: mp?.remarks?.analysis || "",
        recommendation: mp?.remarks?.recommendation || "",
      },
    };
  };

  /* ================= FINAL SUBMIT ================= */
  const onSubmitFinal = async () => {
    try {
      const mp = state.formData.mpReport;

      const offenders = (mp?.individualDetails?.offenderList || []).map(
        (p: any) => ({
          offenderType: p.offenderType || "Unknown",
          armyNumber: p.armyNumber || "",
          rank: p.rank || "",
          name: p.name || "",
          unit: p.unit || "",
          fmn: p.fmn || "",
          address: p.address || "",
          iCardNumber: p.iCardNumber || "",
          remark: p.remark || "",
          customFields: {},
        })
      );

      const witnesses = (mp?.witnesses || []).map((w: any) => ({
        armyNumber: w.armyNumber || "",
        rank: w.rank || "",
        name: w.name || "",
        unit: w.unit || "",
        fmn: w.fmn || "",
        address: w.address || "",
        iCardNumber: w.iCardNumber || "",
        remark: w.remark || "",
        customFields: {},
      }));

      const payload = {
        reportDetails: {
          reportNumber: mp.reportDetails.reportNo,
          command: mp.reportDetails.command,
          firNumber: mp.reportDetails.firNo,
          firFileUrl: mp.reportDetails.firFile || "",
          customFields: {},
        },

        investigationHead: {
          armyNumber: mp.mpParticulars.armyNo,
          rank: mp.mpParticulars.rank,
          name: mp.mpParticulars.name,
          unit: mp.mpParticulars.unit,
          fmn: mp.mpParticulars.fmn,
          command: mp.mpParticulars.command,
          address: mp.mpParticulars.address,
          iCardNumber: mp.mpParticulars.icard,
          customFields: {},
        },

        occurrenceDetails: {
          offenceType: mp.occurrenceDetails.offenceType,
          placeOfOccurrence: mp.occurrenceDetails.place,
          dateOfOccurrence: toISODateTime(mp.occurrenceDetails.date, "00:00"),
          timeOfOccurrence: toISODateTime(
            mp.occurrenceDetails.date,
            mp.occurrenceDetails.time
          ),
          description: mp.occurrenceDetails.description,
          customFields: {},
        },

        offenders,
        witnesses,
        documents: mp.documents || [],
        evidences: buildEvidences(mp.evidence),

        /* ✅ CORRECT STEP MAPPING */
        detailedOccurrenceReport: mp.detailedOccurrenceReport,
        pointsFindOutDuringInvestigation: mp.investigationPoints,
        opinion: mp.opinion,

        remarks: {
          analysis: mp.remarks.analysis,
          recommendation: mp.remarks.recommendation,
          customFields: {},
        },

        customFields: {},
      };

      console.log("🚀 FINAL MP PAYLOAD", payload);

      await createReportAsync(payload);
      toast.success("MP Investigation Report Created 🎉");

      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create report");
    }
  };

  // ================= RIGHT PANEL STEP CONFIG =================
  const stepsConfig = {
    1: { component: <Step1ReportDetails /> },
    2: { component: <Step2 /> },
    3: { component: <Step3OccurrenceDetails /> },
    4: { component: <Step4IndividualDetails /> },
    5: { component: <Step5WitnessList /> },
    6: { component: <Step6Evidence /> },
    7: { component: <Step7Documents /> },
    8: { component: <Step8DetailedOccurrence /> },
    9: { component: <Step9InvestigationPoints /> },
    10: { component: <Step10Opinion /> },
    11: { component: <Step11Remarks /> },
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
            reportNo="PRO/21 CPU/00042/106/25"
            onCancel={onCancel}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          {/* RIGHT SIDE DYNAMIC CONTENT */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mode="mp"
          />
        </div>
      </div>
    </div>
  );
}
