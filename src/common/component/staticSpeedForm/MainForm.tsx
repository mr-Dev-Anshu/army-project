"use client";

import { useForm } from "@/context/FormContext";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4Remarks from "../multi-step-form/steps/Step4Remarks";

import StaticSpeedStep1Particulars from "./steps/Step1";
import Step2Statement from "./steps/step2";
import Step3Offence from "./steps/step3";

import { toast } from "react-toastify";

import { useCreateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";
import StaticSpeedReport from "@/components/reports/StaticSpeedReport";

export default function StaticSpeedForm() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();

  const mapStaticToReport = (data: any) => {
    const riderDetails = data?.offenderPeople?.[0]?.details || {};

    const rider = {
      armyNo:
        riderDetails["DD veh rider no."] || riderDetails["Army No."] || "N/A",

      name: riderDetails["Name"] || riderDetails["Driver Name"] || "N/A",

      rank: riderDetails["Select Rank"] || riderDetails["Rank"] || "N/A",

      unit: riderDetails["Unit"] || "N/A",

      fmn: riderDetails["FMN"] || "N/A",

      command: riderDetails["Command"] || "N/A",

      address:
        riderDetails["Address"] || riderDetails["Place of Stay"] || "N/A",

      iCardNo: riderDetails["I Card No."] || riderDetails["ICard"] || "N/A",
    };

    const witness =
      data.selectedWitness !== null
        ? data.witnesses?.[data.selectedWitness]
        : null;

    return {
      reportNo: "TEMP/STATIC/001",
      reportDate: new Date().toLocaleDateString("en-GB"),

      unitName: rider?.unit || "N/A",

      /* -------- 1️⃣ PARTICULARS -------- */
      particulars: {
        rider: {
          armyNo: rider?.armyNo || rider?.armyNo || "N/A",
          name: rider?.name || "N/A",
          fmn: rider?.fmn || "N/A",
          address: rider?.address || "N/A",
          rank: rider?.rank || "N/A",
          unit: rider?.unit || "N/A",
          command: rider?.command || "N/A",
          iCardNo: rider?.iCardNo || "N/A",
        },

        vehicle: {
          baNo: data?.vehicleDetails?.vehicleNumber || "N/A",
          makeAndTake: data?.vehicleDetails?.vehicleName || "N/A",
        },
      },

      /* -------- 2️⃣ OCCURRENCE -------- */
      occurrence: {
        statement: data?.offenceBlock?.description || "No statement available",
      },

      /* -------- 3️⃣ OFFENCE -------- */
      offence: {
        actualSpeed:
          data?.offenceBlock?.actualSpeedNoted ||
          data?.offenceBlock?.actualSpeed ||
          "N/A",

        authSpeed: data?.offenceBlock?.authSpeed || "N/A",

        overSpeed:
          data?.offenceBlock?.overSpeedCalculated ||
          data?.offenceBlock?.overSpeed ||
          "N/A",
      },

      /* -------- 4️ WITNESS SIGN -------- */
      witnessSig: {
        armyNo:
          witness?.reportingBlock?.armyNumber ||
          witness?.reportingBlock?.ArmyNo ||
          "N/A",
        rank: witness?.reportingBlock?.rank || "N/A",
        name: witness?.reportingBlock?.nameReportingMP || "N/A",
        unit: witness?.reportingBlock?.unit || "N/A",
      },

      /* -------- MP SIGN -------- */
      mpSig: {
        armyNo: data?.reportingBlock?.armyNumber || "N/A",
        rank: data?.reportingBlock?.rank || "N/A",
        name: data?.reportingBlock?.nameReportingMP || "N/A",
        unit: data?.reportingBlock?.unit || "N/A",
      },

      /* -------- REMARKS -------- */
      remarks: {
        text:
          data?.remarks || "Suitable disciplinary action may please be taken.",
        station: data?.dutyBlock?.dutyLocation || "N/A",
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed/\nOrders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  const stepsConfig = {
    1: { title: "1. PARTICULARS:", component: <StaticSpeedStep1Particulars /> },
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

  const handleFinalSubmit = async () => {
    try {
      /* ================= PAYLOAD ================= */
      const payload = {
        vehicleType: staticData.vehicleDetails.vehicleType,
        vehicleCategory: staticData.vehicleDetails.category,
        vehicleNumber: staticData.vehicleDetails.vehicleNumber,
        vehicleName: staticData.vehicleDetails.vehicleName,

        offenceOccurenceDetails: {
          time: staticData.offenceOccurenceDetails.time || "",
          incidentLocation: staticData.offenceOccurenceDetails.incidentLocation,
          description: staticData.offenceOccurenceDetails.description,
          overSpeedCalculated:
            staticData.offenceOccurenceDetails.overSpeedCalculated ?? "",
          actualSpeedNoted:
            staticData.offenceOccurenceDetails.actualSpeedNoted ?? "",
          authSpeed: staticData.offenceOccurenceDetails.authSpeed ?? "",
        },
      };

      console.log("🚗 STATIC SPEED PAYLOAD ===>", payload);

      /* ================= CREATE STATIC RECORD ================= */
      const staticRes = await createStaticRecord.mutateAsync(payload);
      toast.success("Static Record Created Successfully!");

      if (!staticRes?._id) {
        toast.error("Static Record ID Missing!");
        return;
      }

      // ========= 2️⃣ OFFENDER =========
      const offenderPayload: CreateOffenderData = {
        offenceId: staticRes._id,
        offenderType:
          (staticData.vehicleDetails.driverType as OffenderType) || "Civilian",

        offenderDetails:
          staticData.offenderPeople?.length > 0
            ? (staticData.offenderPeople as any)
            : ([] as any),
      };

      console.log("👮 STATIC OFFENDER PAYLOAD ===>", offenderPayload);

      await createOffenderMutation.mutateAsync(offenderPayload);
      toast.success("Offender Saved!");

      /* ================= CREATE WITNESS ================= */
      if (staticData.witnesses?.length > 0) {
        const witnessPayload = staticData.witnesses.map((w) => ({
          offenceId: staticRes._id,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP || "",
          contactNumber: w.reportingBlock.contactNumber || "",
        }));

        console.log("👀 WITNESS PAYLOAD ===>", witnessPayload);

        await Promise.all(
          witnessPayload.map((w) => createWitnessMutation.mutateAsync(w))
        );

        toast.success("Witness Added!");
      }

      toast.success("🎉 All Static Speed Processes Completed!");
    } catch (error: any) {
      console.log("❌ STATIC SPEED SUBMIT ERROR ===>", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to submit record"
      );
    }
  };

  if (state.preview) {
    return (
      <StaticSpeedReport {...mapStaticToReport(state.formData.staticSpeed)} />
    );
  }
  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New Static Speed Check Record"
            reportNo="PRO/21 CPU/00042/106/25"
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) => {
              Object.keys(data).forEach((key) => {
                dispatch({
                  type: "SET_PATH",
                  path: `formData.${key}`,
                  value: (data as any)[key],
                });
              });
            }}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            onSubmitFinal={handleFinalSubmit}
            stepsConfig={stepsConfig}
            mode="static"
          />
        </div>
      </div>
    </div>
  );
}
