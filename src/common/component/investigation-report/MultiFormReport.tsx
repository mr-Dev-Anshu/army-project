"use client";

import { initialState, useForm } from "@/context/FormContext";
import { toast } from "react-toastify";
import { useState } from "react";

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
  /* ================= RAW LISTS ================= */
  const individuals = mp?.individualDetails?.offenderList || [];
  const witnessList = mp?.witnesses || [];

  /* ================= PEOPLE ================= */
  const people = individuals.map((p: any, i: number) => ({
    sno: i + 1,
    armyNo: p.armyNumber || "Nil",
    rank: p.rank || "Nil",
    name: p.name || "Nil",
    identityCard: p.iCardNumber || "Nil",
    unitName: p.unit || "Nil",
    fmn: p.fmn || "Nil",
    address: p.address || "Nil",
    remark: p.remark || "--",
    role:
      p.offenderType === "Victim"
        ? "Victim"
        : p.offenderType === "Offender"
        ? "Offender"
        : "Unknown",
  }));

  /* ================= WITNESSES ================= */
  const witnesses = witnessList.map((w: any, i: number) => ({
    sno: i + 1,
    armyNo: w.armyNumber || "Nil",
    rank: w.rank || "Nil",
    name: w.name || "Nil",
    identityCard: w.iCardNumber || "Nil",
    unitName: w.unit || "Nil",
    fmn: w.fmn || "Nil",
    address: w.address || "Nil",
    remark: w.remark || "--",
  }));

  /* ================= INVESTIGATION ================= */
  const findings = Array.isArray(mp?.investigationPoints)
    ? mp.investigationPoints
    : typeof mp?.investigationPoints === "string" &&
      mp.investigationPoints.trim()
    ? mp.investigationPoints.split("\n")
    : [];

  return {
    /* ================= HEADER ================= */
    reportNo: mp?.reportDetails?.reportNo || "Nil",
    command: mp?.reportDetails?.command || "Nil",
    firNo: mp?.reportDetails?.firNo || "Nil",

    /* ================= MP DETAILS ================= */
    mpDetails: {
      armyNo: mp?.mpParticulars?.armyNo || "Nil",
      rank: mp?.mpParticulars?.rank || "Nil",
      name: mp?.mpParticulars?.name || "Nil",
      unit: mp?.mpParticulars?.unit || "Nil",
      fmn: mp?.mpParticulars?.fmn || "Nil",
      command: mp?.mpParticulars?.command || "Nil",
    },

    /* ================= OCCURRENCE ================= */
    occurrence: {
      offenceType: mp?.occurrenceDetails?.offenceType || "Nil",
      place: mp?.occurrenceDetails?.place || "Nil",
      date: mp?.occurrenceDetails?.date || "Nil",
      time: mp?.occurrenceDetails?.time || "Nil",
    },

    /* ================= PEOPLE & WITNESSES ================= */
    people,
    witnesses,

    /* ================= BRIEF ================= */
    briefOfOccurrence:
      mp?.occurrenceDetails?.description ||
      mp?.briefOfOccurrence ||
      "Nil",

    /* ================= EVIDENCE ================= */
    evidence: {
      eyeSketch: mp?.evidence?.eyeSketch?.url ? "Available" : "Nil",
      photos:
        mp?.evidence?.photos?.length > 0
          ? `${mp.evidence.photos.length} Photos`
          : "Nil",
      videos:
        mp?.evidence?.videos?.length > 0
          ? `${mp.evidence.videos.length} Videos`
          : "Nil",
    },

    /* ================= DOCUMENTS ================= */
    documents: (mp?.documents || []).map(
      (d: any) => d?.statement || "Nil"
    ),

    /* ================= DETAILED REPORT ================= */
    detailedReport: {
      statement:
        mp?.detailedOccurrenceReport?.statement ||
        mp?.detailedOccurrenceReport ||
        "Nil",
      findings,
      opinion:
        mp?.opinion?.statement ||
        mp?.opinion ||
        "Nil",
    },

    /* ================= REMARKS ================= */
    remarks: {
      analysis: mp?.remarks?.analysis || "Nil",
      recommendation: mp?.remarks?.recommendation || "Nil",
    },

    /* ================= FOOTER ================= */
    station: mp?.station || "Nil",
    reportDate:
      mp?.reportDate ||
      new Date().toLocaleDateString("en-GB"),
  };
};

const onSubmitFinal = async () => {
  try {
    const mp = state.formData.mpReport;

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
        placeOfOccurrence: mp.occurrenceDetails.place || "NA",
        dateOfOccurrence: toISODateTime(mp.occurrenceDetails.date, "00:00"),
        timeOfOccurrence: toISODateTime(
          mp.occurrenceDetails.date,
          mp.occurrenceDetails.time
        ),
        description: mp.occurrenceDetails.description || "Nil",
        customFields: {},
      },

      witnesses: (mp.witnesses || []).map((w: any) => ({
        armyNumber: w.armyNumber || "NA",
        rank: w.rank || "NA",
        name: w.name || "NA",
        unit: w.unit || "NA",
        fmn: w.fmn || "NA",
        address: w.address || "NA",
        iCardNumber: w.iCardNumber || "NA",
        remark: w.remark || "",
        customFields: {},
      })),

      /* ✅ DOCUMENTS — url REQUIRED */
      documents: (mp.documents || []).map((d: any) => ({
        statement: d.statement || "Nil",
        url: d.url || "NA",
      })),

      evidences: buildEvidences(mp.evidence),

      /* ✅ STRING ONLY */
      detailedOccurrenceReport:
        mp.detailedReport?.statement ||
        mp.detailedReport ||
        "Nil",

      /* ✅ STRING ONLY */
      pointsFindOutDuringInvestigation: Array.isArray(mp.investigationPoints)
        ? mp.investigationPoints.join("\n")
        : mp.investigationPoints || "Nil",

      /* ✅ STRING ONLY */
      opinion:
        mp.opinion?.statement ||
        mp.opinion ||
        "Nil",

      remarks: {
        analysis: mp.remarks.analysis || "Nil",
        recommendation: mp.remarks.recommendation || "Nil",
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



const stepsConfig = {
  1: {
    title: "1. REPORT DETAILS",
    component: <Step1ReportDetails />,
  },
  2: {
    title: "2. MP PARTICULARS",
    component: <Step2 />,
  },
  3: {
    title: "3. OFFENCE",
    component: <Step3OccurrenceDetails />,
  },
  4: {
    title: "4. DETAILS OF INDIVIDUAL",
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
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New MP Occurrence & Investigation Report"
            hideReportNo
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            onCreate={onSubmitFinal}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mode={mode}
            mapMpToReport={mapMpToReport}
          />
        </div>
      </div>
    </div>
  );
}
