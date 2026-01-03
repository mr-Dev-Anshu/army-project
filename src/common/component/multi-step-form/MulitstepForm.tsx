


"use client";

import { initialState, useForm } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { toast } from "react-toastify";
import Step1Particulars from "./steps/Step1Particulars";
import Step2Statement from "./steps/Step2Statement";
import Step3Offence from "./steps/Step3Offence";
import Step4Remarks from "./steps/Step4Remarks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

export default function MultiStepForm({ onCancel }: { onCancel?: () => void }) {
  const { state, dispatch } = useForm();

  const { mutateAsync } = useCreateTrafficOffence();
  const { mutateAsync: createOffenderMutate } = useCreateOffender();
  const { mutateAsync: createWitnessMutate } = useCreateOnDutyWitnessingMp();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

 /* ================= REPORT MAP ================= */
const mapTrafficToReport = (traffic: any) => {
  const offender =
    traffic?.offenderPeople?.[0]?.details ||
    traffic?.offenderWithoutVehicle ||
    {};

  const occ = traffic?.offenceOccurenceDetails || {};
  const duty = traffic?.onDutyDetails || {};
  const mp = traffic?.onDutyDetailsMPReporting || {};

  return {
    reportNo: "TEMP/REPORT/001",
    reportDate: new Date().toLocaleDateString("en-GB"),

    particulars: {
      primary: {
        name: offender?.name || offender?.Name || "N/A",
        armyNo: offender?.armyNumber || offender?.armyNo || "N/A",
        rank: offender?.rank || "N/A",
        unit: offender?.unit || "N/A",
        command: offender?.command || "N/A",
        fmn: offender?.fmn || "N/A",
        address: offender?.address || "N/A",
        iCardNo: offender?.iCardNumber || "N/A",
      },

      vehicle:
        traffic.vehicleInvolved === "yes"
          ? {
              baNo: traffic.vehicleDetails?.vehicleNumber || "N/A",
              makeAndTake: traffic.vehicleDetails?.vehicleName || "N/A",
            }
          : undefined,
    },

    occurrence: {
      dateOfDuty: duty.dateOfDuty || "N/A",
      dutyTime: duty.startTime || "N/A",
      dutyLocation: duty.dutyLocation || "N/A",
      timeOfOffence: occ.timeOfOffence || "N/A",
      locationOfOffence: occ.incidentLocation || "N/A",
      statement: occ.description || "N/A",
    },

    offence: {
      type: traffic.offenceTypes?.[0] || "minor",
      ref1: traffic.offenceCode?.[0] || "",
      description: occ.description || "",
    },

    mpSig: {
      name: mp.nameReportingMP || "N/A",
      rank: mp.rank || "N/A",
      armyNo: mp.armyNumber || "N/A",
      unit: mp.unit || "N/A",
    },

    remarks: {
      text: traffic.remarks || "",
      station: duty.dutyLocation || "",
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
};

/* ================= FINAL SUBMIT ================= */
const onSubmitFinal = async () => {
  try {
    const traffic = state.formData.traffic;

    console.log("🚔 RAW TRAFFIC STATE ===>", traffic);

    /* -------- CREATE OFFENCE -------- */
    const offenceRes = await mutateAsync({
      isVehicleInvolved: traffic.vehicleInvolved === "yes",

      onDutyDetails: {
        dateOfDuty: traffic.onDutyDetails.dateOfDuty,
        dutyLocation: traffic.onDutyDetails.dutyLocation,
        dutyType: traffic.onDutyDetails.dutyType,
        startTime: traffic.onDutyDetails.startTime
          ? new Date(
              `${traffic.onDutyDetails.dateOfDuty}T${traffic.onDutyDetails.startTime}`
            ).toISOString()
          : "",
        endTime: traffic.onDutyDetails.endTime
          ? new Date(
              `${traffic.onDutyDetails.dateOfDuty}T${traffic.onDutyDetails.endTime}`
            ).toISOString()
          : "",
      },

      onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,

      offenceOccurenceDetails: {
        description: traffic.offenceOccurenceDetails.description,
        incidentLocation:
          traffic.offenceOccurenceDetails.incidentLocation,
        timeOfOffence: traffic.offenceOccurenceDetails.timeOfOffence
          ? new Date(
              `${traffic.onDutyDetails.dateOfDuty}T${traffic.offenceOccurenceDetails.timeOfOffence}`
            ).toISOString()
          : "",
      },

      offenceTypes: traffic.offenceTypes || [],
      offenceTypeReference: traffic.offenceCode || [],
    });

    const offenceId = offenceRes?._id;
    if (!offenceId) return toast.error("Offence ID missing");

    /* ================= COLLECT ALL OFFENDERS ================= */
    const allOffenders: any[] = [];

    // ✅ vehicle involved
    if (Array.isArray(traffic.offenderPeople)) {
      traffic.offenderPeople.forEach((o: any) => {
        if (o) allOffenders.push(o);
      });
    }

    // ✅ no vehicle involved
    if (traffic.offenderWithoutVehicle) {
      allOffenders.push({
        type: traffic.offenderWithoutVehicle.offenderType || "Civilian",
        role: "Offender",
        details: traffic.offenderWithoutVehicle,
      });
    }

    console.log("👥 FINAL OFFENDER ARRAY ===>", allOffenders);

    /* ================= CREATE OFFENDERS ================= */
    for (const o of allOffenders) {
      if (!o || !o.details) continue;

      const d = o.details;

      // ❌ skip empty
      if (
        !d.name &&
        !d.Name &&
        !d.address &&
        !d.Address
      ) {
        console.log("⏭️ Skipped empty offender");
        continue;
      }

      const offenderPayload: CreateOffenderData = {
        offenceId,
        offenderType: (o.type || "Civilian") as OffenderType,

        offenderDetails: {
          type: o.role || "Offender",
          name: d.name || d.Name || "",
          rank: d.rank || "",
          armyNumber: d.armyNumber || "",
          unit: d.unit || "",
          command: d.command || "",
          fmn: d.fmn || "",
          address: d.address || "",
          iCardNumber: d.iCardNumber || "",
        },
      };

      console.log(
        "👮 CREATING OFFENDER ===>",
        JSON.stringify(offenderPayload, null, 2)
      );

      await createOffenderMutate(offenderPayload);
    }

    /* ================= CREATE WITNESSES ================= */
    if (Array.isArray(traffic.witnesses)) {
      for (const w of traffic.witnesses) {
        await createWitnessMutate({
          offenceId,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP,
          contactNumber: w.reportingBlock.contactNumber,
        });
      }
    }

    toast.success("🎉 Traffic Report Completed!");

    dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
    dispatch({ type: "SET_STEP", payload: 1 });
    dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
  } catch (e: any) {
    console.error("❌ FINAL SUBMIT ERROR ===>", e);
    toast.error("Submit failed");
  }
};


  const stepsConfig = {
    1: { title: "1. PARTICULARS", component: <Step1Particulars /> },
    2: { title: "2. STATEMENT", component: <Step2Statement /> },
    3: { title: "3. OFFENCE", component: <Step3Offence /> },
    4: { title: "4. REMARKS", component: <Step4Remarks /> },
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New General & Traffic Offence Record"
            reportNo="PRO/21 CPU/00042/106/25"
            onStepClick={(id) =>
              dispatch({ type: "SET_STEP", payload: id })
            }
            onCreate={onSubmitFinal}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel?.();
            }}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={stepsConfig}
            mode="traffic"
            mapTrafficToReport={mapTrafficToReport}
          />
        </div>
      </div>
    </div>
  );
}
