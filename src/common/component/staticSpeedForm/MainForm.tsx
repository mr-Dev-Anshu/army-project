"use client";
import React, { useState } from "react";

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

export default function StaticSpeedForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staticData = state.formData.staticSpeed as any;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();

  // ... (existing mapStaticToReport code) ...

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
    setIsSubmitting(true);
    const { contactNumber, ...mpReportingSafe } =
      staticData.reportingBlock || {};
    try {
      /* ================= STATIC SPEED PAYLOAD ================= */
      const payload = {
        vehicleType: staticData.vehicleDetails.vehicleType,
        vehicleCategory: staticData.vehicleDetails.category,
        vehicleNumber: staticData.vehicleDetails.vehicleNumber,
        vehicleName: staticData.vehicleDetails.vehicleName,

        onDutyDetails: {
          dateOfDuty: staticData.dutyBlock?.dateOfDuty || undefined,
          dutyLocation: staticData.dutyBlock?.dutyLocation || undefined,
          dutyType: staticData.dutyBlock?.dutyType || undefined,
          startTime: staticData.dutyBlock?.startTime
            ? new Date(
              `${staticData.dutyBlock.dateOfDuty}T${staticData.dutyBlock.startTime}`
            ).toISOString()
            : undefined,
          endTime: staticData.dutyBlock?.endTime
            ? new Date(
              `${staticData.dutyBlock.dateOfDuty}T${staticData.dutyBlock.endTime}`
            ).toISOString()
            : undefined,
        },

        // 🔥 FIXED HERE
        onDutyDetailsMPReporting: mpReportingSafe,

        offenceOccurenceDetails: {
          time: staticData.offenceBlock?.time || undefined,
          incidentLocation: staticData.offenceBlock?.incidentLocation || "",
          description: [
            staticData.offenceBlock?.description,
            staticData.offenceBlock?.description2,
            staticData.offenceOccurenceDetails?.description,
          ]
            .filter(Boolean)
            .join("\n\n"),
          overSpeedCalculated:
            staticData.offenceBlock?.overSpeedCalculated ?? "",
          actualSpeedNoted: staticData.offenceBlock?.actualSpeedNoted ?? "",
          authSpeed: staticData.offenceBlock?.authSpeed ?? "",

          // New fields
          offenceTypes: staticData.offenceOccurenceDetails?.offenceTypes ?? [],
          offenceTypeReference: staticData.offenceOccurenceDetails?.offenceTypeReference ?? [],
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

      /* ================= CREATE OFFENDER ================= */
      // Checking ID validity
      const _idString = staticRes?._id ? String(staticRes._id) : "";
      console.log("🆔 Static Res ID:", _idString);

      if (!_idString) {
        console.error("❌ CRTICAL: No Static Record ID returned");
        toast.error("Error: Record ID missing. Offenders cannot be linked.");
        return;
      }
      /* ================= CREATE OFFENDERS (ONE BY ONE) ================= */

      /* ================= CREATE OFFENDERS (ONE BY ONE) ================= */

      const people = staticData.offenderPeople || [];
      console.log("👥 Offender People Array:", JSON.stringify(people, null, 2));

      for (const person of people) {
        const details = person.details || {};

        // 🔥 skip only when absolutely empty
        if (!Object.keys(details).length) {
          console.warn("⚠️ Skipping empty offender:", person);
          continue;
        }

        const offenderPayload: CreateOffenderData = {
          offenceId: _idString,
          offenderType: person.type as OffenderType,

          offenderDetails: {
            // 🔥🔥🔥 KEY FIX
            ...details,

            // role = Driver / Co-Driver / Offender
            type: person.whoIsIt || "Offender",
          },
        };

        console.log(
          "👮 Creating Offender Payload ===>",
          JSON.stringify(offenderPayload, null, 2)
        );

        try {
          await createOffenderMutation.mutateAsync(offenderPayload);
        } catch (err: any) {
          console.error(
            "❌ Offender Creation Failed ===>",
            err?.response?.data || err
          );
          toast.error("One offender failed to save");
        }
      }

      toast.success("✅ All offenders created successfully");

      // 2.2 Co-Driver
      const coDriverType = state.formData.coDriverType;
      const coDriverOrPillion = state.formData.coDriverOrPillion;
      console.log("🏍️ Co-Driver Logic:", { coDriverOrPillion, coDriverType });

      if (coDriverOrPillion && coDriverType && coDriverType !== "") {
        // Find by ROLE "CoDriver"
        const coDriverEntry = people.find((p: any) => p.role === "CoDriver");
        console.log("👤 Co-Driver Entry Found:", coDriverEntry);

        const coDriverDetails = {
          ...(coDriverEntry?.details || {}),
          type: "CoDriver",
        };

        const coDriverPayload: CreateOffenderData = {
          offenceId: _idString,
          offenderType: coDriverType as OffenderType,
          offenderDetails: coDriverDetails,
        };
        console.log(
          "👮 REQ CO-DRIVER PAYLOAD:",
          JSON.stringify(coDriverPayload, null, 2)
        );

        try {
          const res = await createOffenderMutation.mutateAsync(coDriverPayload);
          console.log("✅ Co-Driver Created:", res);
        } catch (e: any) {
          console.error("❌ Co-Driver Creation Failed:", e);
          toast.error(`Co-Driver Creation Failed: ${e?.message}`);
        }
      }

      toast.success("Offenders Saved!");

      /* ================= CREATE WITNESS ================= */
      if (staticData.witnesses?.length > 0) {
        const witnessPayload = staticData.witnesses.map((w: any) => ({
          offenceId: staticRes._id,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP || "",
          contactNumber: w.reportingBlock.contactNumber || "",
        }));

        console.log("👀 WITNESS PAYLOAD SENT ===>", witnessPayload);

        try {
          const witnessResponses = await Promise.all(
            witnessPayload.map((w: any) => createWitnessMutation.mutateAsync(w))
          );

          console.log("✅ WITNESS BACKEND RESPONSES ===>", witnessResponses);

          toast.success("Witness Added Successfully!");
        } catch (err: any) {
          console.error(
            "❌ WITNESS BACKEND ERROR ===>",
            err?.response?.data || err
          );
          throw err;
        }
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

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit record";

      toast.error(msg);
    } finally {
      setIsSubmitting(false);
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
            isSubmitting={isSubmitting} // Passed prop
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={stepsConfig}
            mode="static"
            mapReport={mapStaticToReport}
          />
        </div>
      </div>
    </div>
  );
}
