

"use client";

import { useForm } from "@/context/FormContext";
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
import { OffenderType } from "@/apis/offender/types";

import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";

export default function MultiStepForm() {
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

const mapTrafficToReport = (traffic: any) => {
  /* ========= Primary Offender Resolver ========= */
  const getPrimaryOffender = () => {
    // VEHICLE = YES  → offenderPeople me hota hai
    if (traffic.vehicleInvolved === "yes" && traffic?.offenderPeople?.length) {
      return traffic.offenderPeople[0]?.details || {};
    }

    // VEHICLE = NO → offenderWithoutVehicle.military se lo
    return traffic?.offenderWithoutVehicle?.military || {};
  };

  const offender = getPrimaryOffender();
  const occ = traffic?.offenceOccurenceDetails || {};
  const duty = traffic?.onDutyDetails || {};
  const mp = traffic?.onDutyDetailsMPReporting || {};

  /* ========= Selected Witness ========= */
  const selectedWitness =
    traffic.selectedWitness !== null
      ? traffic.witnesses?.[traffic.selectedWitness]
      : null;

  return {
    reportNo: "TEMP/REPORT/001",
    reportDate: new Date().toLocaleDateString("en-GB"),

    /* ======================= 1️⃣ PARTICULARS ======================= */
    particulars: {
      primary: {
        aadharCardNo: offender?.aadharNumber || "N/A",
        name: offender?.name || "N/A",
        so: offender?.so || "N/A",
        relation: offender?.relation || "N/A",

        armyNo: offender?.armyNumber || "N/A",
        rank: offender?.rank || "N/A",
        unit: offender?.unit || "N/A",
        command: offender?.command || "N/A",
        fmn: offender?.fmn || "N/A",
        address: offender?.address || "N/A",
        iCardNo: offender?.iCardNumber || "N/A",
      },

      /* Vehicle block only when YES */
      vehicle:
        traffic.vehicleInvolved === "yes"
          ? {
              baNo: traffic.vehicleDetails?.vehicleNumber || "N/A",
              makeAndTake: traffic.vehicleDetails?.vehicleName || "N/A",
            }
          : undefined,
    },

    /* ======================= 2️⃣ OCCURRENCE ======================= */
    occurrence: {
      dateOfDuty: duty?.dateOfDuty || "N/A",
      dutyTime: duty?.startTime || "N/A",
      dutyLocation: duty?.dutyLocation || "N/A",

      nameOfWitnessingOfficial1:
        traffic?.witnesses?.[0]?.reportingBlock?.nameReportingMP || "N/A",
      nameOfWitnessingOfficial2:
        traffic?.witnesses?.[1]?.reportingBlock?.nameReportingMP || "",
      nameOfWitnessingOfficial3:
        traffic?.witnesses?.[2]?.reportingBlock?.nameReportingMP || "",

      timeOfOffence: occ?.timeOfOffence || occ?.time || "N/A",
      locationOfOffence: occ?.incidentLocation || "N/A",
      statement: occ?.description || "No statement available",
    },

    /* ======================= 3️⃣ OFFENCE ======================= */
    offence: {
      type: traffic?.offenceTypes?.[0] || "disciplinary",
      ref1: traffic?.offenceCode?.[0] || "Mil Tfc Offence",
      ref2: traffic?.offenceCode?.[1] || "Station Order / SAO",
      description: occ?.description || "No description provided",
    },

    /* ======================= SIGNATURE ======================= */
    witnessSig: {
      armyNo:
        selectedWitness?.reportingBlock?.armyNumber ||
        selectedWitness?.reportingBlock?.ArmyNo ||
        "N/A",
      rank: selectedWitness?.reportingBlock?.rank || "N/A",
      name: selectedWitness?.reportingBlock?.nameReportingMP || "N/A",
      unit: selectedWitness?.reportingBlock?.unit || "N/A",
    },

    mpSig: {
      armyNo: mp?.armyNumber || mp?.armyNo || "N/A",
      rank: mp?.rank || "N/A",
      name: mp?.nameReportingMP || "N/A",
      unit: mp?.unit || "N/A",
    },

    /* ======================= REMARKS ======================= */
    remarks: {
      text:
        traffic?.remarks ||
        "Suitable disciplinary action may be taken and intimated.",
      station: duty?.dutyLocation || "N/A",
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
};

  // ===================== FINAL SUBMIT =====================
  const onSubmitFinal = async () => {
    const traffic = state.formData.traffic;
    const date = traffic.onDutyDetails.dateOfDuty;

    const toISO = (time: string) => {
      if (!date || !time) return undefined;
      return new Date(`${date}T${time}`).toISOString();
    };

    const payload = {
      isVehicleInvolved: traffic.vehicleInvolved === "yes",

      onDutyDetails: {
        ...traffic.onDutyDetails,
        startTime: toISO(traffic.onDutyDetails.startTime),
        endTime: toISO(traffic.onDutyDetails.endTime),
      },

      onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,

      offenceOccurenceDetails: {
        ...traffic.offenceOccurenceDetails,
        timeOfOffence: toISO(traffic.offenceOccurenceDetails.timeOfOffence),
        incidentLocation:
          traffic.offenceOccurenceDetails.incidentLocation?.trim() || undefined,
      },

      offenceTypes: traffic.offenceTypes,
      offenceTypeReference: traffic.offenceCode,
    };

    try {
      toast.info("Creating Offence...");
      const offence = await mutateAsync(payload);
      toast.success("Offence Created Successfully!");

      const offenceId = offence?._id;
      if (!offenceId) return toast.error("Offence ID missing!");

      const offenderType: OffenderType =
        traffic.vehicleInvolved === "yes"
          ? (traffic.vehicleDetails.driverType as OffenderType)
          : (traffic.offenderWithoutVehicle.offenderType as OffenderType);

      await createOffenderMutate({
        offenceId,
        offenderType,
        offenderDetails: traffic.offenderPeople || [],
      });

      toast.success("Offender Saved");

      if (traffic.witnesses?.length > 0) {
        await Promise.all(
          traffic.witnesses.map((w) =>
            createWitnessMutate({
              offenceId,
              rank: w.reportingBlock.rank,
              unit: w.reportingBlock.unit,
              ArmyNo: w.reportingBlock.armyNumber,
              name: w.reportingBlock.nameReportingMP,
            })
          )
        );
      }

      toast.success("🎉 Final Submit Completed Successfully!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong!"
      );
    }
  };

  // ================== STEP CONFIG ==================
  const stepsConfig = {
    1: { title: "1. PARTICULARS:", component: <Step1Particulars /> },
    2: {
      title: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
      component: <Step2Statement />,
    },
    3: {
      title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
      component: <Step3Offence />,
    },
    4: {
      title: "4. REMARKS OF CO/2IC PROVOST UNIT:",
      component: <Step4Remarks />,
    },
  };

  // ================== PREVIEW MODE ==================
  if (state.preview) {
    return (
      <MilitaryPoliceReport {...mapTrafficToReport(state.formData.traffic)} />
    );
  }

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
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) => {
              Object.entries(data).forEach(([key, value]) => {
                dispatch({
                  type: "SET_PATH",
                  path: `formData.${key}`,
                  value,
                });
              });
            }}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
