"use client";
import React, { useEffect, useState } from "react";

import { initialState, useForm } from "@/context/FormContext";
import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";
import Step4Remarks from "../multi-step-form/steps/Step4Remarks";

import StaticSpeedStep1Particulars from "./steps/Step1";
import Step2Statement from "./steps/step2";
import Step3Offence from "./steps/step3";
import { toast } from "react-toastify";

import {
  useCreateStaticSpeedRecord,
  useUpdateStaticSpeedRecord,
} from "@/features/staticSpeed/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { updateOffender, updateOnDutyWitnessingMp } from "@/apis";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";
import { useCreateDocument } from "@/features/certificateAndForm/hook";

/* ================= VALUE MAPPERS ================= */

const mapVehicleCategory = (v?: string) => {
  if (v === "2w") return "2-Wheeler";
  if (v === "4w") return "4-Wheeler";
  return v || "";
};

const mapVehicleType = (v?: string) => {
  if (v === "civilian") return "Civilian Vehicle";
  if (v === "dd") return "DD Vehicle";
  return v || "";
};

interface StaticSpeedFormProps {
  existingReport?: any;
  onCancel?: () => void;
}

export default function StaticSpeedForm({
  existingReport,
  onCancel,
}: StaticSpeedFormProps) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(existingReport);

  const staticData = state.formData.staticSpeed as any;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const updateStaticRecord = useUpdateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();
  const createDocumentMutation = useCreateDocument();
  const [attachments, setAttachments] = useState<any[]>([]);

  const pickDefined = (obj: any) =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== ""),
    );

/* ================= FINAL SUBMIT ================= */
const handleFinalSubmit = async () => {
  setIsSubmitting(true);
  console.log("🔥 ATTACHMENTS STATE BEFORE SUBMIT ===>", attachments);

  const { contactNumber, ...mpReportingSafe } =
    staticData.reportingBlock || {};

  try {
    /* ================= STATIC SPEED PAYLOAD ================= */
    const payload = {
      reportId: reportNo,
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
        briefDescription: staticData.offenceBlock?.briefDescription || "",
        offenceTypes: staticData.offenceBlock?.offenceTypes ?? [],
        offenceTypeReference:
          staticData.offenceBlock?.offenceTypeReference ?? [],
      },

      remark: staticData.remarks,
    };

    console.log("🚗 STATIC SPEED PAYLOAD ===>", payload);

    /* ================= CREATE / UPDATE STATIC RECORD ================= */
    let staticRes;

    if (existingReport && existingReport._id) {
      staticRes = await updateStaticRecord.mutateAsync({
        id: existingReport._id,
        data: payload,
      });
      toast.success("Static Record Updated Successfully!");
    } else {
      staticRes = await createStaticRecord.mutateAsync(payload);
      toast.success("Static Record Created Successfully!");
    }

    console.log("✅ STATIC SPEED BACKEND RESPONSE ===>", staticRes);

    if (!staticRes?._id) {
      toast.error("Static Record ID Missing!");
      return;
    }

    const offenceId = String(staticRes._id);

    /* ================= SAVE ATTACHMENTS (USE HOOK) ================= */
    if (attachments?.length) {
      try {
        console.log("📎 SAVING ATTACHMENTS ===>", attachments);

        await Promise.all(
          attachments.map((file: any) =>
            createDocumentMutation.mutateAsync({
              name: file.name,
              url: file.url,
              type: file.type.toLowerCase(), // certificate | form | letter
            })
          )
        );

        toast.success("Attachments saved");
      } catch (err) {
        console.error("❌ Attachment Save Error:", err);
        toast.error("Attachment save failed");
      }
    }

    /* ================= CREATE OFFENDERS ================= */
    const people = staticData.offenderPeople || [];

    for (const person of people) {
      const details = person.details || {};
      if (!Object.keys(details).length) continue;

      const offenderPayload: CreateOffenderData = {
        offenceId,
        offenderType: person.type as OffenderType,
        offenderDetails: {
          ...details,
          type: person.whoIsIt || "Offender",
        },
      };

      try {
        await createOffenderMutation.mutateAsync(offenderPayload);
      } catch (err: any) {
        console.error("❌ Offender Creation Failed:", err);
        toast.error("One offender failed to save");
      }
    }

    toast.success("Offenders Saved!");

    /* ================= CREATE WITNESS ================= */
    if (staticData.witnesses?.length > 0) {
      const witnessPayload = staticData.witnesses.map((w: any) => ({
        offenceId,
        rank: w.reportingBlock.rank,
        unit: w.reportingBlock.unit,
        ArmyNo: w.reportingBlock.armyNumber,
        name: w.reportingBlock.nameReportingMP || "",
        contactNumber: w.reportingBlock.contactNumber || "",
      }));

      try {
        await Promise.all(
          witnessPayload.map((w: any) =>
            createWitnessMutation.mutateAsync(w)
          )
        );

        toast.success("Witness Added Successfully!");
      } catch (err: any) {
        console.error("❌ Witness Error:", err);
        throw err;
      }
    }

    toast.success("🎉 ALL STATIC SPEED PROCESSES COMPLETED!");

    /* ================= RESET ================= */
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

    dispatch({ type: "SET_PREVIEW", payload: false });
  } catch (error: any) {
    console.error("❌ FINAL STATIC SPEED ERROR ===>", error);

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

  /* ================= HYDRATION (DEDUP + LATEST) ================= */

  useEffect(() => {
    if (!existingReport) return;

    const er = existingReport;
    const speedNodes = { ...initialState.formData.staticSpeed };

    speedNodes.reportNo = er.reportId || "";
    speedNodes.remarks =
      er.remark || er.remarks || er.customFields?.remarks || "";

    speedNodes.vehicleDetails = {
      category: mapVehicleCategory(er.vehicleCategory),
      vehicleType: mapVehicleType(er.vehicleType),
      driverType: er.driverType || "",
      vehicleNumber: er.vehicleNumber || "",
      vehicleName: er.vehicleName || "",
    };

    speedNodes.dutyBlock = {
      dateOfDuty: er.onDutyDetails?.dateOfDuty
        ? new Date(er.onDutyDetails.dateOfDuty).toISOString().split("T")[0]
        : "",
      startTime: er.onDutyDetails?.startTime
        ? new Date(er.onDutyDetails.startTime).toISOString().slice(11, 16)
        : "",
      endTime: er.onDutyDetails?.endTime
        ? new Date(er.onDutyDetails.endTime).toISOString().slice(11, 16)
        : "",
      dutyLocation: er.onDutyDetails?.dutyLocation || "",
      dutyType: er.onDutyDetails?.dutyType || "",
    };

    speedNodes.reportingBlock = {
      nameReportingMP: er.onDutyDetailsMPReporting?.nameReportingMP || "",
      rank: er.onDutyDetailsMPReporting?.rank || "",
      unit: er.onDutyDetailsMPReporting?.unit || "",
      armyNumber: er.onDutyDetailsMPReporting?.armyNumber || "",
      contactNumber: er.onDutyDetailsMPReporting?.contactNumber || "",
    };

    const occ = er.offenceOccurenceDetails || {};
    speedNodes.offenceBlock = {
      time: occ.time || "",
      timeOfOffence: occ.time
        ? new Date(occ.time).toISOString().slice(11, 16)
        : "",
      incidentLocation: occ.incidentLocation || "",
      description: occ.description || "",
      briefDescription: occ.briefDescription || "",
      actualSpeedNoted: occ.actualSpeedNoted || "",
      authSpeed: occ.authSpeed || "",
      overSpeedCalculated: occ.overSpeedCalculated || "",
    };

    /* 🔥 OFFENDER HYDRATION FIX */
    if (Array.isArray(er.offenders) && er.offenders.length > 0) {
      speedNodes.offenderPeople = er.offenders.map((o: any) => ({
        id: o._id,
        type: o.offenderType || "Civilian",
        whoIsIt: o.offenderDetails?.type || "Offender",
        details: {
          ...o.offenderDetails,
        },
      }));
    } else {
      speedNodes.offenderPeople = [];
    }

    speedNodes.witnesses = Array.isArray(er.onDutyWitnessingMps)
      ? er.onDutyWitnessingMps.map((w: any) => ({
          reportingBlock: {
            nameReportingMP: w.name || "",
            rank: w.rank || "",
            unit: w.unit || "",
            armyNumber: w.armyNumber || w.ArmyNo || "",
            contactNumber: w.contactNumber || "",
          },
        }))
      : [];

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...initialState.formData,
        staticSpeed: speedNodes,
      },
    });
  }, [existingReport]);

  const reportNo = staticData.reportNo || "TEMP/STATIC/001";

  const mapStaticSpeedToReport = (staticSpeed: any) => {
    if (!staticSpeed) return null;

    const duty = staticSpeed?.dutyBlock || {};
    const occ = staticSpeed?.offenceBlock || {};
    const mp = staticSpeed?.reportingBlock || {};
    const v = staticSpeed?.vehicleDetails || {};

    const val = (v: any) => (v && v !== "Nil" ? v : "");

    const firstPerson = Array.isArray(staticSpeed.offenderPeople)
      ? staticSpeed.offenderPeople[0]
      : null;

    const firstWitness = Array.isArray(staticSpeed.witnesses)
      ? staticSpeed.witnesses[0]
      : null;

    return {
      reportNo: staticSpeed.reportNo,
      reportDate: new Date().toLocaleDateString("en-GB"),

      particulars: {
        rider: {
          armyNo: val(firstPerson?.details?.armyNumber),
          rank: val(firstPerson?.details?.rank),
          name: val(firstPerson?.details?.name),
          unit: val(firstPerson?.details?.unit),
          address: val(firstPerson?.details?.address),
          iCardNo: val(firstPerson?.details?.iCardNumber),
        },
        vehicle: {
          baNo: val(v.vehicleNumber),
          makeAndTake: val(v.vehicleName),
        },
      },

      occurrence: {
        dateOfDuty: duty.dateOfDuty,
        dutyLocation: val(duty.dutyLocation),
        timeOfOffence: val(
          occ.timeOfOffence ||
            (occ.time ? new Date(occ.time).toISOString().slice(11, 16) : ""),
        ),
        locationOfOffence: val(occ.incidentLocation),
        statement: val(occ.description),
      },

      offence: {
        actualSpeed: val(occ.actualSpeedNoted),
        authSpeed: val(occ.authSpeed),
        overSpeed: val(occ.overSpeedCalculated),
        description: val(occ.description),
      },

      witnessSig: {
        armyNo: val(firstWitness?.reportingBlock?.armyNumber),
        rank: val(firstWitness?.reportingBlock?.rank),
        name: val(firstWitness?.reportingBlock?.nameReportingMP),
        unit: val(firstWitness?.reportingBlock?.unit),
      },

      mpSig: {
        armyNo: val(mp.armyNumber),
        rank: val(mp.rank),
        name: val(mp.nameReportingMP),
        unit: val(mp.unit),
      },

      remarks: {
        text: val(staticSpeed.remarks),
        station: val(duty.dutyLocation),
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={[
              { id: 1, label: "Particulars", icon: "1" },
              { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
              {
                id: 3,
                label: "Offence Committed/\nOrders Contravened",
                icon: "3",
              },
              { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
            ]}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New Static Speed Check Record"
            reportNo={reportNo}
            onCreate={handleFinalSubmit}
            onCancel={onCancel}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            isSubmitting={isSubmitting}
            onAttach={(items) => setAttachments(items)}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            mapReport={mapStaticSpeedToReport}
            stepsConfig={{
              1: {
                title: "1. PARTICULARS:",
                component: <StaticSpeedStep1Particulars />,
              },
              2: { title: "2. STATEMENT:", component: <Step2Statement /> },
              3: { title: "3. OFFENCE:", component: <Step3Offence /> },
              4: {
                title: "4. REMARKS:",
                component: (
                  <Step4Remarks
                    value={state.formData.staticSpeed.remarks || ""}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_PATH",
                        path: "formData.staticSpeed.remarks",
                        value: v,
                      })
                    }
                  />
                ),
              },
            }}
            mode="static"
          />
        </div>
      </div>
    </div>
  );
}
