// "use client";
// import React, { useState } from "react";

// import { initialState, useForm } from "@/context/FormContext";
// import { LeftStepper } from "../multi-step-form/LeftStepper";
// import { RightPanel } from "../multi-step-form/RightPanel";
// import Step4Remarks from "../multi-step-form/steps/Step4Remarks";

// import StaticSpeedStep1Particulars from "./steps/Step1";
// import Step2Statement from "./steps/step2";
// import Step3Offence from "./steps/step3";
// import { toast } from "react-toastify";
// import {
//   useCreateStaticSpeedRecord,
//   useUpdateStaticSpeedRecord,
// } from "@/features/staticSpeed/hooks";
// import { useCreateOffender } from "@/features/offender/Hooks";
// import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
// import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

// import { useEffect } from "react";

// export default function StaticSpeedForm({
//   onCancel,
//   existingReport,
// }: {
//   onCancel: () => void;
//   existingReport?: any;
// }) {
//   const { state, dispatch } = useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const staticData = state.formData.staticSpeed as any;

//   const createStaticRecord = useCreateStaticSpeedRecord();
//   const updateStaticRecord = useUpdateStaticSpeedRecord();
//   const createOffenderMutation = useCreateOffender();
//   const createWitnessMutation = useCreateOnDutyWitnessingMp();
//   console.log(existingReport);

//   // Hydration Effect
//   useEffect(() => {
//     if (existingReport) {
//       console.log("Hydrating Static Speed Form:", existingReport);
//       const er = existingReport;

//       // Deep copy initial structure
//       const speedNodes = {
//         ...initialState.formData.staticSpeed,
//         offenderPeople: [],
//       };

//       speedNodes.reportNo = er.reportNo || er.reportId || "";

//       // ✅ FIXED REMARK HYDRATION
//       speedNodes.remarks =
//         er.remark ||
//         er.remarks ||
//         er.customFields?.remarks ||
//         "";

//       // Vehicle
//       speedNodes.vehicleDetails = {
//         category: er.vehicleCategory || "",
//         vehicleType: er.vehicleType || "",
//         driverType: er.driverType || "",
//         vehicleNumber: er.vehicleNumber || "",
//         vehicleName: er.vehicleName || "",
//       };

//       // Duty Block
//       speedNodes.dutyBlock = {
//         dateOfDuty: er.onDutyDetails?.dateOfDuty
//           ? new Date(er.onDutyDetails.dateOfDuty).toISOString().split("T")[0]
//           : "",
//         startTime: er.onDutyDetails?.startTime
//           ? new Date(er.onDutyDetails.startTime).toLocaleTimeString("en-GB", {
//               hour12: false,
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "",
//         endTime: er.onDutyDetails?.endTime
//           ? new Date(er.onDutyDetails.endTime).toLocaleTimeString("en-GB", {
//               hour12: false,
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "",
//         dutyLocation: er.onDutyDetails?.dutyLocation || "",
//         dutyType: er.onDutyDetails?.dutyType || "",
//       };

//       // Reporting Block
//       speedNodes.reportingBlock = {
//         nameReportingMP: er.onDutyDetailsMPReporting?.nameReportingMP || "",
//         rank: er.onDutyDetailsMPReporting?.rank || "",
//         unit: er.onDutyDetailsMPReporting?.unit || "",
//         armyNumber: er.onDutyDetailsMPReporting?.armyNumber || "",
//         contactNumber: er.onDutyDetailsMPReporting?.contactNumber || "",
//       };

//       // Offence Block
//       speedNodes.offenceBlock = {
//         timeOfOffence: er.offenceOccurenceDetails?.timeOfOffence || "",
//         time: er.offenceOccurenceDetails?.time || "",
//         incidentLocation: er.offenceOccurenceDetails?.incidentLocation || "",
//         description: er.offenceOccurenceDetails?.description || "",
//         briefDescription: er.offenceOccurenceDetails?.briefDescription || "",
//         description2: er.offenceOccurenceDetails?.description2 || "",
//         actualSpeedNoted: er.offenceOccurenceDetails?.actualSpeedNoted || "",
//         authSpeed: er.offenceOccurenceDetails?.authSpeed || "",
//         overSpeedCalculated:
//           er.offenceOccurenceDetails?.overSpeedCalculated || "",
//       };

//       // Witnesses
//       if (Array.isArray(er.onDutyWitnessingMps)) {
//         speedNodes.witnesses = er.onDutyWitnessingMps.map((w: any) => ({
//           reportingBlock: {
//             nameReportingMP: w.name || "",
//             rank: w.rank || "",
//             unit: w.unit || "",
//             armyNumber: w.ArmyNo || w.armyNumber || "",
//             contactNumber: w.contactNumber || "",
//           },
//         }));
//       }

//       // Offenders
//       if (Array.isArray(er.offenders)) {
//         speedNodes.offenderPeople = er.offenders.map((o: any) => {
//           const d = o.offenderDetails || {};

//           return {
//             type: o.offenderType || "Civilian",
//             whoIsIt: o.category || "Offender",
//             details: {
//               name: d.name || "",
//               so: d.so || "",
//               address: d.address || "",
//               rank: d.rank || "",
//               armyNumber: d.armyNumber || "",
//               unit: d.unit || "",
//               fmn: d.fmn || "",
//               command: d.command || "",
//               iCardNumber: d["I Card Number"] || d.iCardNumber || "",

//               "Full Name": d.name || "",
//               Address: d.address || "",
//               "Father's / Husband's Name": d.so || "",
//               "I Card Number": d["I Card Number"] || d.iCardNumber || "",
//               "Army Rider / Driver Number": d.armyNumber || "",
//               "Select Rank": d.rank || "",
//               Unit: d.unit || "",
//               FMN: d.fmn || "",
//               Command: d.command || "",
//             },
//           };
//         });
//       }

//       speedNodes.attachments = er.customFields?.attachments || [];

//       dispatch({
//         type: "SET_FORM_DATA",
//         payload: {
//           ...initialState.formData,
//           staticSpeed: speedNodes,
//         },
//       });
//     }
//   }, [existingReport, dispatch]);

//   /* ================= FETCH REPORT NO ================= */

//   const reportNo = staticData.reportNo || "TEMP/STATIC/001";

//   const handleReportNoChange = (newReportNo: string) => {
//     dispatch({
//       type: "SET_PATH",
//       path: "formData.staticSpeed.reportNo",
//       value: newReportNo,
//     });
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
//       <div className="w-full bg-white rounded-lg overflow-hidden h-full">
//         <div className="flex h-full">
//           <LeftStepper
//             steps={[
//               { id: 1, label: "Particulars", icon: "1" },
//               { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
//               { id: 3, label: "Offence Committed/\nOrders Contravened", icon: "3" },
//               { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
//             ]}
//             currentStep={state.currentStep}
//             completedSteps={state.completedSteps}
//             title="Create New Static Speed Check Record"
//             reportNo={reportNo}
//             onCancel={() => {
//               dispatch({ type: "SET_STEP", payload: 1 });
//               onCancel();
//             }}
//             onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
//             isSubmitting={isSubmitting}
//             onReportNoChange={handleReportNoChange}
//           />

//           <RightPanel
//             step={state.currentStep}
//             formData={state.formData}
//             onNext={() => dispatch({ type: "NEXT_STEP" })}
//             onPrev={() => dispatch({ type: "PREV_STEP" })}
//             stepsConfig={{
//               1: { title: "1. PARTICULARS:", component: <StaticSpeedStep1Particulars /> },
//               2: { title: "2. STATEMENT:", component: <Step2Statement /> },
//               3: { title: "3. OFFENCE:", component: <Step3Offence /> },
//               4: {
//                 title: "4. REMARKS:",
//                 component: (
//                   <Step4Remarks
//                     value={state.formData.staticSpeed.remarks || ""}
//                     onChange={(v) =>
//                       dispatch({
//                         type: "SET_PATH",
//                         path: "formData.staticSpeed.remarks",
//                         value: v,
//                       })
//                     }
//                   />
//                 ),
//               },
//             }}
//             mode="static"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

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

      onDutyDetailsMPReporting: mpReportingSafe,

      offenceOccurenceDetails: {
        time: staticData.offenceBlock?.time || undefined,
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

        briefDescription:
          staticData.offenceBlock?.briefDescription || "",
      },

      remark: staticData.remarks,

      customFields: {
        selectedWitness: staticData.selectedWitness,
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

    const offenceId = String(staticRes._id);

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

      await createOffenderMutation.mutateAsync(offenderPayload);
    }

    toast.success("Offenders Saved!");

    /* ================= CREATE WITNESSES ================= */

    if (staticData.witnesses?.length) {
      for (const w of staticData.witnesses) {
        await createWitnessMutation.mutateAsync({
          offenceId,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP || "",
          contactNumber: w.reportingBlock.contactNumber || "",
        });
      }

      toast.success("Witnesses Saved!");
    }

    toast.success("🎉 ALL STATIC SPEED PROCESSES COMPLETED!");

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
    console.error("❌ FINAL STATIC SPEED ERROR ===>", err);

    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to submit record";

    toast.error(msg);
  } finally {
    setIsSubmitting(false);
  }
};


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
        er.remark || er.remarks || er.customFields?.remarks || "";

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
      // Offence Block  ✅ FIXED
      const occ = er.offenceOccurenceDetails || {};

      speedNodes.offenceBlock = {
        timeOfOffence: occ.timeOfOffence
          ? occ.timeOfOffence
          : occ.time
            ? new Date(occ.time).toISOString().slice(11, 16)
            : "",

        time: occ.time || "",
        incidentLocation: occ.incidentLocation || "",
        description: occ.description || "",
        briefDescription: occ.briefDescription || "",
        description2: occ.description2 || "",
        actualSpeedNoted: occ.actualSpeedNoted || "",
        authSpeed: occ.authSpeed || "",
        overSpeedCalculated: occ.overSpeedCalculated || "",
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
      // Offenders ✅ FIXED
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
              rank: d.rank || d.type || "",
              armyNumber: d.armyNumber || "",
              unit: d.unit || "",
              fmn: d.fmn || "",
              command: d.command || "",
              iCardNumber: d["I Card Number"] || d.iCardNumber || "",

              // 👇 Form labels mapping
              "Full Name": d.name || "",
              Address: d.address || "",
              "Father's / Husband's Name": d.so || "",
              "I Card Number": d["I Card Number"] || d.iCardNumber || "",
              "Army Rider / Driver Number": d.armyNumber || "",
              "Select Rank": d.rank || d.type || "",
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

      /* ================= PARTICULARS ================= */
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

      /* ================= OCCURRENCE ================= */
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

      /* ================= OFFENCE ================= */
      offence: {
        actualSpeed: val(occ.actualSpeedNoted),
        authSpeed: val(occ.authSpeed),
        overSpeed: val(occ.overSpeedCalculated),
        description: val(occ.description),
      },

      /* ================= WITNESS SIGNATURE (🔥 FIX) ================= */
      witnessSig: {
        armyNo: val(firstWitness?.reportingBlock?.armyNumber),
        rank: val(firstWitness?.reportingBlock?.rank),
        name: val(firstWitness?.reportingBlock?.nameReportingMP),
        unit: val(firstWitness?.reportingBlock?.unit),
      },

      /* ================= MP SIGN ================= */
      mpSig: {
        armyNo: val(mp.armyNumber),
        rank: val(mp.rank),
        name: val(mp.nameReportingMP),
        unit: val(mp.unit),
      },

      /* ================= REMARKS ================= */
      remarks: {
        text: val(staticSpeed.remarks),
        station: val(duty.dutyLocation),
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
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
