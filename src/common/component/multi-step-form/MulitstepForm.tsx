"use client";

import { useState, useEffect } from "react";
import { useForm, initialState } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import { useCreateTrafficOffence, useGetTrafficOffenceById, useUpdateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { toast } from "react-toastify";

import Step1Particulars from "./steps/Step1Particulars";
import Step2Statement from "./steps/Step2Statement";
import Step3Offence from "./steps/Step3Offence";
import Step4Remarks from "./steps/Step4Remarks";

import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

export default function MultiStepForm({ onCancel, recordId }: { onCancel?: () => void, recordId?: string }) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createOffence } = useCreateTrafficOffence();
  const { mutateAsync: updateOffence } = useUpdateTrafficOffence();
  const { mutateAsync: createOffender } = useCreateOffender();
  const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();

  const { data: existingOffence, isLoading: isLoadingOffence } = useGetTrafficOffenceById(recordId || "");

  useEffect(() => {
    if (recordId && existingOffence) {
      // Map existing offence to form state
      const mappedData = {
        ...initialState.formData,
        traffic: {
          reportNo: existingOffence.reportNo || existingOffence.reportId,
          vehicleInvolved: existingOffence.isVehicleInvolved ? "yes" : "no",
          vehicleDetails: {
            category: existingOffence.vehicleCategory === "2-Wheeler" ? "2w" : "4w",
            vehicleType: existingOffence.vehicleType === "Civilian Vehicle" ? "civilian" : "army",
            driverType: existingOffence.driverType,
            vehicleName: existingOffence.vehicleName,
            vehicleNumber: existingOffence.vehicleNumber,
          },
          offenderWithoutVehicle: {
            // Mapping back from offenders list if vehicleInvolved is no
            offenderType: "",
            military: { // Basic mapping, heavily relies on offender list order
              armyNumber: "",
              rank: "",
              name: "",
              unit: "",
              fmn: "",
              command: "",
              address: "",
              iCardNumber: "",
            }
          },
          offenderDetails: {},
          onDutyDetails: {
            dateOfDuty: existingOffence.onDutyDetails?.dateOfDuty ? existingOffence.onDutyDetails.dateOfDuty.split("T")[0] : "",
            startTime: existingOffence.onDutyDetails?.startTime
              ? (existingOffence.onDutyDetails.startTime.includes("T")
                ? existingOffence.onDutyDetails.startTime.split("T")[1].substring(0, 5)
                : existingOffence.onDutyDetails.startTime.substring(0, 5))
              : "",
            endTime: existingOffence.onDutyDetails?.endTime
              ? (existingOffence.onDutyDetails.endTime.includes("T")
                ? existingOffence.onDutyDetails.endTime.split("T")[1].substring(0, 5)
                : existingOffence.onDutyDetails.endTime.substring(0, 5))
              : "",
            dutyLocation: existingOffence.onDutyDetails?.dutyLocation,
            dutyType: existingOffence.onDutyDetails?.dutyType,
          },
          onDutyDetailsMPReporting: {
            nameReportingMP: existingOffence.onDutyDetailsMPReporting?.nameReportingMP,
            rank: existingOffence.onDutyDetailsMPReporting?.rank,
            unit: existingOffence.onDutyDetailsMPReporting?.unit,
            armyNumber: existingOffence.onDutyDetailsMPReporting?.armyNumber,
            contactNumber: existingOffence.onDutyDetailsMPReporting?.contactNumber,
          },
          offenceOccurenceDetails: {
            timeOfOffence: existingOffence.offenceOccurenceDetails?.timeOfOffence
              ? (existingOffence.offenceOccurenceDetails.timeOfOffence.includes("T")
                ? existingOffence.offenceOccurenceDetails.timeOfOffence.split("T")[1].substring(0, 5)
                : existingOffence.offenceOccurenceDetails.timeOfOffence.substring(0, 5))
              : "",
            incidentLocation: existingOffence.offenceOccurenceDetails?.incidentLocation,
            description: existingOffence.offenceOccurenceDetails?.description,
            briefDescription: existingOffence.offenceOccurenceDetails?.briefDescription,
            time: "",
          },
          offenceTypes: existingOffence.offenceTypes || [],
          // Ensure existing code doesn't break if offenceTypeReference is string[] or object[]
          offenceCode: (existingOffence.offenceTypeReference || []).map((r: any) => typeof r === 'string' ? r : r.reference || r.code),
          offenceRefList: existingOffence.offenceRefList || [],
          witnesses: (existingOffence.witnesses || []).map((w: any) => ({
            reportingBlock: {
              armyNumber: w.armyNumber || w.ArmyNo || w.details?.armyNumber || w.details?.armyNo,
              rank: w.rank || w.details?.rank,
              nameReportingMP: w.name || w.details?.name,
              unit: w.unit || w.details?.unit,
              contactNumber: w.contactNumber || w.details?.contactNumber,
            }
          })),
          selectedWitness: existingOffence.customFields?.selectedWitness,
          offenderPeople: (existingOffence.offenders || existingOffence.individuals || []).map((p: any) => ({
            whoIsIt: p.offenderDetails?.type || p.type || "Offender",
            type: p.offenderType || "Military",
            // If p.details exists (flat list from some APIs) or if p itself is the detail
            details: {
              armyNumber: p.armyNumber || p.offenderDetails?.armyNumber || p.offenderDetails?.armyNo || p.details?.armyNumber,
              rank: p.rank || p.offenderDetails?.rank || p.details?.rank,
              name: p.name || p.offenderDetails?.name || p.details?.name,
              unit: p.unit || p.offenderDetails?.unit || p.details?.unit,
              fmn: p.fmn || p.offenderDetails?.fmn || p.details?.fmn,
              command: p.command || p.offenderDetails?.command || p.details?.command,
              address: p.address || p.offenderDetails?.address || p.details?.address,
              iCardNumber: p.iCardNumber || p.offenderDetails?.iCardNumber || p.details?.iCardNumber,
              ...p.customFields,
              ...p.offenderDetails,
              ...p.details
            }
          })),
          remarks: existingOffence.remarks,
        }
      };
      dispatch({ type: "SET_FORM_DATA", payload: mappedData });
    }
  }, [recordId, existingOffence, dispatch]);

  const reportNo = state.formData.traffic?.reportNo || "TEMP/REPORT/001";

  // ... (existing code: mapTrafficToReport function) ...

  const mapTrafficToReport = (traffic: any) => {
    const occ = traffic?.offenceOccurenceDetails || {};
    const duty = traffic?.onDutyDetails || {};
    const mp = traffic?.onDutyDetailsMPReporting || {};
    const v = traffic?.vehicleDetails || {};

    const val = (v: any) => (v && v !== "Nil" ? v : "");
    const dateVal = (d: string) =>
      d ? new Date(d).toLocaleDateString("en-GB") : "";

    /* ================= HELPER FOR PERSON MAPPING ================= */
    const mapPerson = (person: any) => {
      const d = person?.details || {};
      const rel = d.relativeDetails || {};

      if (!Object.keys(d).length && !person?.type) return null;

      return {
        aadharCardNo: val(d.aadharCardNo),
        name: val(d.name),
        so: val(d.so),
        relation: val(d.relation),
        armyNo: val(d.armyNumber || d.armyNo || rel.armyNumber || rel.armyNo),
        rank: val(d.rank || rel.rank),
        unit: val(d.unit || rel.unit),
        command: val(d.command || rel.command),
        fmn: val(d.fmn || rel.fmn),
        address: val(d.address),
        iCardNo: val(d.iCardNumber || d.iCardNo || d.passNo),
      };
    };

    const primaryPerson =
      Array.isArray(traffic?.offenderPeople) && traffic.offenderPeople[0]
        ? traffic.offenderPeople[0]
        : null;

    const secondaryPerson =
      Array.isArray(traffic?.offenderPeople) &&
        traffic.offenderPeople.length > 1
        ? traffic.offenderPeople[1]
        : null;

    const witnesses = Array.isArray(traffic?.witnesses)
      ? traffic.witnesses
      : [];

    return {
      reportNo: traffic?.reportNo || reportNo,
      reportDate: new Date().toLocaleDateString("en-GB"),

      particulars: {
        primary: mapPerson(primaryPerson) || {
          aadharCardNo: "",
          name: "",
          so: "",
          relation: "",
          armyNo: "",
          rank: "",
          unit: "",
          command: "",
          fmn: "",
          address: "",
          iCardNo: "",
        },
        secondary: mapPerson(secondaryPerson),

        vehicle:
          traffic.vehicleInvolved === "yes"
            ? {
              baNo: val(v.vehicleNumber),
              makeAndTake: val(v.vehicleName),
              vehicleNumber:
                v.vehicleType === "DD Vehicle"
                  ? "DD Veh. BA No."
                  : "Registration No.",
            }
            : undefined,
      },

      occurrence: {
        dateOfDuty: dateVal(duty.dateOfDuty),
        dutyTime: (() => {
          const start = duty.startTime;
          const end = duty.endTime;
          if (start && end) return `${start} Hrs - ${end} Hrs`;
          if (start) return `${start} Hrs`;
          return "";
        })(),
        dutyLocation: val(duty.dutyLocation),
        witnessingMps: witnesses.map((w: any) => ({
          name: val(w.reportingBlock?.nameReportingMP),
          rank: val(w.reportingBlock?.rank),
        })),
        timeOfOffence: val(occ.timeOfOffence)
          ? val(occ.timeOfOffence) + " Hrs"
          : "",
        locationOfOffence: val(occ.incidentLocation),
        statement: val(occ.description),
      },

      offence: {
        types: traffic.offenceTypes || [],
        refs: traffic.offenceRefList?.map((r: any) => r.reference) || [],
        description: val(occ.description),
      },

      witnessSig: {
        armyNo: val(traffic.selectedWitness?.armyNumber || witnesses[0]?.reportingBlock?.armyNumber),
        rank: val(traffic.selectedWitness?.rank || witnesses[0]?.reportingBlock?.rank),
        name: val(traffic.selectedWitness?.nameReportingMP || witnesses[0]?.reportingBlock?.nameReportingMP),
        unit: val(traffic.selectedWitness?.unit || witnesses[0]?.reportingBlock?.unit),
      },

      mpSig: {
        armyNo: val(mp.armyNumber),
        rank: val(mp.rank),
        name: val(mp.nameReportingMP),
        unit: val(mp.unit),
      },

      remarks: {
        text: val(traffic.remarks),
        station: val(duty.dutyLocation),
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  const toISO = (date?: string, time?: string) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`).toISOString();
  };

  const onSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const traffic = state.formData.traffic;
      console.log("🚔 RAW TRAFFIC ===>", traffic);



      /* ================= CREATE / UPDATE OFFENCE ================= */
      let offenceRes;
      if (recordId) {
        // Fix reportId in payload if missing during edit
        const payload = { ...traffic, reportId: reportNo };
        // Adjust nested payload as constructed above... 
        // Since createOffence above is constructing payload directly in call, I should extract payload construction.
        // Or just call updateOffence with same structure.

        const apiPayload = {
          reportId: reportNo,
          isVehicleInvolved: traffic.vehicleInvolved === "yes",
          // Mapped Vehicle Details
          ...(traffic.vehicleInvolved === "yes" && {
            vehicleCategory:
              traffic.vehicleDetails.category === "2w"
                ? "2-Wheeler"
                : "4-Wheeler",
            vehicleType:
              traffic.vehicleDetails.vehicleType === "civilian"
                ? "Civilian Vehicle"
                : "DD Vehicle",
            vehicleName: traffic.vehicleDetails.vehicleName,
            vehicleNumber: traffic.vehicleDetails.vehicleNumber,
            driverType: traffic.vehicleDetails.driverType,
          }),
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
            briefDescription: traffic.offenceOccurenceDetails?.briefDescription,
          },
          offenceTypes: traffic.offenceTypes?.length
            ? traffic.offenceTypes
            : ["minor"],
          offenceTypeReference: traffic.offenceCode || [],
          remarks: traffic.remarks,
          customFields: {
            remarks: traffic.remarks,
            selectedWitness: traffic.selectedWitness,
          },
        };

        await updateOffence({ id: recordId, data: apiPayload });
        offenceRes = { _id: recordId };
        toast.success("Traffic Offence Updated 🎉");

      } else {
        offenceRes = await createOffence({
          reportId: reportNo,
          isVehicleInvolved: traffic.vehicleInvolved === "yes",
          // Mapped Vehicle Details
          ...(traffic.vehicleInvolved === "yes" && {
            vehicleCategory:
              traffic.vehicleDetails.category === "2w"
                ? "2-Wheeler"
                : "4-Wheeler",
            vehicleType:
              traffic.vehicleDetails.vehicleType === "civilian"
                ? "Civilian Vehicle"
                : "DD Vehicle",
            vehicleName: traffic.vehicleDetails.vehicleName,
            vehicleNumber: traffic.vehicleDetails.vehicleNumber,
            driverType: traffic.vehicleDetails.driverType,
          }),
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
            briefDescription: traffic.offenceOccurenceDetails?.briefDescription,
          },
          offenceTypes: traffic.offenceTypes?.length
            ? traffic.offenceTypes
            : ["minor"],
          offenceTypeReference: traffic.offenceCode || [],
          remarks: traffic.remarks,
          customFields: {
            remarks: traffic.remarks,
            selectedWitness: traffic.selectedWitness,
          },
        });
        toast.success("Traffic Offence Created 🎉");
      }

      const offenceId = offenceRes?._id;
      if (!offenceId) {
        toast.error("Offence ID missing");
        return;
      }

      /* ================= COLLECT ALL OFFENDERS ================= */
      const offenders: any[] = [];

      /* 1️⃣ Vehicle / normal offenders */
      if (Array.isArray(traffic.offenderPeople)) {
        offenders.push(...traffic.offenderPeople);
      }

      /* 2️⃣ No-vehicle offender flow */
      if (
        traffic.vehicleInvolved === "no" &&
        traffic.offenderWithoutVehicle?.military
      ) {
        const m = traffic.offenderWithoutVehicle.military;

        const hasData = m?.name || m?.armyNumber || m?.address || m?.rank;

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

        // 🛑 completely empty offender skip
        if (!Object.keys(d).length) continue;

        const payload: CreateOffenderData = {
          offenceId,
          offenderType: (o.type || "Civilian") as OffenderType,

          offenderDetails: {
            type: o.whoIsIt || "Offender",

            // 🔥🔥🔥 MAGIC LINE
            ...d,
          },
        };

        console.log("🚨 OFFENDER PAYLOAD ===>", payload);
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

      /* ================= RESET FORM ================= */
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
      dispatch({ type: "SET_PREVIEW", payload: false });
    } catch (err) {
      console.error("❌ FINAL SUBMIT ERROR ===>", err);
      toast.error("Submit failed");
    } finally {
      setIsSubmitting(false);
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
      component: (
        <Step4Remarks
          value={state.formData.traffic.remarks}
          onChange={(v) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.traffic.remarks",
              value: v,
            })
          }
        />
      ),
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
            title={recordId ? "Edit General & Traffic Offence Record" : "Create New General & Traffic Offence Record"}
            reportNo={reportNo || "PRO/21 CPU/00042/106/25"}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            onCreate={onSubmitFinal}
            onCancel={onCancel}
            isSubmitting={isSubmitting} // Passed prop
            onReportNoChange={(val) =>
              dispatch({
                type: "SET_PATH",
                path: "formData.traffic.reportNo",
                value: val,
              })
            }
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onPrev={() => dispatch({ type: "PREV_STEP" })}
            mapReport={mapTrafficToReport}
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
