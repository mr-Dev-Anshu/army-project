"use client";

import { initialState, useForm } from "@/context/FormContext";
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
import { StaticSpeedState } from "@/common/types/form.types";

export default function StaticSpeedForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
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
      /* ================= STATIC SPEED PAYLOAD ================= */
      const payload = {
        vehicleType: staticData.vehicleDetails.vehicleType,
        vehicleCategory: staticData.vehicleDetails.category,
        vehicleNumber: staticData.vehicleDetails.vehicleNumber,
        vehicleName: staticData.vehicleDetails.vehicleName,

        offenceOccurenceDetails: {
          time: staticData.offenceBlock?.time || "",
          incidentLocation: staticData.offenceBlock?.incidentLocation || "",
          description: [
            staticData.offenceBlock?.description,
            staticData.offenceBlock?.description2,
          ]
            .filter(Boolean)
            .join("\n\n"),

          overSpeedCalculated:
            staticData.offenceBlock?.overSpeedCalculated ?? "",
          actualSpeedNoted: staticData.offenceBlock?.actualSpeedNoted ?? "",
          authSpeed: staticData.offenceBlock?.authSpeed ?? "",
        },
      };

      console.log("🚗 STATIC SPEED PAYLOAD ===>", payload);

      /* ================= CREATE STATIC RECORD ================= */
      const staticRes = await createStaticRecord.mutateAsync(payload);
      console.log("✅ STATIC SPEED BACKEND RESPONSE ===>", staticRes);

      toast.success("Static Record Created Successfully!");

      if (!staticRes?._id) {
        toast.error("Static Record ID Missing!");
        return;
      }

      /* ================= CREATE ALL OFFENDERS ================= */
      const offenders = staticData.offenderPeople || [];

      for (const offender of offenders) {
        if (!offender?.details) continue;

        const d = offender.details;

        // 🚫 Skip empty offender blocks
        if (!d.name && !d.rank && !d.armyNumber && !d.address) {
          console.log("⏭️ Skipping empty offender");
          continue;
        }

        const offenderPayload: CreateOffenderData = {
          offenceId: staticRes._id,
          offenderType: offender.type as OffenderType, // 🔥 DYNAMIC

          offenderDetails: {
            type: offender.type === "Military Person" ? "Driver" : "Co-Driver",

            name: d.name || "",
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
          "👮 OFFENDER PAYLOAD SENT ===>",
          JSON.stringify(offenderPayload, null, 2)
        );

        await createOffenderMutation.mutateAsync(offenderPayload);
      }

      toast.success("All Offenders Created Successfully!");

      /* ================= CREATE WITNESSES ================= */
      if (staticData.witnesses?.length > 0) {
        const witnessPayload = staticData.witnesses.map((w) => ({
          offenceId: staticRes._id,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP || "",
          contactNumber: w.reportingBlock.contactNumber || "",
        }));

        console.log("👀 WITNESS PAYLOAD SENT ===>", witnessPayload);

        await Promise.all(
          witnessPayload.map((w) => createWitnessMutation.mutateAsync(w))
        );

        toast.success("Witnesses Added Successfully!");
      }

      toast.success("🎉 ALL STATIC SPEED PROCESSES COMPLETED!");

      /* ================= RESET FORM ================= */
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed",
        value: initialState.formData.staticSpeed,
      });

      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({
        type: "SET_PATH",
        path: "completedSteps",
        value: [],
      });
    } catch (error: any) {
      console.error(
        "❌ FINAL STATIC SPEED ERROR ===>",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to submit record"
      );
    }
  };

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
            onCreate={handleFinalSubmit}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data: StaticSpeedState) => {
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
            stepsConfig={stepsConfig}
            mode="static"
            mapTrafficToReport={mapStaticToReport}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
          />
        </div>
      </div>
    </div>
  );
}
