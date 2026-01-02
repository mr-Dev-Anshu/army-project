"use client";

import { initialState, useForm } from "@/context/FormContext";
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

export default function MultiStepForm({ onCancel }: { onCancel: () => void }) {
  const { state, dispatch } = useForm();


  const { mutateAsync } = useCreateTrafficOffence();
  const { mutateAsync: createOffenderMutate } = useCreateOffender();
  const { mutateAsync: createWitnessMutate } = useCreateOnDutyWitnessingMp();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  const mapTrafficToReport = (traffic: any) => {
    const getPrimaryOffender = () => {
      if (traffic.vehicleInvolved === "yes") {
        const op = traffic?.offenderPeople;

        if (!op) return {};

        const first = Array.isArray(op) ? op[0] : op?.[0]; // handle array + object both

        let base =
          first?.details && Object.keys(first.details).length > 0
            ? first.details
            : first || {};

        // ⭐ MOST IMPORTANT — merge root flat values also
        return { ...op, ...base };
      }

      return (
        traffic?.offenderWithoutVehicle?.military ||
        traffic?.offenderWithoutVehicle ||
        {}
      );
    };

    // 2️⃣ NORMALIZE FOR ALL 6 FORMS
    const normalizeOffender = (o: any) => ({
      name:
        o?.Name ||
        o?.["Full Name"] ||
        o?.["Rider/Driver Name"] ||
        o?.["Name"] ||
        "N/A",

      armyNo:
        o?.["Army Rider / Driver Number"] ||
        o?.["Service Number"] ||
        o?.armyNumber ||
        o?.armyNo ||
        "N/A",

      aadhar: o?.["Aadhar Card Number"] || o?.aadharNumber || "N/A",

      father:
        o?.["Father / Husband Name"] ||
        o?.["Father’s Name (Son of)"] ||
        o?.fatherName ||
        "N/A",

      rank: o?.Rank || o?.rank || "N/A",
      unit: o?.Unit || o?.unit || "N/A",
      fmn: o?.FMN || o?.fmn || "N/A",
      command: o?.Command || o?.command || "N/A",

      address:
        o?.Address ||
        o?.["Shop Address"] ||
        o?.["Place of Stay"] ||
        o?.address ||
        "N/A",

      icard: o?.["ID Card Number"] || o?.["I Card Number"] || o?.icard || "N/A",
    });

    const offenderRaw = getPrimaryOffender();
    const offender = normalizeOffender(offenderRaw);

    const occ = traffic?.offenceOccurenceDetails || {};
    const duty = traffic?.onDutyDetails || {};
    const mp = traffic?.onDutyDetailsMPReporting || {};

    const selectedWitness =
      traffic.selectedWitness !== null
        ? traffic.witnesses?.[traffic.selectedWitness]
        : null;

    return {
      reportNo: "TEMP/REPORT/001",
      reportDate: new Date().toLocaleDateString("en-GB"),

      particulars: {
        primary: {
          aadharCardNo: offender.aadhar,
          name: offender.name,
          so: offender.father,
          armyNo: offender.armyNo,
          rank: offender.rank,
          unit: offender.unit,
          command: offender.command,
          fmn: offender.fmn,
          address: offender.address,
          iCardNo: offender.icard,
        },

        vehicle:
          traffic.vehicleInvolved === "yes"
            ? {
                baNo: traffic.vehicleDetails?.vehicleNumber || "N/A",
                makeAndTake: traffic.vehicleDetails?.vehicleName || "N/A",
              }
            : undefined,
      },

      occurrence: {
        dateOfDuty: duty?.dateOfDuty || "N/A",
        dutyTime: duty?.startTime || "N/A",
        dutyLocation: duty?.dutyLocation || "N/A",

        nameOfWitnessingOfficial1:
          traffic?.witnesses?.[0]?.reportingBlock?.nameReportingMP || "N/A",
        nameOfWitnessingOfficial2:
          traffic?.witnesses?.[1]?.reportingBlock?.nameReportingMP || "",
        nameOfWitnessingOfficial3:
          traffic?.witnesses?.[2]?.reportingBlock?.nameReportingMP || "",

        timeOfOffence: occ?.timeOfOffence || occ?.time || "N/A",
        locationOfOffence: occ?.incidentLocation || "N/A",

        statement:
          occ?.description2 || occ?.description || "No statement available",
      },

      offence: {
        type: traffic?.offenceTypes?.[0] || "disciplinary",
        ref1: traffic?.offenceCode?.[0] || "Mil Tfc Offence",
        ref2: traffic?.offenceCode?.[1] || "Station Order / SAO",

        description:
          occ?.description2 || occ?.description || "No description provided",
      },

      witnessSig: {
        armyNo:
          selectedWitness?.reportingBlock?.armyNumber ||
          selectedWitness?.reportingBlock?.ArmyNo ||
          "N/A",
        rank: selectedWitness?.reportingBlock?.rank || "N/A",
        name: selectedWitness?.reportingBlock?.nameReportingMP || "N/A",
        unit: selectedWitness?.reportingBlock?.unit || "N/A",
      },

      mpSig: {
        armyNo: mp?.armyNumber || mp?.armyNo || "N/A",
        rank: mp?.rank || "N/A",
        name: mp?.nameReportingMP || "N/A",
        unit: mp?.unit || "N/A",
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

  const onSubmitFinal = async () => {
    try {
      const traffic = state?.formData?.traffic || {};
      console.log("🚔 RAW TRAFFIC ===>", traffic);

      const safe = (v: any, fallback = undefined) => {
        if (v === null || v === undefined) return fallback;
        if (typeof v === "string") return v.trim() || fallback;
        return v;
      };

      const date = safe(traffic?.onDutyDetails?.dateOfDuty);

      const toISO = (time?: string) => {
        if (!date || !time) return undefined;
        try {
          return new Date(`${date}T${time}`).toISOString();
        } catch {
          return undefined;
        }
      };

      /* ---------------- MAIN PAYLOAD ---------------- */
      const payload = {
        isVehicleInvolved: traffic?.vehicleInvolved === "yes",

        onDutyDetails: {
          dateOfDuty: safe(traffic?.onDutyDetails?.dateOfDuty),
          dutyLocation: safe(traffic?.onDutyDetails?.dutyLocation),
          dutyType: safe(traffic?.onDutyDetails?.dutyType),
          startTime: toISO(traffic?.onDutyDetails?.startTime),
          endTime: toISO(traffic?.onDutyDetails?.endTime),
        },

        onDutyDetailsMPReporting: {
          nameReportingMP: safe(
            traffic?.onDutyDetailsMPReporting?.nameReportingMP
          ),
          rank: safe(traffic?.onDutyDetailsMPReporting?.rank),
          unit: safe(traffic?.onDutyDetailsMPReporting?.unit),
          armyNumber: safe(traffic?.onDutyDetailsMPReporting?.armyNumber),
          contactNumber: safe(traffic?.onDutyDetailsMPReporting?.contactNumber),
        },

        offenceOccurenceDetails: {
          description: safe(traffic?.offenceOccurenceDetails?.description),
          description2: safe(traffic?.offenceOccurenceDetails?.description2),
          incidentLocation: safe(
            traffic?.offenceOccurenceDetails?.incidentLocation
          ),
          timeOfOffence: toISO(traffic?.offenceOccurenceDetails?.timeOfOffence),
        },

        offenceTypes:
          Array.isArray(traffic?.offenceTypes) &&
          traffic?.offenceTypes?.length > 0
            ? traffic.offenceTypes
            : ["minor"],

        offenceTypeReference:
          Array.isArray(traffic?.offenceCode) &&
          traffic?.offenceCode?.length > 0
            ? traffic.offenceCode
            : ["Mil Tfc Offence"],
      };

      console.log("🚔 FINAL SAFE PAYLOAD ===>", payload);

      toast.info("Creating Offence...");
      const offence = await mutateAsync(payload);

      toast.success("Offence Created Successfully!");

      const offenceId = offence?._id;
      if (!offenceId) {
        toast.error("Offence ID missing from backend!");
        return;
      }

      /* ---------------- OFFENDER HANDLING ---------------- */
      const offenderType: OffenderType =
        traffic?.vehicleInvolved === "yes"
          ? (traffic?.vehicleDetails?.driverType as OffenderType) || "Civilian"
          : (traffic?.offenderWithoutVehicle?.offenderType as OffenderType) ||
            "Civilian";

      if (
        Array.isArray(traffic?.offenderPeople) &&
        traffic?.offenderPeople.length > 0
      ) {
        const offenderPayload: CreateOffenderData = {
          offenceId,
          offenderType,
          offenderDetails: traffic.offenderPeople.map((o: any) => {
            let rawType = o?.type || offenderType || "Driver";

            if (rawType?.toLowerCase().includes("co")) rawType = "CoDriver";
            else rawType = "Driver";

            return {
              type: rawType,
              details: o?.details ? o.details : o || {},
            };
          }),
        };

        await createOffenderMutate(offenderPayload);
        toast.success("Offenders Saved Successfully!");
      } else {
        console.log("⚠️ No offender provided — skipping offender API");
      }

      /* ---------------- WITNESS HANDLING ---------------- */
      if (Array.isArray(traffic?.witnesses) && traffic?.witnesses?.length > 0) {
        const witnessPayload = traffic.witnesses.map((w) => ({
          offenceId,
          rank: safe(w?.reportingBlock?.rank),
          unit: safe(w?.reportingBlock?.unit),
          ArmyNo: safe(w?.reportingBlock?.armyNumber),
          name: safe(w?.reportingBlock?.nameReportingMP),
          contactNumber: safe(w?.reportingBlock?.contactNumber),
        }));

        console.log("👀 SAFE WITNESS PAYLOAD ===>", witnessPayload);

        await Promise.all(witnessPayload.map((w) => createWitnessMutate(w)));

        toast.success("Witness Added Successfully!");
      } else {
        console.log("⚠️ No witness provided — skipping witness API");
      }

      toast.success("🎉 Final Submit Completed Successfully!");

      /* -----------------------------------
       ⭐⭐⭐ RESET FORM + STEPPER ⭐⭐⭐
    ------------------------------------*/
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({
        type: "SET_PATH",
        path: "completedSteps",
        value: [],
      });
    } catch (err: any) {
      console.error("❌ FINAL ERROR ===>", err?.response?.data || err);

      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong!"
      );
    }
  };

  // const onSubmitFinal = async () => {
  //   try {
  //     const traffic = state?.formData?.traffic || {};
  //     console.log("🚔 RAW TRAFFIC ===>", traffic);

  //     /* ---------------- SAFE HELPERS ---------------- */
  //     const safe = (v: any, fallback = undefined) => {
  //       if (v === null || v === undefined) return fallback;
  //       if (typeof v === "string") return v.trim() || fallback;
  //       return v;
  //     };

  //     const date = safe(traffic?.onDutyDetails?.dateOfDuty);

  //     const toISO = (time?: string) => {
  //       if (!date || !time) return undefined;
  //       try {
  //         return new Date(`${date}T${time}`).toISOString();
  //       } catch {
  //         return undefined;
  //       }
  //     };

  //     /* ---------------- MAIN PAYLOAD ---------------- */
  //     const payload = {
  //       isVehicleInvolved: traffic?.vehicleInvolved === "yes",

  //       onDutyDetails: {
  //         dateOfDuty: safe(traffic?.onDutyDetails?.dateOfDuty),
  //         dutyLocation: safe(traffic?.onDutyDetails?.dutyLocation),
  //         dutyType: safe(traffic?.onDutyDetails?.dutyType),
  //         startTime: toISO(traffic?.onDutyDetails?.startTime),
  //         endTime: toISO(traffic?.onDutyDetails?.endTime),
  //       },

  //       onDutyDetailsMPReporting: {
  //         nameReportingMP: safe(
  //           traffic?.onDutyDetailsMPReporting?.nameReportingMP
  //         ),
  //         rank: safe(traffic?.onDutyDetailsMPReporting?.rank),
  //         unit: safe(traffic?.onDutyDetailsMPReporting?.unit),
  //         armyNumber: safe(traffic?.onDutyDetailsMPReporting?.armyNumber),
  //         contactNumber: safe(traffic?.onDutyDetailsMPReporting?.contactNumber),
  //       },

  //       offenceOccurenceDetails: {
  //         description: safe(traffic?.offenceOccurenceDetails?.description),
  //         description2: safe(traffic?.offenceOccurenceDetails?.description2),
  //         incidentLocation: safe(
  //           traffic?.offenceOccurenceDetails?.incidentLocation
  //         ),
  //         timeOfOffence: toISO(traffic?.offenceOccurenceDetails?.timeOfOffence),
  //       },

  //       offenceTypes:
  //         Array.isArray(traffic?.offenceTypes) &&
  //         traffic?.offenceTypes?.length > 0
  //           ? traffic.offenceTypes
  //           : ["minor"],

  //       offenceTypeReference:
  //         Array.isArray(traffic?.offenceCode) &&
  //         traffic?.offenceCode?.length > 0
  //           ? traffic.offenceCode
  //           : ["Mil Tfc Offence"],
  //     };

  //     console.log("🚔 FINAL SAFE PAYLOAD ===>", payload);

  //     toast.info("Creating Offence...");
  //     const offence = await mutateAsync(payload);

  //     toast.success("Offence Created Successfully!");

  //     const offenceId = offence?._id;
  //     if (!offenceId) {
  //       toast.error("Offence ID missing from backend!");
  //       return;
  //     }

  //     /* ---------------- OFFENDER HANDLING ---------------- */
  //     const offenderType: OffenderType =
  //       traffic?.vehicleInvolved === "yes"
  //         ? (traffic?.vehicleDetails?.driverType as OffenderType) || "Civilian"
  //         : (traffic?.offenderWithoutVehicle?.offenderType as OffenderType) ||
  //           "Civilian";

  //     if (
  //       Array.isArray(traffic?.offenderPeople) &&
  //       traffic?.offenderPeople.length > 0
  //     ) {
  //       const offenderPayload: CreateOffenderData = {
  //         offenceId,
  //         offenderType,
  //         offenderDetails: traffic.offenderPeople.map((o: any) => {
  //           let rawType = o?.type || offenderType || "Driver"; // fallback safe

  //           // ⚠️ BACKEND ONLY ACCEPTS Driver / CoDriver
  //           const allowed = ["Driver", "CoDriver"];

  //           // normalize values
  //           if (rawType?.toLowerCase().includes("co")) rawType = "CoDriver";
  //           else rawType = "Driver";

  //           if (!allowed.includes(rawType)) rawType = "Driver";

  //           return {
  //             type: rawType,
  //             details: o?.details ? o.details : o || {},
  //           };
  //         }),
  //       };

  //       // console.log("👮 SAFE OFFENDER PAYLOAD ===>", offenderPayload);

  //       await createOffenderMutate(offenderPayload);
  //       toast.success("Offenders Saved Successfully!");
  //     } else {
  //       console.log("⚠️ No offender provided — skipping offender API");
  //     }

  //     /* ---------------- WITNESS HANDLING ---------------- */
  //     if (Array.isArray(traffic?.witnesses) && traffic?.witnesses?.length > 0) {
  //       const witnessPayload = traffic.witnesses.map((w) => ({
  //         offenceId,
  //         rank: safe(w?.reportingBlock?.rank),
  //         unit: safe(w?.reportingBlock?.unit),
  //         ArmyNo: safe(w?.reportingBlock?.armyNumber),
  //         name: safe(w?.reportingBlock?.nameReportingMP),
  //         contactNumber: safe(w?.reportingBlock?.contactNumber),
  //       }));

  //       console.log("👀 SAFE WITNESS PAYLOAD ===>", witnessPayload);

  //       await Promise.all(witnessPayload.map((w) => createWitnessMutate(w)));

  //       toast.success("Witness Added Successfully!");
  //     } else {
  //       console.log("⚠️ No witness provided — skipping witness API");
  //     }

  //     toast.success("🎉 Final Submit Completed Successfully!");
  //   } catch (err: any) {
  //     console.error("❌ FINAL ERROR ===>", err?.response?.data || err);

  //     toast.error(
  //       err?.response?.data?.message ||
  //         err?.response?.data?.error ||
  //         "Something went wrong!"
  //     );
  //   }
  // };

  const stepsConfig = {
    1: {
      title: "1. PARTICULARS:",
      component: <Step1Particulars />,
    },
    2: { title: "2. STATEMENT:", component: <Step2Statement /> },
    3: { title: "3. OFFENCE:", component: <Step3Offence /> },
    4: { title: "4. REMARKS:", component: <Step4Remarks /> },
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
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            onCreate={onSubmitFinal}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            stepsConfig={stepsConfig}
            mode="traffic"
            mapTrafficToReport={mapTrafficToReport}
          />
        </div>
      </div>
    </div>
  );
}
