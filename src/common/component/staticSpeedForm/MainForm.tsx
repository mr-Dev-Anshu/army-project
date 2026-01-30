
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
import {
  useCreateStaticSpeedRecord,
  useUpdateStaticSpeedRecord,
} from "@/features/staticSpeed/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

import { useEffect } from "react";

export default function StaticSpeedForm({
  onCancel,
  existingReport,
}: {
  onCancel: () => void;
  existingReport?: any;
}) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staticData = state.formData.staticSpeed as any;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const updateStaticRecord = useUpdateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();
  console.log(existingReport);

  // Hydration Effect
  useEffect(() => {
    if (existingReport) {
      console.log("Hydrating Static Speed Form:", existingReport);
      const er = existingReport;

      // Deep copy initial structure
      const speedNodes = {
        ...initialState.formData.staticSpeed,
        offenderPeople: [],
      };

      speedNodes.reportNo = er.reportNo || er.reportId || "";

      // ✅ FIXED REMARK HYDRATION
      speedNodes.remarks =
        er.remark ||
        er.remarks ||
        er.customFields?.remarks ||
        "";

      // Vehicle
      speedNodes.vehicleDetails = {
        category: er.vehicleCategory || "",
        vehicleType: er.vehicleType || "",
        driverType: er.driverType || "",
        vehicleNumber: er.vehicleNumber || "",
        vehicleName: er.vehicleName || "",
      };

      // Duty Block
      speedNodes.dutyBlock = {
        dateOfDuty: er.onDutyDetails?.dateOfDuty
          ? new Date(er.onDutyDetails.dateOfDuty).toISOString().split("T")[0]
          : "",
        startTime: er.onDutyDetails?.startTime
          ? new Date(er.onDutyDetails.startTime).toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        endTime: er.onDutyDetails?.endTime
          ? new Date(er.onDutyDetails.endTime).toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        dutyLocation: er.onDutyDetails?.dutyLocation || "",
        dutyType: er.onDutyDetails?.dutyType || "",
      };

      // Reporting Block
      speedNodes.reportingBlock = {
        nameReportingMP: er.onDutyDetailsMPReporting?.nameReportingMP || "",
        rank: er.onDutyDetailsMPReporting?.rank || "",
        unit: er.onDutyDetailsMPReporting?.unit || "",
        armyNumber: er.onDutyDetailsMPReporting?.armyNumber || "",
        contactNumber: er.onDutyDetailsMPReporting?.contactNumber || "",
      };

      // Offence Block
      speedNodes.offenceBlock = {
        timeOfOffence: er.offenceOccurenceDetails?.timeOfOffence || "",
        time: er.offenceOccurenceDetails?.time || "",
        incidentLocation: er.offenceOccurenceDetails?.incidentLocation || "",
        description: er.offenceOccurenceDetails?.description || "",
        briefDescription: er.offenceOccurenceDetails?.briefDescription || "",
        description2: er.offenceOccurenceDetails?.description2 || "",
        actualSpeedNoted: er.offenceOccurenceDetails?.actualSpeedNoted || "",
        authSpeed: er.offenceOccurenceDetails?.authSpeed || "",
        overSpeedCalculated:
          er.offenceOccurenceDetails?.overSpeedCalculated || "",
      };

      // Witnesses
      if (Array.isArray(er.onDutyWitnessingMps)) {
        speedNodes.witnesses = er.onDutyWitnessingMps.map((w: any) => ({
          reportingBlock: {
            nameReportingMP: w.name || "",
            rank: w.rank || "",
            unit: w.unit || "",
            armyNumber: w.ArmyNo || w.armyNumber || "",
            contactNumber: w.contactNumber || "",
          },
        }));
      }

      // Offenders
      if (Array.isArray(er.offenders)) {
        speedNodes.offenderPeople = er.offenders.map((o: any) => {
          const d = o.offenderDetails || {};

          return {
            type: o.offenderType || "Civilian",
            whoIsIt: o.category || "Offender",
            details: {
              name: d.name || "",
              so: d.so || "",
              address: d.address || "",
              rank: d.rank || "",
              armyNumber: d.armyNumber || "",
              unit: d.unit || "",
              fmn: d.fmn || "",
              command: d.command || "",
              iCardNumber: d["I Card Number"] || d.iCardNumber || "",

              "Full Name": d.name || "",
              Address: d.address || "",
              "Father's / Husband's Name": d.so || "",
              "I Card Number": d["I Card Number"] || d.iCardNumber || "",
              "Army Rider / Driver Number": d.armyNumber || "",
              "Select Rank": d.rank || "",
              Unit: d.unit || "",
              FMN: d.fmn || "",
              Command: d.command || "",
            },
          };
        });
      }

      speedNodes.attachments = er.customFields?.attachments || [];

      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          ...initialState.formData,
          staticSpeed: speedNodes,
        },
      });
    }
  }, [existingReport, dispatch]);

  /* ================= FETCH REPORT NO ================= */

  const reportNo = staticData.reportNo || "TEMP/STATIC/001";

  const handleReportNoChange = (newReportNo: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.staticSpeed.reportNo",
      value: newReportNo,
    });
  };

  /* ================= UI ================= */

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={[
              { id: 1, label: "Particulars", icon: "1" },
              { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
              { id: 3, label: "Offence Committed/\nOrders Contravened", icon: "3" },
              { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
            ]}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New Static Speed Check Record"
            reportNo={reportNo}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            isSubmitting={isSubmitting}
            onReportNoChange={handleReportNoChange}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={{
              1: { title: "1. PARTICULARS:", component: <StaticSpeedStep1Particulars /> },
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
