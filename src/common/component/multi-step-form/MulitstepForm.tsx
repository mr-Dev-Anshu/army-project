

"use client";

import { useForm, initialState } from "@/context/FormContext";
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

  const { mutateAsync: createOffence } = useCreateTrafficOffence();
  const { mutateAsync: createOffender } = useCreateOffender();
  const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();
 const reportNo =
    state.formData.traffic?.reportNo || "TEMP/REPORT/001";


const mapTrafficToReport = (traffic: any) => {
  const occ = traffic?.offenceOccurenceDetails || {};
  const duty = traffic?.onDutyDetails || {};
  const v = traffic?.vehicleDetails || {};

  const driver =
    Array.isArray(traffic?.offenderPeople) &&
    traffic.offenderPeople.length > 0
      ? traffic.offenderPeople[0]?.details || {}
      : {};

  // ✅ MP WITNESSING FIX
  const mpWitness =
    Array.isArray(traffic?.witnesses) && traffic.witnesses.length > 0
      ? traffic.witnesses[0]
      : null;

  const reporting = mpWitness?.reportingBlock || {};
  const dutyBlock = mpWitness?.dutyBlock || {};

  return {
    reportNo: traffic?.reportNo || reportNo,
    reportDate: new Date().toLocaleDateString("en-GB"),

    particulars: {
      primary: {
        aadharCardNo: driver.aadharCardNo || "Nil",
        name: driver.name || "Nil",
        so: driver.so || "Nil",
        relation: driver.relation || "Nil",
        armyNo: driver.armyNumber || "Nil",
        rank: driver.rank || "Nil",
        unit: driver.unit || "Nil",
        command: driver.command || "Nil",
        fmn: driver.fmn || "Nil",
        address: driver.address || "Nil",
        iCardNo: driver.iCardNumber || "Nil",
      },

      secondary: null,

      vehicle:
        traffic.vehicleInvolved === "yes"
          ? {
              category: v.category || "Nil",
              vehicleType: v.vehicleType || "Nil",
              vehicleNumber: v.vehicleNumber || "Nil",
              vehicleName: v.vehicleName || "Nil",
            }
          : null,
    },

    occurrence: {
      dateOfDuty: dutyBlock?.dateOfDuty || "Nil",
      dutyTime:
        dutyBlock?.startTime && dutyBlock?.endTime
          ? `${dutyBlock.startTime} - ${dutyBlock.endTime}`
          : "Nil",
      dutyLocation: dutyBlock?.dutyLocation || "Nil",

      // ✅ MP WITNESS NAME (NOT MP REPORTING)
      nameOfWitnessingOfficial1: reporting?.nameReportingMP || "Nil",

      timeOfOffence: occ?.timeOfOffence || "Nil",
      locationOfOffence: occ?.incidentLocation || "Nil",
      statement: occ?.description || "Nil",
    },

    offence: {
      type: traffic?.offenceTypes?.[0] || "Nil",
      ref1: traffic?.offenceCode?.[0] || "Nil",
      ref2: traffic?.offenceCode?.[1] || "Nil",
      description: occ?.description || "Nil",
    },

    // ✅ MP WITNESS SIGNATURE
    witnessSig: {
      armyNo: reporting?.armyNumber || "Nil",
      rank: reporting?.rank || "Nil",
      name: reporting?.nameReportingMP || "Nil",
      unit: reporting?.unit || "Nil",
    },

    // ✅ MP SIGNATURE
    mpSig: {
      armyNo: reporting?.armyNumber || "Nil",
      rank: reporting?.rank || "Nil",
      name: reporting?.nameReportingMP || "Nil",
      unit: reporting?.unit || "Nil",
    },

    remarks: {
      text:
        traffic?.remarks ||
        "Suitable disciplinary action may be taken and intimated.",
      station: dutyBlock?.dutyLocation || "Nil",
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
};



  const toISO = (date?: string, time?: string) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`).toISOString();
  };



  const onSubmitFinal = async () => {
  try {
    const traffic = state.formData.traffic;
    console.log("🚔 RAW TRAFFIC ===>", traffic);

    /* ================= CREATE OFFENCE ================= */
    const offenceRes = await createOffence({
      reportNo: reportNo,
      isVehicleInvolved: traffic.vehicleInvolved === "yes",
      onDutyDetails: {
        ...traffic.onDutyDetails,
        startTime: toISO(
          traffic.onDutyDetails?.dateOfDuty,
          traffic.onDutyDetails?.startTime
        ),
        endTime: toISO(
          traffic.onDutyDetails?.dateOfDuty,
          traffic.onDutyDetails?.endTime
        ),
      },
      onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,
      offenceOccurenceDetails: {
        ...traffic.offenceOccurenceDetails,
        timeOfOffence: toISO(
          traffic.onDutyDetails?.dateOfDuty,
          traffic.offenceOccurenceDetails?.timeOfOffence
        ),
      },
      offenceTypes: traffic.offenceTypes?.length
        ? traffic.offenceTypes
        : ["minor"],
      offenceTypeReference: traffic.offenceCode || [],
    });

    const offenceId = offenceRes?._id;
    if (!offenceId) {
      toast.error("Offence ID missing");
      return;
    }

    /* ================= COLLECT ALL OFFENDERS ================= */
    const offenders: any[] = [];

    /* 1️⃣ Vehicle / normal offenders */
    if (Array.isArray(traffic.offenderPeople)) {
      offenders.push(...traffic.offenderPeople);
    }

    /* 2️⃣ No-vehicle offender flow */
    if (
      traffic.vehicleInvolved === "no" &&
      traffic.offenderWithoutVehicle?.military
    ) {
      const m = traffic.offenderWithoutVehicle.military;

      const hasData =
        m?.name || m?.armyNumber || m?.address || m?.rank;

      if (hasData) {
        offenders.push({
          type: traffic.offenderWithoutVehicle.offenderType || "Military",
          whoIsIt: "Offender",
          details: m,
        });
      }
    }

    console.log("👥 FINAL OFFENDERS ===>", offenders);

    for (const o of offenders) {
  const d = o.details || {};

  // 🛑 completely empty offender skip
  if (!Object.keys(d).length) continue;

  const payload: CreateOffenderData = {
    offenceId,
    offenderType: (o.type || "Civilian") as OffenderType,

    offenderDetails: {
      type: o.whoIsIt || "Offender",

      // 🔥🔥🔥 MAGIC LINE
      ...d,
    },
  };

  console.log("🚨 OFFENDER PAYLOAD ===>", payload);
  await createOffender(payload);
}


    /* ================= WITNESSES ================= */
    if (Array.isArray(traffic.witnesses)) {
      for (const w of traffic.witnesses) {
        await createWitness({
          offenceId,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP,
          contactNumber: w.reportingBlock.contactNumber,
        });
      }
    }

    toast.success("🎉 TRAFFIC REPORT COMPLETED");

    /* ================= RESET FORM ================= */
    dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
    dispatch({ type: "SET_STEP", payload: 1 });
    dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
  } catch (err) {
    console.error("❌ FINAL SUBMIT ERROR ===>", err);
    toast.error("Submit failed");
  }
};



  /* ================= STEPS CONFIG ================= */
  const stepsConfig = {
    1: {
      title: "1. PARTICULARS",
      component: (
        <Step1Particulars
          value={state.formData.traffic.vehicleInvolved}
          onChange={(v: string) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.traffic.vehicleInvolved",
              value: v,
            })
          }
        />
      ),
    },
    2: {
      title: "2. STATEMENT OF EVIDENCE / OCCURRENCE",
      component: <Step2Statement />,
    },
    3: {
      title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED",
      component: <Step3Offence />,
    },
    4: {
      title: "4. REMARKS",
      component: <Step4Remarks />,
    },
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={[
              { id: 1, label: "Particulars", icon: "1" },
              { id: 2, label: "Statement", icon: "2" },
              { id: 3, label: "Offence", icon: "3" },
              { id: 4, label: "Remarks", icon: "4" },
            ]}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New General & Traffic Offence Record"
            reportNo={reportNo || "PRO/21 CPU/00042/106/25"}
            onStepClick={(id) =>
              dispatch({ type: "SET_STEP", payload: id })
            }
            onCreate={onSubmitFinal}
            onCancel={onCancel}
            
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
          mapReport={mapTrafficToReport}
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
