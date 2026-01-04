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

  /* ================= STEPS ================= */
  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence / Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed / Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO / 2IC Provost Unit", icon: "4" },
  ];

  /* ================= PREVIEW MAPPER (NO LOGIC) ================= */
  const mapTrafficToReport = (traffic: any) => {
    const occ = traffic?.offenceOccurenceDetails || {};
    const duty = traffic?.onDutyDetails || {};

    return {
      reportNo: "TEMP/REPORT/001",
      reportDate: new Date().toLocaleDateString("en-GB"),

      occurrence: {
        dateOfDuty: duty?.dateOfDuty || "N/A",
        dutyLocation: duty?.dutyLocation || "N/A",
        timeOfOffence: occ?.timeOfOffence || "N/A",
        locationOfOffence: occ?.incidentLocation || "N/A",
        statement: occ?.description || "N/A",
      },

      remarks: {
        text:
          traffic?.remarks ||
          "Suitable disciplinary action may be taken and intimated.",
        station: duty?.dutyLocation || "N/A",
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  /* ================= FINAL SUBMIT ================= */
  const onSubmitFinal = async () => {
    try {
      const traffic = state.formData.traffic;
      console.log("🚔 RAW TRAFFIC ===>", traffic);

      /* ---------- CREATE OFFENCE ---------- */
      const offenceRes = await createOffence({
        isVehicleInvolved: traffic.vehicleInvolved === "yes",
        onDutyDetails: traffic.onDutyDetails,
        onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,
        offenceOccurenceDetails: traffic.offenceOccurenceDetails,
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

      console.log("✅ OFFENCE CREATED:", offenceId);

      /* ---------- CREATE OFFENDERS ---------- */
      const offenders = Array.isArray(traffic.offenderPeople)
        ? traffic.offenderPeople
        : [];

      console.log("👥 FINAL OFFENDERS ===>", offenders);

      for (const o of offenders) {
        const d = o.details || {};

        const hasData =
          d.name ||
          d.Name ||
          d.address ||
          d.Address ||
          d.armyNumber ||
          d["Army Rider / Driver Number"];

        if (!hasData) {
          console.log("⏭️ Skipping empty offender");
          continue;
        }

        const payload: CreateOffenderData = {
          offenceId,
          offenderType: (o.type ||
            traffic.vehicleDetails?.driverType ||
            "Civilian") as OffenderType,

          offenderDetails: {
            type: o.role || o.whoIsIt || "Offender",
            name: d.name || d.Name || "",
            rank: d.rank || d.Rank || "",
            armyNumber:
              d.armyNumber || d["Army Rider / Driver Number"] || "",
            unit: d.unit || d.Unit || "",
            command: d.command || d.Command || "",
            fmn: d.fmn || d.FMN || "",
            address: d.address || d.Address || "",
            iCardNumber:
              d.iCardNumber ||
              d["ID Card Number"] ||
              d["I Card Number"] ||
              "",
          },
        };

        console.log("👮 CREATING OFFENDER ===>", payload);
        await createOffender(payload);
      }

      toast.success("All Offenders Saved");

      /* ---------- CREATE WITNESSES ---------- */
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
        toast.success("Witnesses Added");
      }

      toast.success("🎉 TRAFFIC REPORT COMPLETED");

      /* ---------- RESET ---------- */
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
    } catch (err) {
      console.error("❌ FINAL SUBMIT ERROR ===>", err);
      toast.error("Submit failed");
    }
  };

  /* ================= STEP CONFIG ================= */
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
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New General & Traffic Offence Record"
            reportNo="PRO/21 CPU/00042/106/25"
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
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mapTrafficToReport={mapTrafficToReport}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
