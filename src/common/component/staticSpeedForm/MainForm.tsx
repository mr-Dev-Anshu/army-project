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

export default function StaticSpeedForm() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed/\nOrders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  const stepsConfig = {
    1: {
      title: "1. PARTICULARS:",
      component: <StaticSpeedStep1Particulars />,
    },

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

      // ========= 1️⃣ STATIC SPEED RECORD =========
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

      // ========= 3️⃣ WITNESSES =========
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
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={handleFinalSubmit}
            stepsConfig={stepsConfig}
            mode="static"
          />
        </div>
      </div>
    </div>
  );
}
