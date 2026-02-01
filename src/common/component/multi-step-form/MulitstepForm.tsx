"use client";

import { useState } from "react";
import { useForm, initialState } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import {
  useCreateTrafficOffence,
  useUpdateTrafficOffence,
} from "@/features/generalTraficOffence/hooks";
import { toast } from "react-toastify";

import Step1Particulars from "./steps/Step1Particulars";
import Step2Statement from "./steps/Step2Statement";
import Step3Offence from "./steps/Step3Offence";
import Step4Remarks from "./steps/Step4Remarks";

import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";
import { setMissingFields } from "@/context/validationDispatcher";
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";

import { useEffect } from "react";
// ... imports

export default function MultiStepForm({
  onCancel,
  existingOffence,
}: {
  onCancel?: () => void;
  existingOffence?: any;
}) {
  const { state, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("EDIT DATA RECEIVED 👉", existingOffence);

  const { mutateAsync: createOffence } = useCreateTrafficOffence();
  const { mutateAsync: updateOffence } = useUpdateTrafficOffence(); // Need this hook if we want to update vs create? Or we just create new?
  // User said "edit button is not working". Editing implies updating.
  // But usually this form submits to "Create". If we are reusing it for Edit, we might need Update hook or handle submit differently.
  // For now let's focus on FILLING the table (hydrating).

  const { mutateAsync: createOffender } = useCreateOffender();
  const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();
  const reportNo = state.formData.traffic?.reportNo || "TEMP/REPORT/001";

  const isoToTime = (iso:any) => {
    if (!iso) return "";
    try {
      return new Date(iso).toISOString().substring(11, 16);
      // returns HH:mm
    } catch {
      return "";
    }
  };

  const mapBackendOffenderDetails = (d: any = {}) => {
    const mapped: any = {};

    Object.entries(d).forEach(([key, value]) => {
      if (!value) return;

      const k = key.toLowerCase();

      /* ================= SHOP KEEPER SPECIAL ================= */

      if (k.includes("shop owner")) {
        mapped.shopOwnerName = value;

        // 🔥 ADD THIS
        mapped["Shop Owner Name"] = value;
        return;
      }

      if (k === "shop name") {
        mapped.shopName = value;

        // 🔥 ADD THIS
        mapped["Shop Name"] = value;
        return;
      }

      if (k === "shop address") {
        mapped.shopAddress = value;

        // 🔥 ADD THIS
        mapped["Shop Address"] = value;
        return;
      }

      /* ================= GENERIC PERSON ================= */

      if (k === "name" || (k.includes("name") && !mapped.name)) {
        mapped.name = value;
        return;
      }

      if (k === "so" || k.includes("father") || k.includes("relative")) {
        mapped.so = value;
        return;
      }

      if (k.includes("rank")) {
        mapped.rank = normalizeRank(String(value));
        return;
      }

      if (k.includes("army")) {
        mapped.armyNumber = value;
        return;
      }

      if (k.includes("unit")) {
        mapped.unit = value;
        return;
      }

      if (k.includes("command")) {
        mapped.command = value;
        return;
      }

      if (k.includes("fmn")) {
        mapped.fmn = value;
        return;
      }

      /* ================= ADDRESS ================= */

      if (
        k === "address" ||
        k.includes("place of stay") ||
        k.includes("place of work")
      ) {
        mapped.address = value;
        return;
      }

      /* ================= PASS / CARD ================= */

      if (k.includes("passno") || k.includes("pass no")) {
        mapped.passNo = value;
        mapped.iCardNumber = value;
        return;
      }

      if (k.includes("passissuedate")) {
        mapped.passIssueDate = value;
        return;
      }

      if (k.includes("passexpiredate")) {
        mapped.passExpireDate = value;
        return;
      }

      if (k.includes("card") || k.includes("icard")) {
        mapped.iCardNumber = value;
        return;
      }

      /* ================= FALLBACK ================= */

      mapped[key] = value;
    });

    return mapped;
  };

  
  const normalizeRank = (rank?: string) => {
    if (!rank) return "";

    const r = rank.toLowerCase().trim();

    if (r === "sepoy" || r === "sep") return "sepoy";
    if (r === "naik") return "naik";
    if (r === "havildar") return "havildar";
    if (r === "lance naik") return "lance naik";

    return r;
  };

  // Hydration Effect
  useEffect(() => {
    if (existingOffence) {
      // console.log("Hydrating Form with:", existingOffence);
      try {
        const trafficNodes = { ...initialState.formData.traffic };
        console.log(trafficNodes);
        const eo = existingOffence;

        // 1. Basic Fields
        trafficNodes.vehicleInvolved = eo.isVehicleInvolved ? "yes" : "no";
        trafficNodes.remarks = eo.customFields?.remarks || eo.remarks || "";
        trafficNodes.reportNo = eo.reportNo || eo.reportId || eo.reportNumber;

        // 2. Vehicle Details
        if (eo.isVehicleInvolved) {
          trafficNodes.vehicleDetails = {
            category: eo.vehicleCategory || "",
            vehicleType: eo.vehicleType || "",
            driverType: eo.driverType || "",
            vehicleName: eo.vehicleName || "",
            vehicleNumber: eo.vehicleNumber || "",
          };
        }

        // 4. On Duty Details


        trafficNodes.onDutyDetails = {
          dateOfDuty: eo.onDutyDetails?.dateOfDuty
            ? new Date(eo.onDutyDetails.dateOfDuty).toISOString().split("T")[0]
            : "",
          startTime: isoToTime(eo.onDutyDetails?.startTime),
          endTime: isoToTime(eo.onDutyDetails?.endTime),
          dutyLocation: eo.onDutyDetails?.dutyLocation || "",
          dutyType: eo.onDutyDetails?.dutyType || "",
        };

        // 5. MP Reporting
        trafficNodes.onDutyDetailsMPReporting = {
          nameReportingMP: eo.onDutyDetailsMPReporting?.nameReportingMP || "",
          rank: eo.onDutyDetailsMPReporting?.rank || "",
          unit: eo.onDutyDetailsMPReporting?.unit || "",
          armyNumber: eo.onDutyDetailsMPReporting?.armyNumber || "",
          contactNumber: eo.onDutyDetailsMPReporting?.contactNumber || "",
        };

        // 6. Occurence

        trafficNodes.offenceOccurenceDetails = {
          timeOfOffence: isoToTime(eo.offenceOccurenceDetails?.timeOfOffence),
          incidentLocation: eo.offenceOccurenceDetails?.incidentLocation || "",
          description: eo.offenceOccurenceDetails?.description || "",
          briefDescription: eo.offenceOccurenceDetails?.briefDescription || "",
        };

        // 7. Arrays - Deep Copy to avoid mutations
        trafficNodes.offenceTypes = Array.isArray(eo.offenceTypes)
          ? [...eo.offenceTypes]
          : [];
        trafficNodes.offenceRefList = Array.isArray(eo.offenceTypeReference)
          ? [...eo.offenceTypeReference]
          : [];

        if (Array.isArray(eo.onDutyWitnessingMps)) {
          const witnessMap = new Map<string, any>();

          eo.onDutyWitnessingMps.forEach((w: any) => {
            const key = (w.armyNumber || w.ArmyNo || w.name || "") + "_witness";

            witnessMap.set(key, {
              reportingBlock: {
                nameReportingMP: w.name || w.nameReportingMP || "",
                rank: w.rank || "",
                unit: w.unit || "",
                armyNumber: w.armyNumber || w.ArmyNo || "",
                contactNumber: w.contactNumber || "",
              },
            });
          });

          trafficNodes.witnesses = Array.from(witnessMap.values());
        }

        if (Array.isArray(eo.offenders)) {
          const uniqueMap = new Map<string, any>();

          eo.offenders.forEach((o: any) => {
            const mapped = mapBackendOffenderDetails(o.offenderDetails);
            if (!mapped || !Object.keys(mapped).length) return;

            // ✅ Same person key
            const key =
              (mapped.armyNumber || mapped.iCardNumber || mapped.name) +
              "_" +
              (o.offenderDetails?.type || "Offender");

            // ✅ Always overwrite -> latest wins
            uniqueMap.set(key, {
              type: o.offenderType || "Civilian",
              whoIsIt: o.offenderDetails?.type || "Offender",
              details: mapped,
            });
          });

          trafficNodes.offenderPeople = Array.from(uniqueMap.values());
        }

        dispatch({
          type: "SET_FORM_DATA",
          payload: {
            ...initialState.formData,
            traffic: trafficNodes,
            mpReport: {
              ...initialState.formData.mpReport,
              attachments: eo.customFields?.attachments || [],
            },
          },
        });
      } catch (error) {
        console.error("Hydration Failed:", error);
        toast.error("Failed to load existing data");
      }
    }
  }, [existingOffence, dispatch]);

  // ... (existing code: mapTrafficToReport function) ...

  const mapTrafficToReport = (traffic: any) => {
    const occ = traffic?.offenceOccurenceDetails || {};
    const duty = traffic?.onDutyDetails || {};
    const mp = traffic?.onDutyDetailsMPReporting || {};
    const v = traffic?.vehicleDetails || {};

    const val = (v: any) => (v && v !== "Nil" ? v : "");
    const dateVal = (d: string) =>
      d ? new Date(d).toLocaleDateString("en-GB") : "";

    /* ================= PERSON MAPPER ================= */
    const mapPerson = (person: any) => {
      const d = person?.details || {};
      if (!Object.keys(d).length) return null;

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

    /* ✅ ALL OFFENDERS */
    const persons = Array.isArray(traffic.offenderPeople)
      ? traffic.offenderPeople.map(mapPerson).filter(Boolean)
      : [];

    const witnesses = Array.isArray(traffic?.witnesses)
      ? traffic.witnesses
      : [];

    return {
      reportNo: traffic?.reportNo || reportNo,
      reportDate: new Date().toLocaleDateString("en-GB"),

      particulars: {
        persons, // 👈 ARRAY OF ALL OFFENDERS

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
        refs: traffic.offenceRefList || [],
        description: val(occ.description),
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
    if (!date || !time) return undefined;
    try {
      const d = new Date(`${date}T${time}`);
      if (isNaN(d.getTime())) return undefined;
      return d.toISOString();
    } catch (e) {
      return undefined;
    }
  };

  const onSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const traffic = state.formData.traffic;
      console.log("🚔 RAW TRAFFIC ===>", traffic);

      /* ================= CREATE / UPDATE OFFENCE ================= */
      const payload = {
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
          dateOfDuty: traffic.onDutyDetails?.dateOfDuty
            ? traffic.onDutyDetails.dateOfDuty
            : undefined,
          startTime: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.onDutyDetails?.startTime,
          ),
          endTime: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.onDutyDetails?.endTime,
          ),
        },
        onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,
        offenceOccurenceDetails: {
          ...traffic.offenceOccurenceDetails,
          timeOfOffence: toISO(
            traffic.onDutyDetails?.dateOfDuty,
            traffic.offenceOccurenceDetails?.timeOfOffence,
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
          attachments: state.formData.mpReport?.attachments || [], // Save attachments with types
        },
      };

      let offenceRes;
      if (existingOffence && existingOffence._id) {
        // UPDATE MODE
        console.log("📝 UPDATING Traffic Offence:", existingOffence._id);
        offenceRes = await updateOffence({
          id: existingOffence._id,
          data: payload,
        });
        toast.success("Traffic Offence Updated Successfully!");
      } else {
        // CREATE MODE
        console.log("🆕 CREATING Traffic Offence");
        offenceRes = await createOffence(payload);
        toast.success("Traffic Offence Created Successfully!");
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

      /* ================= ATTACHMENTS ================= */
      // If the API supports separate fields for types, we could do:
      // const certs = atts.filter(a => a.type === 'Certificate');
      // const forms = atts.filter(a => a.type === 'Forms');
      // const letters = atts.filter(a => a.type === 'Letter');
      // But based on available types, we might need to put them in 'customFields' or rely on a "documents" endpoint.
      // For now, let's assume we update the MP Report part or just save it.
      // Since `createTrafficOffence` seems to not have explicit attachment fields in the helper above,
      // we might need to rely on the fact that we might have already put them in `customFields` or similar.
      // However, if we need to SAVE them, we might need `mpReport` context.
      // Let's assume for now valid saving is handled through `mpReport` submission if that exists (not seen here)
      // OR we just attach them to customFields for now.

      // NOTE: The user requested separate submission logic.
      // If we don't have a dedicated API for documents, we might be limited.
      // Assuming we can patch the offence with custom data.

      toast.success("🎉 TRAFFIC REPORT COMPLETED");

      /* ================= RESET FORM ================= */
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
      dispatch({ type: "SET_PREVIEW", payload: false });
    } catch (err: any) {
      console.error("❌ FINAL SUBMIT ERROR ===>", err);
      const msg = err?.response?.data?.details?.[0]?.message
        ? `Val Error: ${err.response.data.details[0].message} (${err.response.data.details[0].path})`
        : err?.response?.data?.error || "Submit failed";
      toast.error(msg);
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
          attachments={state.formData.mpReport?.attachments || []}
          onAttachmentsChange={(items) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.mpReport.attachments",
              value: items,
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
            onAttach={(items) => {
              const current = state.formData.mpReport.attachments || [];
              dispatch({
                type: "SET_PATH",
                path: "formData.mpReport.attachments",
                value: [...current, ...items],
              });
            }}
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
