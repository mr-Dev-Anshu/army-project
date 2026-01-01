import { useForm } from "@/context/FormContext";

import { toast } from "react-toastify";
import Step1ReportDetails from "./steps/Step1ReportingDetails";
import Step2 from "./steps/Step2Particulars";
import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4IndividualDetails from "./steps/Step4IndividualDetails";
import Step5WitnessList from "./steps/Step5WitnessList";
import Step6Evidence from "./steps/Step6Evidence";
import Step7Documents from "./steps/Step7Document";
import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
import Step10Opinion from "./steps/Step10Opinion";
import Step11Remarks from "./steps/Step11Remarks";
import { useCreateMPReport } from "@/features/mpReports/hooks";
import { createOffender } from "@/apis";
import { OffenderType } from "@/apis/offender/types";
import MpOccurrenceReport from "@/components/reports/MpOccurrenceReport";

export default function MultiFormReport() {
  const { state, dispatch } = useForm();
  // ================= MP STEPPER STEPS =================
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

  const { mutate: createReport, isPending } = useCreateMPReport();



const mapMpToReport = (mp: any) => {
  const offenders = mp.individualDetails?.offenderList || [];
  const witnessList = mp.witnesses || [];

  return {
    reportNo: mp.reportDetails.reportNo || "N/A",
    command: mp.reportDetails.command || "N/A",
    firNo: mp.reportDetails.firNo || "N/A",

    mpDetails: {
      armyNo: mp.mpParticulars.armyNo || "N/A",
      rank: mp.mpParticulars.rank || "N/A",
      name: mp.mpParticulars.name || "N/A",
      unit: mp.mpParticulars.unit || "N/A",
      fmn: mp.mpParticulars.fmn || "N/A",
      command: mp.mpParticulars.command || "N/A",
    },

    occurrence: {
      offenceType: mp.occurrenceDetails.offenceType || "N/A",
      place: mp.occurrenceDetails.place || "N/A",
      date: mp.occurrenceDetails.date || "N/A",
      time: mp.occurrenceDetails.time || "N/A",
    },

    /* ---------- VICTIMS / OFFENDERS TABLE ---------- */
    people: offenders.map((p: any, i: number) => ({
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

    briefOfOccurrence: mp.occurrenceDetails.description || "N/A",

    /* ---------- WITNESS TABLE ---------- */
    witnesses: witnessList.map((p: any, i: number) => ({
      sno: i + 1,
      armyNo: p.armyNumber || "N/A",
      rank: p.rank || "N/A",
      name: p.name || "N/A",
      identityCard: p.iCardNumber || "N/A",
      unitName: p.unit || "N/A",
      fmn: p.fmn || "N/A",
      address: p.address || "N/A",
      remark: p.remark || "--",
    })),

    evidence: {
      eyeSketch: mp.evidence.eyeSketch || "",
      photos: mp.evidence.photos?.length ? "Attached" : "",
      videos: mp.evidence.videos?.length ? "Attached" : "",
    },

    documents: (mp.documents || []).map((d: any) => d.statement),

    detailedReport: {
      statement: mp.detailedReport || "",
      findings: mp.investigationPoints
        ? mp.investigationPoints.split("\n")
        : [],
      opinion: mp.opinion || "",
    },

    remarks: {
      analysis: mp.remarks.analysis || "",
      recommendation: mp.remarks.recommendation || "",
    },

    station: mp.reportDetails.command || "N/A",
    reportDate: new Date().toLocaleDateString("en-GB"),
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
          ...(mp.reportDetails.firFile
            ? { firFileUrl: mp.reportDetails.firFile }
            : {}),
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
        },

        occurrenceDetails: {
          offenceType: mp.occurrenceDetails.offenceType,
          placeOfOccurrence: mp.occurrenceDetails.place,

          dateOfOccurrence: mp.occurrenceDetails.date,
          timeOfOccurrence: new Date(
            `${mp.occurrenceDetails.date}T${mp.occurrenceDetails.time}:00`
          ).toISOString(),

          description: mp.occurrenceDetails.description,
        },

        documents: (mp.documents || [])
          .filter((d) => d.url)
          .map((d) => ({
            statement: d.statement,
            url: d.url,
          })),

        evidences: [],

        detailedOccurrenceReport: mp.detailedReport,
        pointsFindOutDuringInvestigation: mp.investigationPoints,
        opinion: mp.opinion,

        remarks: {
          analysis: mp.remarks.analysis,
          recommendation: mp.remarks.recommendation,
        },
      };

      // 👀 Payload Console
      console.log("MP REPORT PAYLOAD ===>", payload);

      createReport(payload, {
        onSuccess: async (res: any) => {
          toast.success("MP Investigation Report Created Successfully 🎉");
          console.log("MP REPORT CREATED SUCCESS ===>", res);

          const reportId = res?._id;

          try {
            const offenderList =
              state.formData.mpReport.individualDetails.offenderList;
            for (const offender of offenderList) {
              const offenderPayload = {
                offenceId: reportId,
                offenderType: (offender.driverType as OffenderType )|| "Civilian",
                category: "investigation",

                offenderDetails: [
                  {
                    type: "Driver",
                    details: offender,
                  },
                ],
              };

              console.log("FINAL OFFENDER PAYLOAD ===>", offenderPayload);
              await createOffender(offenderPayload);
            }

            // toast.success("Offender(s) Created Successfully 🎯");
          } catch (err: any) {
            console.log("OFFENDER CREATE ERROR ===>", err?.response || err);
            toast.error("Offender creation failed ❌");
          }

          dispatch({
            type: "SET_PATH",
            path: "mpReport.createdId",
            value: reportId,
          });
        },

        onError: (err: any) => {
          console.log(" RAW ERROR ===>", err);
          console.log(" STATUS ===>", err?.response?.status);
          console.log(" SERVER MESSAGE ===>", err?.response?.data?.message);
          console.log(" VALIDATION ERRORS ===>", err?.response?.data?.errors);

          toast.error(
            err?.response?.data?.message || "Failed to create report"
          );
        },
      });
    } catch (err) {
      console.log("SUBMIT TRY/CATCH ERROR ===>", err);
      toast.error("Invalid form data");
    }
  };

  // ================= RIGHT PANEL STEP CONFIG =================
  const stepsConfig = {
    1: { title: "Report Details", component: <Step1ReportDetails /> },

    2: { title: "MP Particulars", component: <Step2 /> },

    3: {
      title: "Occurrence Details",
      component: <Step3OccurrenceDetails />,
    },
    4: {
      title: "Details of Individual",
      component: <Step4IndividualDetails />,
    },
    5: {
      title: "Witness",
      component: <Step5WitnessList />,
    },
    6: {
      title: "Evidence",
      component: <Step6Evidence />,
    },
    7: {
      title: "Documents",
      component: <Step7Documents />,
    },
    8: {
      title: "Detailed Occurrence Report",
      component: <Step8DetailedOccurrence />,
    },
    9: {
      title: "Points found during investigation",
      component: <Step9InvestigationPoints />,
    },
    10: {
      title: "Opinion",
      component: <Step10Opinion />,
    },
    11: {
      title: "Remarks of CO/21C Provost Unit",
      component: <Step11Remarks />,
    },
  };


  if (state.preview) {
  return (
    <div className="relative">
      {/* CLOSE BUTTON */}
      <button
        onClick={() => dispatch({ type: "SET_PREVIEW", payload: false })}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Close Preview
      </button>

      <MpOccurrenceReport
        {...mapMpToReport(state.formData.mpReport)}
      />
    </div>
  );
}

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
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          {/* RIGHT SIDE DYNAMIC CONTENT */}
          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(path: string, value: unknown) =>
              dispatch({ type: "SET_PATH", path, value })
            }
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
