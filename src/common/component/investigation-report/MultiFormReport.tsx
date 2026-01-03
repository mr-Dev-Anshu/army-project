// "use client";

// import { initialState, useForm } from "@/context/FormContext";
// import { toast } from "react-toastify";
// import { useState } from "react";

// import Step1ReportDetails from "./steps/Step1ReportingDetails";
// import Step2 from "./steps/Step2Particulars";
// import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
// import Step4IndividualDetails from "./steps/Step4IndividualDetails";
// import Step5WitnessList from "./steps/Step5WitnessList";
// import Step6Evidence from "./steps/Step6Evidence";
// import Step7Documents from "./steps/Step7Document";
// import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
// import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
// import Step10Opinion from "./steps/Step10Opinion";
// import Step11Remarks from "./steps/Step11Remarks";

// import { LeftStepper } from "../multi-step-form/LeftStepper";
// import { RightPanel } from "../multi-step-form/RightPanel";

// import { useCreateMPReport } from "@/features/mpReports/hooks";
// import { createOffender } from "@/apis";
// import { OffenderType } from "@/apis/offender/types";

// export default function MultiFormReport({
//   onCancel,
// }: {
//   onCancel: () => void;
// }) {
//   const { state, dispatch } = useForm();
//   const [mode] = useState("mp");
//   const { mutateAsync: createReportAsync } = useCreateMPReport();

//   /* ================= STEPS ================= */
//   const steps = [
//     { id: 1, label: "Report Details", icon: "1" },
//     { id: 2, label: "MP Particulars", icon: "2" },
//     { id: 3, label: "Occurrence Details", icon: "3" },
//     { id: 4, label: "Details of Individual", icon: "4" },
//     { id: 5, label: "Witness", icon: "5" },
//     { id: 6, label: "Evidence", icon: "6" },
//     { id: 7, label: "Documents", icon: "7" },
//     { id: 8, label: "Detailed Occurrence Report", icon: "8" },
//     { id: 9, label: "Points found during investigation", icon: "9" },
//     { id: 10, label: "Opinion", icon: "10" },
//     { id: 11, label: "Remarks of CO/21C Provost Unit", icon: "11" },
//   ];

//   const pick = (...vals: any[]) =>
//     vals.find((v) => v && String(v).trim() !== "") || "";
//   const cleanObject = (obj: Record<string, any>) => {
//   return Object.fromEntries(
//     Object.entries(obj).filter(
//       ([_, v]) =>
//         v !== "" &&
//         v !== null &&
//         v !== undefined &&
//         !(typeof v === "object" && Object.keys(v).length === 0)
//     )
//   );
// };

//   const normalizeOffenderType = (type?: string): OffenderType => {
//     if (!type) return "Civilian";

//     const t = type.toLowerCase();

//     if (t.includes("military")) return "Military Person";
//     if (t.includes("employee")) return "Employee";
//     if (t.includes("servant") || t.includes("maid")) return "Servant/Maid";
//     if (t.includes("shop")) return "Shop Keeper";
//     if (t.includes("worker")) return "Temporary Hired Worker";

//     return "Civilian";
//   };

//   const toISODateTime = (date?: string, time?: string) => {
//     if (!date || !time) return null;
//     return new Date(`${date}T${time}`).toISOString();
//   };

//   /* ================= PREVIEW MAPPER ================= */
//   const mapMpToReport = (mp: any) => {
//     const individuals = mp?.individualDetails?.offenderList || [];
//     const rawWitnesses = mp?.witnesses || [];
//     const ev = mp?.evidence || {};

//     const people = individuals.map((p: any, i: number) => ({
//       sno: i + 1,
//       armyNo: p.armyNumber || p.armyNo || "N/A",
//       rank: p.rank || "N/A",
//       name: p.name || "N/A",
//       identityCard: p.iCardNumber || p.icard || "N/A",
//       unitName: p.unit || "N/A",
//       fmn: p.fmn || "N/A",
//       address: p.address || "N/A",
//       remark: p.remark || "--",
//       role: "Offender",
//     }));

//     const witnesses = rawWitnesses.map((p: any, i: number) => ({
//       sno: i + 1,
//       armyNo: p.armyNumber || p.armyNo || "N/A",
//       rank: p.rank || "N/A",
//       name: p.name || "N/A",
//       identityCard: p.iCardNumber || p.icard || "N/A",
//       unitName: p.unit || "N/A",
//       fmn: p.fmn || "N/A",
//       address: p.address || "N/A",
//       remark: p.remark || "--",
//     }));

//     const evidence = {
//       eyeSketch: ev?.eyeSketch || "",
//       photos: Array.isArray(ev?.photos) && ev.photos.length ? "Attached" : "",
//       videos: Array.isArray(ev?.videos) && ev.videos.length ? "Attached" : "",
//     };

//     return {
//       reportNo: mp?.reportDetails?.reportNo || "N/A",
//       reportDate: new Date().toLocaleDateString("en-GB"),

//       mpDetails: {
//         armyNo: mp?.mpParticulars?.armyNo || "N/A",
//         rank: mp?.mpParticulars?.rank || "N/A",
//         name: mp?.mpParticulars?.name || "N/A",
//         unit: mp?.mpParticulars?.unit || "N/A",
//         fmn: mp?.mpParticulars?.fmn || "N/A",
//         command: mp?.mpParticulars?.command || "N/A",
//       },

//       occurrence: {
//         offenceType: mp?.occurrenceDetails?.offenceType || "N/A",
//         place: mp?.occurrenceDetails?.place || "N/A",
//         date: mp?.occurrenceDetails?.date || "N/A",
//         time: mp?.occurrenceDetails?.time || "N/A",
//         description: mp?.occurrenceDetails?.description || "N/A",
//       },

//       people,
//       witnesses,
//       evidence,

//       documents: (mp?.documents || []).map((d: any) => d.statement || ""),
//       detailedReport: {
//         findings: Array.isArray(mp?.investigationPoints)
//           ? mp.investigationPoints
//           : mp?.investigationPoints
//           ? [mp.investigationPoints]
//           : [],
//       },

//       investigationPoints: mp?.investigationPoints || "",
//       opinion: mp?.opinion || "",

//       remarks: {
//         analysis: mp?.remarks?.analysis || "",
//         recommendation: mp?.remarks?.recommendation || "",
//       },
//     };
//   };
//   const createIndividualsAndWitnessesSequentially = async (
//     offenceId: string,
//     individuals: any[],
//     witnesses: any[]
//   ) => {
//     /* ========= INDIVIDUALS ========= */
//     for (const ind of individuals) {
//       const offenderPayload = {
//         offenceId,

//         // ✅ DIRECT FROM FORM (NO HARD CODING)
//         offenderType: ind.offenderType || ind.driverType,

//         category: "individual",

//         offenderDetails: {
//           type: "Individual",

//           // ✅ PURE FORM DATA ONLY
//           ...cleanObject(ind),
//         },
//       };

//       console.log(
//         "🚨 MP OFFENDER PAYLOAD (INDIVIDUAL) ===>",
//         JSON.stringify(offenderPayload, null, 2)
//       );

//       try {
//         const res = await createOffender(offenderPayload);
//         console.log("✅ MP INDIVIDUAL CREATED ===>", res);
//         toast.success("Individual offender created ✅");
//       } catch (err: any) {
//         console.error(
//           "❌ MP INDIVIDUAL CREATE ERROR ===>",
//           err?.response?.data || err
//         );
//         toast.error(
//           err?.response?.data?.message || "Individual offender failed ❌"
//         );
//         throw err;
//       }
//     }

//     /* ========= WITNESSES ========= */
//     for (const wit of witnesses) {
//       const rb = wit.reportingBlock || {};

//       const witnessDetails = cleanObject({
//         name: rb.nameReportingMP,
//         rank: rb.rank,
//         armyNumber: rb.armyNumber,
//         unit: rb.unit,
//       });

//       // ⛔ agar kuch bhara hi nahi
//       if (Object.keys(witnessDetails).length === 0) continue;

//       const witnessPayload = {
//         offenceId,

//         // ✅ FROM FORM
//         offenderType: wit.offenderType || "Witness",

//         category: "witnessing",

//         offenderDetails: {
//           type: "Witness",
//           ...witnessDetails,
//         },
//       };

//       console.log(
//         "🚨 MP OFFENDER PAYLOAD (WITNESS) ===>",
//         JSON.stringify(witnessPayload, null, 2)
//       );

//       try {
//         const res = await createOffender(witnessPayload);
//         console.log("✅ MP WITNESS CREATED ===>", res);
//         toast.success("Witness created ✅");
//       } catch (err: any) {
//         console.error(
//           "❌ MP WITNESS CREATE ERROR ===>",
//           err?.response?.data || err
//         );
//         toast.error(
//           err?.response?.data?.message || "Witness creation failed ❌"
//         );
//         throw err;
//       }
//     }
//   };

//   const onSubmitFinal = async () => {
//     try {
//       const mp = state.formData.mpReport;

//       const individuals = (mp?.individualDetails?.offenderList || []).filter(
//         (p: any) =>
//           p && Object.values(p).some((v) => v && String(v).trim() !== "")
//       );

//       const witnesses = (mp?.witnesses || []).filter(
//         (p: any) =>
//           p && Object.values(p).some((v) => v && String(v).trim() !== "")
//       );

//       /* ✅ DEFINE PAYLOAD FIRST */
//       const payload = {
//         reportDetails: {
//           reportNumber: mp.reportDetails.reportNo,
//           command: mp.reportDetails.command,
//           firNumber: mp.reportDetails.firNo,
//           firFileUrl: mp.reportDetails.firFile || "",
//           customFields: {},
//         },

//         investigationHead: {
//           armyNumber: mp.mpParticulars.armyNo,
//           rank: mp.mpParticulars.rank,
//           name: mp.mpParticulars.name,
//           unit: mp.mpParticulars.unit,
//           fmn: mp.mpParticulars.fmn,
//           command: mp.mpParticulars.command,
//           address: mp.mpParticulars.address,
//           iCardNumber: mp.mpParticulars.icard,
//           customFields: {},
//         },

//         occurrenceDetails: {
//           offenceType: mp.occurrenceDetails.offenceType,
//           placeOfOccurrence: mp.occurrenceDetails.place,
//           dateOfOccurrence: toISODateTime(mp.occurrenceDetails.date, "00:00"),
//           timeOfOccurrence: toISODateTime(
//             mp.occurrenceDetails.date,
//             mp.occurrenceDetails.time
//           ),
//           description: mp.occurrenceDetails.description,
//           customFields: {},
//         },

//         documents: (mp.documents || []).map((d: any) => ({
//           statement: d.statement,
//           url: d.url || "",
//           customFields: {},
//         })),

//         detailedOccurrenceReport: mp.detailedReport,
//         pointsFindOutDuringInvestigation: mp.investigationPoints,
//         opinion: mp.opinion,

//         remarks: {
//           analysis: mp.remarks.analysis,
//           recommendation: mp.remarks.recommendation,
//           customFields: {},
//         },

//         customFields: {},
//       };

//       console.log("📦 MP REPORT PAYLOAD", payload);

//       /* 🔹 CREATE MP REPORT */
//       const res: any = await createReportAsync(payload);

//       toast.success("MP Investigation Report Created 🎉");

//       const offenceId = res?._id;
//       if (!offenceId) return;

//       console.log("🚀 MP REPORT CREATED, NOW CREATING OFFENDERS");

//       /* 🔹 CREATE OFFENDERS SEQUENTIALLY */
//       await createIndividualsAndWitnessesSequentially(
//         offenceId,
//         individuals,
//         witnesses
//       );

//       console.log("✅ ALL OFFENDERS CREATED");

//       dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
//       dispatch({ type: "SET_STEP", payload: 1 });
//       dispatch({
//         type: "SET_PATH",
//         path: "completedSteps",
//         value: [],
//       });
//     } catch (err: any) {
//       console.error("❌ FINAL SUBMIT ERROR", err?.response?.data || err);
//       toast.error("Failed to create report");
//     }
//   };

//   /* ================= RIGHT PANEL CONFIG ================= */
//   const stepsConfig = {
//     1: { title: "1. REPORT DETAILS :", component: <Step1ReportDetails /> },
//     2: { title: "2. MP PARTICULARS :", component: <Step2 /> },
//     3: {
//       title: "3. OCCURRENCE DETAILS :",
//       component: <Step3OccurrenceDetails />,
//     },
//     4: {
//       title: "4. DETAILS OF INDIVIDUALS :",
//       component: <Step4IndividualDetails />,
//     },
//     5: { title: "5. WITNESS LIST :", component: <Step5WitnessList /> },
//     6: { title: "6. EVIDENCE :", component: <Step6Evidence /> },
//     7: { title: "7. DOCUMENTS :", component: <Step7Documents /> },
//     8: {
//       title: "8. DETAILED OCCURRENCE REPORT :",
//       component: <Step8DetailedOccurrence />,
//     },
//     9: {
//       title: "9. POINTS FOUND DURING INVESTIGATION :",
//       component: <Step9InvestigationPoints />,
//     },
//     10: { title: "10. OPINION :", component: <Step10Opinion /> },
//     11: {
//       title: "11. REMARKS OF CO/21C PROVOST UNIT :",
//       component: <Step11Remarks />,
//     },
//   };

//   return (
//     <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
//       <div className="w-full bg-white rounded-lg overflow-hidden h-full">
//         <div className="flex h-full">
//           <LeftStepper
//             steps={steps}
//             currentStep={state.currentStep}
//             completedSteps={state.completedSteps}
//             title="Create New MP Occurrence & Investigation Report"
//             hideReportNo
//             onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
//             onCreate={onSubmitFinal}
//             onCancel={() => {
//               dispatch({ type: "SET_STEP", payload: 1 });
//               onCancel();
//             }}
//           />

//           <RightPanel
//             step={state.currentStep}
//             formData={state.formData}
//             setFormData={(path: string, value: unknown) =>
//               dispatch({ type: "SET_PATH", path, value })
//             }
//             onNext={() => dispatch({ type: "NEXT_STEP" })}
//             onPrev={() => dispatch({ type: "PREV_STEP" })} 
//             onSubmitFinal={onSubmitFinal}
//             stepsConfig={stepsConfig}
//             mode={mode}
//             mapMpToReport={mapMpToReport}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }






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
import { createOffender } from "@/apis";
import { OffenderType } from "@/apis/offender/types";

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

  if (Array.isArray(ev?.photos)) {
    ev.photos.forEach((p: any) => {
      if (!p?.url) return;
      evidences.push({
        type: "Photo",
        url: p.url,
        description: p.description || "",
        customFields: {},
      });
    });
  }

  if (Array.isArray(ev?.videos)) {
    ev.videos.forEach((v: any) => {
      if (!v?.url) return;
      evidences.push({
        type: "Video",
        url: v.url,
        description: v.description || "",
        customFields: {},
      });
    });
  }

  return evidences;
};

export default function MultiFormReport({ onCancel }: { onCancel: () => void }) {
  const { state, dispatch } = useForm();
  const [mode] = useState("mp");
  const { mutateAsync: createReportAsync } = useCreateMPReport();

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
    { id: 11, label: "Remarks of CO/21C Provost Unit", icon: "11" },
  ];

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) =>
          v !== "" &&
          v !== null &&
          v !== undefined &&
          !(typeof v === "object" && Object.keys(v).length === 0)
      )
    );

  const toISODateTime = (date?: string, time?: string) =>
    date && time ? new Date(`${date}T${time}`).toISOString() : null;
const mapMpToReport = (mp: any) => {
  const individuals = mp?.individualDetails?.offenderList || [];
  const rawWitnesses = mp?.witnesses || [];
  const ev = mp?.evidence || {};

  return {
    reportNo: mp?.reportDetails?.reportNo || "N/A",
    command: mp?.reportDetails?.command || "N/A",
    firNo: mp?.reportDetails?.firNo || "N/A",
    reportDate: new Date().toLocaleDateString("en-GB"),
    station: mp?.remarks?.station || "N/A",

    mpDetails: {
      armyNo: mp?.mpParticulars?.armyNo || "N/A",
      rank: mp?.mpParticulars?.rank || "N/A",
      name: mp?.mpParticulars?.name || "N/A",
      unit: mp?.mpParticulars?.unit || "N/A",
      fmn: mp?.mpParticulars?.fmn || "N/A",
      command: mp?.mpParticulars?.command || "N/A",
    },

    occurrence: {
      offenceType: mp?.occurrenceDetails?.offenceType || "N/A",
      place: mp?.occurrenceDetails?.place || "N/A",
      date: mp?.occurrenceDetails?.date || "N/A",
      time: mp?.occurrenceDetails?.time || "N/A",
    },

    people: individuals.map((p: any, i: number) => ({
      sno: i + 1,
      armyNo: p.armyNumber || "N/A",
      rank: p.rank || "N/A",
      name: p.name || "N/A",
      identityCard: p.iCardNumber || "N/A",
      unitName: p.unit || "N/A",
      fmn: p.fmn || "N/A",
      address: p.address || "N/A",
      remark: p.remark || "--",
      role: "Offender",
    })),

    witnesses: rawWitnesses.map((w: any, i: number) => ({
      sno: i + 1,
      armyNo: w.armyNumber || "N/A",
      rank: w.rank || "N/A",
      name: w.name || "N/A",
      identityCard: w.iCardNumber || "N/A",
      unitName: w.unit || "N/A",
      fmn: w.fmn || "N/A",
      address: w.address || "N/A",
      remark: w.remark || "--",
    })),

    briefOfOccurrence: mp?.occurrenceDetails?.description || "",

    evidence: {
      eyeSketch: ev?.eyeSketch?.url ? "Attached" : "Nil",
      photos: ev?.photos?.length ? "Attached" : "Nil",
      videos: ev?.videos?.length ? "Attached" : "Nil",
    },

    documents: (mp?.documents || []).map((d: any) => d?.statement || ""),

    // 🔥🔥🔥 THIS WAS MISSING 🔥🔥🔥
    detailedReport: {
      statement:
        mp?.detailedReport?.statement ||
        mp?.detailedOccurrenceReport?.statement ||
        "",
      findings:
        Array.isArray(mp?.investigationPoints)
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

  const onSubmitFinal = async () => {
    try {
      const mp = state.formData.mpReport;

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

        documents: (mp.documents || []).map((d: any) => ({
          statement: d.statement,
          url: d.url || "",
          customFields: {},
        })),

        evidences: buildEvidences(mp.evidence),

        detailedOccurrenceReport: mp.detailedReport,
        pointsFindOutDuringInvestigation: mp.investigationPoints,
        opinion: mp.opinion,

        remarks: {
          analysis: mp.remarks.analysis,
          recommendation: mp.remarks.recommendation,
          customFields: {},
        },

        customFields: {},
      };

      const res: any = await createReportAsync(payload);
      toast.success("MP Investigation Report Created 🎉");

      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
    } catch (err) {
      toast.error("Failed to create report");
    }
  };

  const stepsConfig = {
    1: { title: "1. REPORT DETAILS :", component: <Step1ReportDetails /> },
    2: { title: "2. MP PARTICULARS :", component: <Step2 /> },
    3: { title: "3. OCCURRENCE DETAILS :", component: <Step3OccurrenceDetails /> },
    4: { title: "4. DETAILS OF INDIVIDUALS :", component: <Step4IndividualDetails /> },
    5: { title: "5. WITNESS LIST :", component: <Step5WitnessList /> },
    6: { title: "6. EVIDENCE :", component: <Step6Evidence /> },
    7: { title: "7. DOCUMENTS :", component: <Step7Documents /> },
    8: { title: "8. DETAILED OCCURRENCE REPORT :", component: <Step8DetailedOccurrence /> },
    9: { title: "9. POINTS FOUND DURING INVESTIGATION :", component: <Step9InvestigationPoints /> },
    10: { title: "10. OPINION :", component: <Step10Opinion /> },
    11: { title: "11. REMARKS OF CO/21C PROVOST UNIT :", component: <Step11Remarks /> },
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
            setFormData={(path: string, value: unknown) =>
              dispatch({ type: "SET_PATH", path, value })
            }
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
