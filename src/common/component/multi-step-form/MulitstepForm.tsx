"use client";

import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createOffence } = useCreateTrafficOffence();
  const { mutateAsync: createOffender } = useCreateOffender();
  const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();
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
      if (!Object.keys(d).length && !person?.type) return null;

      return {
        aadharCardNo: val(d.aadharCardNo),
        name: val(d.name),
        so: val(d.so),
        relation: val(d.relation),
        armyNo: val(d.armyNumber || d.armyNo),
        rank: val(d.rank),
        unit: val(d.unit),
        command: val(d.command),
        fmn: val(d.fmn),
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
        armyNo: val(witnesses[0]?.reportingBlock?.armyNumber),
        rank: val(witnesses[0]?.reportingBlock?.rank),
        name: val(witnesses[0]?.reportingBlock?.nameReportingMP),
        unit: val(witnesses[0]?.reportingBlock?.unit),
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

      /* ================= CREATE OFFENCE ================= */
      const offenceRes = await createOffence({
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
        customFields: { remarks: traffic.remarks },
      });

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
            title="Create New General & Traffic Offence Record"
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
