// "use client";

// import { useForm, initialState } from "@/context/FormContext";
// import { LeftStepper } from "./LeftStepper";
// import { RightPanel } from "./RightPanel";
// import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
// import { toast } from "react-toastify";

// import Step1Particulars from "./steps/Step1Particulars";
// import Step2Statement from "./steps/Step2Statement";
// import Step3Offence from "./steps/Step3Offence";
// import Step4Remarks from "./steps/Step4Remarks";

// import { useCreateOffender } from "@/features/offender/Hooks";
// import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
// import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

// export default function MultiStepForm({ onCancel }: { onCancel?: () => void }) {
//   const { state, dispatch } = useForm();

//   const { mutateAsync: createOffence } = useCreateTrafficOffence();
//   const { mutateAsync: createOffender } = useCreateOffender();
//   const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();

//   /* ================= STEPS ================= */
//   const steps = [
//     { id: 1, label: "Particulars", icon: "1" },
//     { id: 2, label: "Statement of Evidence / Occurrence", icon: "2" },
//     { id: 3, label: "Offence Committed / Orders Contravened", icon: "3" },
//     { id: 4, label: "Remarks of CO / 2IC Provost Unit", icon: "4" },
//   ];

//   const mapTrafficToReport = (traffic: any) => {
//     const occ = traffic?.offenceOccurenceDetails || {};
//     const duty = traffic?.onDutyDetails || {};
//     const v = traffic?.vehicleDetails || {};

//     // 🔥 DRIVER SOURCE (SAFE)
//     const driver =
//       Array.isArray(traffic?.offenderPeople) &&
//       traffic.offenderPeople.length > 0
//         ? traffic.offenderPeople[0]?.details || {}
//         : {};

//     const mpWitness = traffic?.onDutyDetailsMPReporting || {};

//     return {
//       reportNo: "TEMP/REPORT/001",
//       reportDate: new Date().toLocaleDateString("en-GB"),

//       /* ================= 1. PARTICULARS ================= */
//       particulars: {
//         primary: {
//           aadharCardNo: driver.aadharCardNo || "Nil",
//           name: driver.name || driver.Name || "Nil",
//           so: driver.so || "Nil",
//           relation: driver.relation || "Nil",
//           armyNo:
//             driver.armyNumber || driver["Army Rider / Driver Number"] || "Nil",
//           rank: driver.rank || "Nil",
//           unit: driver.unit || "Nil",
//           command: driver.command || "Nil",
//           fmn: driver.fmn || "Nil",
//           address: driver.address || "Nil",
//           iCardNo: driver.iCardNumber || driver["ID Card Number"] || "Nil",
//         },

//         secondary: null,

//         vehicle:
//           traffic.vehicleInvolved === "yes"
//             ? {
//                 category: v.category || "Nil",
//                 vehicleType: v.vehicleType || "Nil",
//                 vehicleNumber: v.vehicleNumber || "Nil",
//                 vehicleName: v.vehicleName || "Nil",
//               }
//             : null,
//       },

//       /* ================= 2. STATEMENT OF EVIDENCE ================= */
//       occurrence: {
//         dateOfDuty: duty?.dateOfDuty || "Nil",
//         dutyTime:
//           duty?.startTime && duty?.endTime
//             ? `${duty.startTime} - ${duty.endTime}`
//             : "Nil",
//         dutyLocation: duty?.dutyLocation || "Nil",

//         nameOfWitnessingOfficial1: mpWitness?.nameReportingMP || "Nil",

//         timeOfOffence: occ?.timeOfOffence || "Nil",
//         locationOfOffence: occ?.incidentLocation || "Nil",
//         statement: occ?.description || "Nil",
//       },

//       /* ================= 3. OFFENCE ================= */
//       offence: {
//         type: traffic?.offenceTypes?.[0] || "Nil",
//         ref1: traffic?.offenceCode?.[0] || "Nil",
//         ref2: traffic?.offenceCode?.[1] || "Nil",
//         description: occ?.description || "Nil",
//       },

//       /* ================= SIGNATURE BLOCKS (🔥 REQUIRED) ================= */
//       witnessSig: {
//         armyNo: mpWitness?.armyNumber || "Nil",
//         rank: mpWitness?.rank || "Nil",
//         name: mpWitness?.nameReportingMP || "Nil",
//         unit: mpWitness?.unit || "Nil",
//       },

//       mpSig: {
//         armyNo: mpWitness?.armyNumber || "Nil",
//         rank: mpWitness?.rank || "Nil",
//         name: mpWitness?.nameReportingMP || "Nil",
//         unit: mpWitness?.unit || "Nil",
//       },

//       /* ================= REMARKS ================= */
//       remarks: {
//         text:
//           traffic?.remarks ||
//           "Suitable disciplinary action may be taken and intimated.",
//         station: duty?.dutyLocation || "Nil",
//         dated: new Date().toLocaleDateString("en-GB"),
//       },
//     };
//   };

//   // 👇 helper yahin upar
// const toISO = (date?: string, time?: string) => {
//   if (!date || !time) return null;
//   return new Date(`${date}T${time}`).toISOString();
// };

//   /* ================= FINAL SUBMIT ================= */
//   const onSubmitFinal = async () => {
//     try {
//       const traffic = state.formData.traffic;
//       console.log("🚔 RAW TRAFFIC ===>", traffic);

//       const offenceRes = await createOffence({
//         isVehicleInvolved: traffic.vehicleInvolved === "yes",

//         onDutyDetails: {
//           ...traffic.onDutyDetails,
//           startTime: toISO(
//             traffic.onDutyDetails?.dateOfDuty,
//             traffic.onDutyDetails?.startTime
//           ),
//           endTime: toISO(
//             traffic.onDutyDetails?.dateOfDuty,
//             traffic.onDutyDetails?.endTime
//           ),
//         },

//         onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,

//         offenceOccurenceDetails: {
//           ...traffic.offenceOccurenceDetails,
//           timeOfOffence: toISO(
//             traffic.onDutyDetails?.dateOfDuty,
//             traffic.offenceOccurenceDetails?.timeOfOffence
//           ),
//         },

//         offenceTypes: traffic.offenceTypes?.length
//           ? traffic.offenceTypes
//           : ["minor"],

//         offenceTypeReference: traffic.offenceCode || [],
//       });

//       const offenceId = offenceRes?._id;
//       if (!offenceId) {
//         toast.error("Offence ID missing");
//         return;
//       }

//       console.log("✅ OFFENCE CREATED:", offenceId);

//       /* ---------- CREATE OFFENDERS ---------- */
//       const offenders = Array.isArray(traffic.offenderPeople)
//         ? traffic.offenderPeople
//         : [];

//       console.log("👥 FINAL OFFENDERS ===>", offenders);

//       for (const o of offenders) {
//         const d = o.details || {};

//         const hasData =
//           d.name ||
//           d.Name ||
//           d.address ||
//           d.Address ||
//           d.armyNumber ||
//           d["Army Rider / Driver Number"];

//         if (!hasData) {
//           console.log("⏭️ Skipping empty offender");
//           continue;
//         }

//         const payload: CreateOffenderData = {
//           offenceId,
//           offenderType: (o.type ||
//             traffic.vehicleDetails?.driverType ||
//             "Civilian") as OffenderType,

//           offenderDetails: {
//             type: o.role || o.whoIsIt || "Offender",
//             name: d.name || d.Name || "",
//             rank: d.rank || d.Rank || "",
//             armyNumber: d.armyNumber || d["Army Rider / Driver Number"] || "",
//             unit: d.unit || d.Unit || "",
//             command: d.command || d.Command || "",
//             fmn: d.fmn || d.FMN || "",
//             address: d.address || d.Address || "",
//             iCardNumber:
//               d.iCardNumber || d["ID Card Number"] || d["I Card Number"] || "",
//           },
//         };

//         console.log("👮 CREATING OFFENDER ===>", payload);
//         await createOffender(payload);
//       }

//       toast.success("All Offenders Saved");

//       /* ---------- CREATE WITNESSES ---------- */
//       if (Array.isArray(traffic.witnesses)) {
//         for (const w of traffic.witnesses) {
//           await createWitness({
//             offenceId,
//             rank: w.reportingBlock.rank,
//             unit: w.reportingBlock.unit,
//             ArmyNo: w.reportingBlock.armyNumber,
//             name: w.reportingBlock.nameReportingMP,
//             contactNumber: w.reportingBlock.contactNumber,
//           });
//         }
//         toast.success("Witnesses Added");
//       }

//       toast.success("🎉 TRAFFIC REPORT COMPLETED");

//       /* ---------- RESET ---------- */
//       dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
//       dispatch({ type: "SET_STEP", payload: 1 });
//       dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
//     } catch (err) {
//       console.error("❌ FINAL SUBMIT ERROR ===>", err);
//       toast.error("Submit failed");
//     }
//   };

//   /* ================= STEP CONFIG ================= */
//   const stepsConfig = {
//     1: {
//       title: "1. PARTICULARS",
//       component: (
//         <Step1Particulars
//           value={state.formData.traffic.vehicleInvolved}
//           onChange={(v: string) =>
//             dispatch({
//               type: "SET_PATH",
//               path: "formData.traffic.vehicleInvolved",
//               value: v,
//             })
//           }
//         />
//       ),
//     },
//     2: {
//       title: "2. STATEMENT OF EVIDENCE / OCCURRENCE",
//       component: <Step2Statement />,
//     },
//     3: {
//       title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED",
//       component: <Step3Offence />,
//     },
//     4: {
//       title: "4. REMARKS",
//       component: <Step4Remarks />,
//     },
//   };

//   return (
//     <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
//       <div className="w-full bg-white rounded-lg overflow-hidden h-full">
//         <div className="flex h-full">
//           <LeftStepper
//             steps={steps}
//             currentStep={state.currentStep}
//             completedSteps={state.completedSteps}
//             title="Create New General & Traffic Offence Record"
//             reportNo="PRO/21 CPU/00042/106/25"
//             onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
//             onCreate={onSubmitFinal}
//             onCancel={onCancel}
//           />

//           <RightPanel
//             step={state.currentStep}
//             formData={state.formData}
//             onNext={() => dispatch({ type: "NEXT_STEP" })}
//             onPrev={() => dispatch({ type: "PREV_STEP" })}
//             onSubmitFinal={onSubmitFinal}
//             stepsConfig={stepsConfig}
//             mapTrafficToReport={mapTrafficToReport}
//             mode="traffic"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }





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



  const mapTrafficToReport = (traffic: any) => {
  const occ = traffic?.offenceOccurenceDetails || {};
  const duty = traffic?.onDutyDetails || {};
  const v = traffic?.vehicleDetails || {};

  const driver =
    Array.isArray(traffic?.offenderPeople) &&
    traffic.offenderPeople.length > 0
      ? traffic.offenderPeople[0]?.details || {}
      : {};

  const mpWitness = traffic?.onDutyDetailsMPReporting || {};

  return {
    reportNo: "TEMP/REPORT/001",
    reportDate: new Date().toLocaleDateString("en-GB"),

    particulars: {
      primary: {
        aadharCardNo: driver.aadharCardNo || "Nil",
        name: driver.name || driver.Name || "Nil",
        so: driver.so || "Nil",
        relation: driver.relation || "Nil",
        armyNo:
          driver.armyNumber ||
          driver["Army Rider / Driver Number"] ||
          "Nil",
        rank: driver.rank || "Nil",
        unit: driver.unit || "Nil",
        command: driver.command || "Nil",
        fmn: driver.fmn || "Nil",
        address: driver.address || "Nil",
        iCardNo:
          driver.iCardNumber ||
          driver["ID Card Number"] ||
          "Nil",
      },

      secondary: null,

      vehicle:
        traffic.vehicleInvolved === "yes"
          ? {
              category: v.category || "Nil",
              vehicleType: v.vehicleType || "Nil",
              vehicleNumber: v.vehicleNumber || "Nil",
              vehicleName: v.vehicleName || "Nil",
            }
          : null,
    },

    occurrence: {
      dateOfDuty: duty?.dateOfDuty || "Nil",
      dutyTime:
        duty?.startTime && duty?.endTime
          ? `${duty.startTime} - ${duty.endTime}`
          : "Nil",
      dutyLocation: duty?.dutyLocation || "Nil",
      nameOfWitnessingOfficial1:
        mpWitness?.nameReportingMP || "Nil",
      timeOfOffence: occ?.timeOfOffence || "Nil",
      locationOfOffence: occ?.incidentLocation || "Nil",
      statement: occ?.description || "Nil",
    },

    offence: {
      type: traffic?.offenceTypes?.[0] || "Nil",
      ref1: traffic?.offenceCode?.[0] || "Nil",
      ref2: traffic?.offenceCode?.[1] || "Nil",
      description: occ?.description || "Nil",
    },

    witnessSig: {
      armyNo: mpWitness?.armyNumber || "Nil",
      rank: mpWitness?.rank || "Nil",
      name: mpWitness?.nameReportingMP || "Nil",
      unit: mpWitness?.unit || "Nil",
    },

    mpSig: {
      armyNo: mpWitness?.armyNumber || "Nil",
      rank: mpWitness?.rank || "Nil",
      name: mpWitness?.nameReportingMP || "Nil",
      unit: mpWitness?.unit || "Nil",
    },

    remarks: {
      text:
        traffic?.remarks ||
        "Suitable disciplinary action may be taken and intimated.",
      station: duty?.dutyLocation || "Nil",
      dated: new Date().toLocaleDateString("en-GB"),
    },
  };
};


  const toISO = (date?: string, time?: string) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`).toISOString();
  };

  const onSubmitFinal = async () => {
    try {
      const traffic = state.formData.traffic;
      console.log("🚔 RAW TRAFFIC ===>", traffic);

      const offenceRes = await createOffence({
        isVehicleInvolved: traffic.vehicleInvolved === "yes",
        onDutyDetails: {
          ...traffic.onDutyDetails,
          startTime: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.onDutyDetails?.startTime
          ),
          endTime: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.onDutyDetails?.endTime
          ),
        },
        onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,
        offenceOccurenceDetails: {
          ...traffic.offenceOccurenceDetails,
          timeOfOffence: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.offenceOccurenceDetails?.timeOfOffence
          ),
        },
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

      /* ================= OFFENDERS ================= */
      let offenders = [...(traffic.offenderPeople || [])];

      if (
        traffic.vehicleInvolved === "no" &&
        traffic.offenderWithoutVehicle?.military
      ) {
        const m = traffic.offenderWithoutVehicle.military;
        const hasData = m.name || m.armyNumber || m.address;

        if (hasData) {
          offenders.push({
            type: traffic.offenderWithoutVehicle.offenderType || "Military",
            whoIsIt: "Offender",
            details: m,
          });
        }
      }

      console.log("👥 FINAL OFFENDERS ===>", offenders);

      for (const o of offenders) {
        const d = o.details || {};
        if (!d.name && !d.armyNumber && !d.address) continue;

        const payload: CreateOffenderData = {
          offenceId,
          offenderType: (o.type || "Civilian") as OffenderType,
          offenderDetails: {
            type: o.whoIsIt || "Offender",
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

        await createOffender(payload);
      }

      /* ================= WITNESSES ================= */
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
      }

      toast.success("🎉 TRAFFIC REPORT COMPLETED");

      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
    } catch (err) {
      console.error("❌ FINAL SUBMIT ERROR ===>", err);
      toast.error("Submit failed");
    }
  };

  /* ================= STEPS CONFIG ================= */
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
            steps={[
              { id: 1, label: "Particulars", icon: "1" },
              { id: 2, label: "Statement", icon: "2" },
              { id: 3, label: "Offence", icon: "3" },
              { id: 4, label: "Remarks", icon: "4" },
            ]}
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
          mapMpToReport={mapTrafficToReport}
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
