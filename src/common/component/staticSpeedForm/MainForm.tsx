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
import { updateOnDutyWitnessingMp } from "@/apis";

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

  const pickDefined = <T extends Record<string, any>>(obj: T): T =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== ""),
    ) as T;

  /* ================= FINAL SUBMIT ================= */

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const { contactNumber, ...mpReportingSafe } =
      staticData.reportingBlock || {};

    try {
      /* ================= STATIC PAYLOAD ================= */
      const payload = pickDefined({
        reportId: reportNo,
        vehicleType: staticData.vehicleDetails.vehicleType,
        vehicleCategory: staticData.vehicleDetails.category,
        vehicleNumber: staticData.vehicleDetails.vehicleNumber,
        vehicleName: staticData.vehicleDetails.vehicleName,

        onDutyDetails: pickDefined({
          dateOfDuty: staticData.dutyBlock?.dateOfDuty,
          dutyLocation: staticData.dutyBlock?.dutyLocation,
          dutyType: staticData.dutyBlock?.dutyType,
          startTime: staticData.dutyBlock?.startTime
            ? new Date(
                `${staticData.dutyBlock.dateOfDuty}T${staticData.dutyBlock.startTime}`,
              ).toISOString()
            : undefined,
          endTime: staticData.dutyBlock?.endTime
            ? new Date(
                `${staticData.dutyBlock.dateOfDuty}T${staticData.dutyBlock.endTime}`,
              ).toISOString()
            : undefined,
        }),

        onDutyDetailsMPReporting: pickDefined(mpReportingSafe),

        offenceOccurenceDetails: pickDefined({
          time: staticData.offenceBlock?.time,
          incidentLocation: staticData.offenceBlock?.incidentLocation,
          description: [
            staticData.offenceBlock?.description,
            staticData.offenceBlock?.description2,
          ]
            .filter(Boolean)
            .join("\n\n"),
          overSpeedCalculated: staticData.offenceBlock?.overSpeedCalculated,
          actualSpeedNoted: staticData.offenceBlock?.actualSpeedNoted,
          authSpeed: staticData.offenceBlock?.authSpeed,
          briefDescription: staticData.offenceBlock?.briefDescription,
        }),

        remark: staticData.remarks,
      });

      let recordRes;

      if (existingReport?._id) {
        recordRes = await updateStaticRecord.mutateAsync({
          id: existingReport._id,
          data: payload,
        });
        toast.success("Static Record Updated Successfully!");
      } else {
        recordRes = await createStaticRecord.mutateAsync(payload);
        toast.success("Static Record Created Successfully!");
      }

      const offenceId = recordRes?._id || existingReport?._id;
      if (!offenceId) throw new Error("Offence ID missing");

      for (const person of staticData.offenderPeople || []) {
        const details = person.details || {};

        const hasData =
          details.name ||
          details.armyNumber ||
          details.iCardNumber ||
          details.address;

        if (!hasData) continue;

        await createOffenderMutation.mutateAsync({
          offenceId,
          offenderType: person.type,
          offenderDetails: {
            ...details,
            type: person.whoIsIt || "Offender",
          },
        });
      }

      /* ================= WITNESSES ================= */
      for (const w of staticData.witnesses || []) {
        const witnessPayload = pickDefined({
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP,
          contactNumber: w.reportingBlock.contactNumber,
        });

        if (w.id) {
          await updateOnDutyWitnessingMp(w.id, witnessPayload);
        } else {
          await createWitnessMutation.mutateAsync({
            offenceId,
            ...witnessPayload,
          });
        }
      }

      /* ================= RESET ================= */
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed",
        value: initialState.formData.staticSpeed,
      });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
      dispatch({ type: "SET_PREVIEW", payload: false });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit record",
      );
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

    /* 🔥 OFFENDER DEDUP (LATEST ONLY) */
    if (Array.isArray(er.offenders)) {
      const map = new Map<string, any>();

      er.offenders.forEach((o: any) => {
        map.set(o.offenderType, {
          type: o.offenderType,
          whoIsIt: o.category || "Offender",
          details: { ...o.offenderDetails },
        });
      });

      speedNodes.offenderPeople = Array.from(map.values());
    }

    if (
      Array.isArray(er.onDutyWitnessingMps) &&
      er.onDutyWitnessingMps.length > 0
    ) {
      const latestWitness =
        er.onDutyWitnessingMps[er.onDutyWitnessingMps.length - 1];

      speedNodes.witnesses = [
        {
          reportingBlock: {
            nameReportingMP: latestWitness.name || "",
            rank: latestWitness.rank || "",
            unit: latestWitness.unit || "",
            armyNumber: latestWitness.armyNumber || latestWitness.ArmyNo || "",
            contactNumber: latestWitness.contactNumber || "",
          },
        },
      ];
    } else {
      speedNodes.witnesses = [];
    }

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

  /* 🔥 WITNESS MERGE LOGIC */
  const witnessesArray = Array.isArray(staticSpeed.witnesses)
    ? staticSpeed.witnesses
    : [];

  const witnessMap = new Map<string, any>();

  witnessesArray.forEach((w: any) => {
    const key =
      w?.reportingBlock?.armyNumber ||
      w?.reportingBlock?.ArmyNo ||
      crypto.randomUUID();

    witnessMap.set(key, w); // overwrite if same armyNo
  });

  const mergedWitnesses = Array.from(witnessMap.values());
  const firstWitness = mergedWitnesses[0] || null;

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
          (occ.time ? new Date(occ.time).toISOString().slice(11, 16) : "")
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
