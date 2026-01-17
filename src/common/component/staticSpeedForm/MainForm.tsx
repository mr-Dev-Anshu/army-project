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
import { useCreateStaticSpeedRecord, useGetStaticSpeedRecordById, useUpdateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";
import { useEffect } from "react";

export default function StaticSpeedForm({
  onCancel,
  recordId,
}: {
  onCancel: () => void;
  recordId?: string;
}) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staticData = state.formData.staticSpeed as any;

  const createStaticRecord = useCreateStaticSpeedRecord();
  const updateStaticRecord = useUpdateStaticSpeedRecord();
  const createOffenderMutation = useCreateOffender();
  const createWitnessMutation = useCreateOnDutyWitnessingMp();

  const { data: existingRecord, isLoading: isLoadingRecord } = useGetStaticSpeedRecordById(recordId || "");

  useEffect(() => {
    if (recordId && existingRecord) {
      // Map existing record to form state
      const mappedData = {
        ...initialState.formData,
        staticSpeed: {
          reportNo: existingRecord.reportId || existingRecord.reportNo,
          remarks: existingRecord.remark,
          vehicleInvolved: existingRecord.vehicleInvolved ? "yes" : "no",
          vehicleDetails: {
            category: existingRecord.vehicleCategory,
            vehicleType: existingRecord.vehicleType,
            driverType: "",
            vehicleNumber: existingRecord.vehicleNumber,
            vehicleName: existingRecord.vehicleName,
          },
          dutyBlock: {
            dateOfDuty: existingRecord.onDutyDetails?.dateOfDuty ? existingRecord.onDutyDetails.dateOfDuty.split("T")[0] : "",
            startTime: existingRecord.onDutyDetails?.startTime
              ? (existingRecord.onDutyDetails.startTime.includes("T")
                ? existingRecord.onDutyDetails.startTime.split("T")[1].substring(0, 5)
                : existingRecord.onDutyDetails.startTime.substring(0, 5))
              : "",
            endTime: existingRecord.onDutyDetails?.endTime
              ? (existingRecord.onDutyDetails.endTime.includes("T")
                ? existingRecord.onDutyDetails.endTime.split("T")[1].substring(0, 5)
                : existingRecord.onDutyDetails.endTime.substring(0, 5))
              : "",
            dutyLocation: existingRecord.onDutyDetails?.dutyLocation,
            dutyType: existingRecord.onDutyDetails?.dutyType,
          },
          reportingBlock: {
            nameReportingMP: existingRecord.onDutyDetailsMPReporting?.nameReportingMP,
            rank: existingRecord.onDutyDetailsMPReporting?.rank,
            unit: existingRecord.onDutyDetailsMPReporting?.unit,
            armyNumber: existingRecord.onDutyDetailsMPReporting?.armyNumber,
            contactNumber: existingRecord.onDutyDetailsMPReporting?.contactNumber,
          },
          offenceBlock: {
            timeOfOffence: existingRecord.offenceOccurenceDetails?.time,
            time: existingRecord.offenceOccurenceDetails?.time,
            incidentLocation: existingRecord.offenceOccurenceDetails?.incidentLocation,
            description: existingRecord.offenceOccurenceDetails?.description,
            briefDescription: existingRecord.offenceOccurenceDetails?.briefDescription,
            // description2 might be merged in description string, tough to separate
            authSpeed: existingRecord.offenceOccurenceDetails?.authSpeed,
            actualSpeedNoted: existingRecord.offenceOccurenceDetails?.actualSpeedNoted,
            overSpeedCalculated: existingRecord.offenceOccurenceDetails?.overSpeedCalculated,
          },
          // Mapping witnesses and offenders back 
          witnesses: (existingRecord.witnesses || []).map((w: any) => ({
            reportingBlock: {
              armyNumber: w.armyNumber || w.ArmyNo,
              rank: w.rank,
              nameReportingMP: w.name,
              unit: w.unit,
              contactNumber: w.contactNumber,
            }
          })),
          selectedWitness: existingRecord.customFields?.selectedWitness,
          offenderDetails: {},
          offenderPeople: (existingRecord.offenders || existingRecord.individuals || []).map((p: any) => ({
            whoIsIt: p.offenderDetails?.type || p.type || "Offender", // "Driver", "Co-Driver", etc.
            type: p.offenderType || "Military", // "Military", "Civilian"
            role: p.offenderDetails?.role || p.role,
            details: {
              armyNumber: p.armyNumber || p.offenderDetails?.armyNumber || p.offenderDetails?.armyNo,
              rank: p.rank || p.offenderDetails?.rank,
              name: p.name || p.offenderDetails?.name,
              unit: p.unit || p.offenderDetails?.unit,
              fmn: p.fmn || p.offenderDetails?.fmn,
              command: p.command || p.offenderDetails?.command,
              address: p.address || p.offenderDetails?.address,
              iCardNumber: p.iCardNumber || p.offenderDetails?.iCardNumber,
              ...p.customFields,
              ...p.offenderDetails,
            }
          })),
        }
      };
      dispatch({ type: "SET_FORM_DATA", payload: mappedData });
    }
  }, [recordId, existingRecord, dispatch]);

  /* ================= FETCH REPORT NO ================= */
  const reportNo = staticData.reportNo || "TEMP/STATIC/001";

  const handleReportNoChange = (newReportNo: string) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.staticSpeed.reportNo",
      value: newReportNo,
    });
  };

  // ... (existing mapStaticToReport code) ...

  const mapStaticToReport = (data: any) => {
    const riderDetails = data?.offenderPeople?.[0]?.details || {};

    const val = (v: any) => (v ? v : "");

    const rider = {
      armyNo: val(
        riderDetails["armyNumber"] || riderDetails["Army Rider / Driver Number"]
      ),
      name: val(riderDetails["name"] || riderDetails["Full Name"]),
      rank: val(riderDetails["rank"] || riderDetails["Select Rank"]),
      unit: val(riderDetails["unit"] || riderDetails["Unit"]),
      fmn: val(riderDetails["fmn"] || riderDetails["FMN"]),
      command: val(riderDetails["command"] || riderDetails["Command"]),
      address: val(riderDetails["address"] || riderDetails["Address"]),
      iCardNo: val(
        riderDetails["iCardNumber"] || riderDetails["ID Card Number"]
      ),
    };

    const witness =
      typeof data.selectedWitness === "number"
        ? data.witnesses?.[data.selectedWitness]
        : data.witnesses?.[0] || null;

    // Safety check for witness object structure
    // If selectedWitness is the object (new flow), use it directly
    let witReportBlock = data.selectedWitness?.nameReportingMP
      ? data.selectedWitness
      : witness?.reportingBlock || {};

    return {
      reportNo: data.reportNo || data.reportId,
      reportDate: new Date().toLocaleDateString("en-GB"),

      unitName: val(rider?.unit),

      /* -------- 1️⃣ PARTICULARS -------- */
      particulars: {
        rider: {
          armyNo: val(rider?.armyNo),
          name: val(rider?.name),
          fmn: val(rider?.fmn),
          address: val(rider?.address),
          rank: val(rider?.rank),
          unit: val(rider?.unit),
          command: val(rider?.command),
          iCardNo: val(rider?.iCardNo),
        },

        vehicle: {
          baNo: val(data?.vehicleDetails?.vehicleNumber),
          makeAndTake: val(data?.vehicleDetails?.vehicleName),
        },
      },

      /* -------- 2️⃣ OCCURRENCE -------- */
      occurrence: {
        dateOfDuty: val(data?.dutyBlock?.dateOfDuty),
        dutyTime:
          data?.dutyBlock?.startTime && data?.dutyBlock?.endTime
            ? `${data.dutyBlock.startTime} - ${data.dutyBlock.endTime}`
            : "",
        dutyLocation: val(data?.dutyBlock?.dutyLocation),
        nameOfWitnessingOfficial1: val(witReportBlock.nameReportingMP),
        rankOfWitnessingOfficial1: val(witReportBlock.rank),
        nameOfWitnessingOfficial2: "",
        rankOfWitnessingOfficial2: "",
        statement: val(data?.offenceBlock?.description),
      },

      /* -------- 3️⃣ OFFENCE -------- */
      offence: {
        actualSpeed: val(
          data?.offenceBlock?.actualSpeedNoted ||
          data?.offenceBlock?.actualSpeed
        ),
        authSpeed: val(data?.offenceBlock?.authSpeed),
        overSpeed: val(
          data?.offenceBlock?.overSpeedCalculated ||
          data?.offenceBlock?.overSpeed
        ),
      },

      /* -------- 4️ WITNESS SIGN -------- */
      witnessSig: {
        armyNo: val(witReportBlock.armyNumber || witReportBlock.ArmyNo),
        rank: val(witReportBlock.rank),
        name: val(witReportBlock.nameReportingMP),
        unit: val(witReportBlock.unit),
      },

      /* -------- MP SIGN -------- */
      mpSig: {
        armyNo: val(data?.reportingBlock?.armyNumber),
        rank: val(data?.reportingBlock?.rank),
        name: val(data?.reportingBlock?.nameReportingMP),
        unit: val(data?.reportingBlock?.unit),
      },

      /* -------- REMARKS -------- */
      remarks: {
        text: val(data?.remarks),
        station: val(data?.dutyBlock?.dutyLocation),
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
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
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
          briefDescription: staticData.offenceBlock?.briefDescription || "",
          offenceTypes: staticData.offenceBlock?.offenceTypes ?? [],
          offenceTypeReference:
            staticData.offenceBlock?.offenceTypeReference ?? [],
        },

        // ✅ ADDED REMARK
        remark: staticData.remarks,
        customFields: {
          selectedWitness: staticData.selectedWitness,
        },
      };

      console.log("🚗 STATIC SPEED PAYLOAD ===>", payload);

      /* ================= CREATE / UPDATE STATIC RECORD ================= */
      let staticRes;
      if (recordId) {
        await updateStaticRecord.mutateAsync({ id: recordId, data: payload });
        staticRes = { _id: recordId };
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
      dispatch({ type: "SET_PREVIEW", payload: false });
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
            title={recordId ? "Edit Static Speed Check Record" : "Create New Static Speed Check Record"}
            reportNo={reportNo}
            onCreate={handleFinalSubmit}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            isSubmitting={isSubmitting} // Passed prop
            onReportNoChange={handleReportNoChange}
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
