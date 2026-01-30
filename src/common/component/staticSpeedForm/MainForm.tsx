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
import { useCreateStaticSpeedRecord, useUpdateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
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

  // Hydration Effect
  useEffect(() => {
    if (existingReport) {
      console.log("Hydrating Static Speed Form:", existingReport);
      const er = existingReport;

      // Deep copy initial structure
      const speedNodes = { ...initialState.formData.staticSpeed };

      speedNodes.reportNo = er.reportNo || er.reportId || "";
      speedNodes.remarks = er.remarks || ""; // or customFields.remarks

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
        dateOfDuty: er.onDutyDetails?.dateOfDuty ? new Date(er.onDutyDetails.dateOfDuty).toISOString().split('T')[0] : "",
        startTime: er.onDutyDetails?.startTime ? new Date(er.onDutyDetails.startTime).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) : "",
        endTime: er.onDutyDetails?.endTime ? new Date(er.onDutyDetails.endTime).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) : "",
        dutyLocation: er.onDutyDetails?.dutyLocation || "",
        dutyType: er.onDutyDetails?.dutyType || "",
      };

      // Reporting Block (MP)
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
        overSpeedCalculated: er.offenceOccurenceDetails?.overSpeedCalculated || "",
      };

      // Witnesses (Array)
      if (Array.isArray(er.witnesses)) {
        speedNodes.witnesses = er.witnesses.map((w: any) => ({
          reportingBlock: {
            nameReportingMP: w.name || w.nameReportingMP || "",
            rank: w.rank || "",
            unit: w.unit || "",
            armyNumber: w.armyNumber || w.ArmyNo || "",
            contactNumber: w.contactNumber || "",
          }
        }));
      }

      // Offender People (Array) - TODO: Map correctly from backend offenders structure
      if (Array.isArray(er.offenders)) {
        // speedNodes.offenderPeople = er.offenders... 
      }

      // Hydrate attachments
      // Ensure we preserve the type if coming from backend
      speedNodes.attachments = er.customFields?.attachments || [];

      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          ...initialState.formData,
          staticSpeed: speedNodes
        }
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
          attachments: staticData.attachments || [], // Ensure attachments are saved with type key if present
        },
      };

      console.log("🚗 STATIC SPEED PAYLOAD ===>", payload);

      /* ================= CREATE / UPDATE STATIC RECORD ================= */
      let staticRes;
      if (existingReport && existingReport._id) {
        // UPDATE MODE
        console.log("📝 UPDATING Static Record:", existingReport._id);
        staticRes = await updateStaticRecord.mutateAsync({
          id: existingReport._id,
          data: payload
        });
        toast.success("Static Record Updated Successfully!");
      } else {
        // CREATE MODE
        console.log("🆕 CREATING Static Record");
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
            title="Create New Static Speed Check Record"
            reportNo={reportNo}
            onCreate={handleFinalSubmit}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            isSubmitting={isSubmitting} // Passed prop
            onReportNoChange={handleReportNoChange}
            onAttach={(items) => {
              const current = state.formData.staticSpeed.attachments || [];
              dispatch({
                type: "SET_PATH",
                path: "formData.staticSpeed.attachments",
                value: [...current, ...items],
              });
            }}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={{
              ...stepsConfig,
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
                    attachments={state.formData.staticSpeed?.attachments || []}
                    onAttachmentsChange={(items) =>
                      dispatch({
                        type: "SET_PATH",
                        path: "formData.staticSpeed.attachments",
                        value: items
                      })
                    }
                  />
                ),
              },
            }}
            mode="static"
            mapReport={mapStaticToReport}
          />
        </div>
      </div>
    </div>
  );
}
