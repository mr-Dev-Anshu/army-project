"use client";

import { useRef, useState, useEffect } from "react";
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
import { OffenderType } from "@/apis/offender/types";
import { useCreateDocument } from "@/features/certificateAndForm/hook";

export default function MultiStepForm({
  onCancel,
  existingOffence,
}: {
  onCancel?: () => void;
  existingOffence?: any;
}) {
  const { state, dispatch } = useForm();

  const submitLockRef = useRef(false);
  const hydratedRef = useRef<string | null>(null); // ✅ FIX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);

  console.log("EDIT DATA RECEIVED 👉", existingOffence);

  const { mutateAsync: createOffence } = useCreateTrafficOffence();
  const { mutateAsync: updateOffence } = useUpdateTrafficOffence();
  const { mutateAsync: createOffender } = useCreateOffender();
  const { mutateAsync: createWitness } = useCreateOnDutyWitnessingMp();
  const createDocumentMutation = useCreateDocument();

  const reportNo = state.formData.traffic?.reportNo || "TEMP/REPORT/001";

  const isoToTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toISOString().substring(11, 16);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (!existingOffence?._id) return;
    if (hydratedRef.current === existingOffence._id) return;

    hydratedRef.current = existingOffence._id;

    const eo = existingOffence;

    /* ===== OFFENDERS ===== */

    const offenderPeople =
      Array.isArray(eo.offenders) && eo.offenders.length > 0
        ? eo.offenders.map((o: any) => ({
            whoIsIt: o.category || "Offender",
            type: o.offenderType || "Civilian",
            details: { ...(o.offenderDetails || {}) },
            _id: o._id,
          }))
        : [];

    /* ===== TRAFFIC ===== */

    const traffic = {
      ...initialState.formData.traffic,

      offenderPeople, // ✅ MUST BE HERE

      vehicleInvolved: eo.isVehicleInvolved ? "yes" : "no",

      vehicleDetails: {
        category: eo.vehicleNumber ? "4w" : "",
        vehicleType: eo.vehicleType || "",
        vehicleName: eo.vehicleName || "",
        vehicleNumber: eo.vehicleNumber || "",
      },

      onDutyDetails: {
        dateOfDuty: eo.onDutyDetails?.dateOfDuty
          ? new Date(eo.onDutyDetails.dateOfDuty).toISOString().split("T")[0]
          : "",
        startTime: eo.onDutyDetails?.startTime
          ? new Date(eo.onDutyDetails.startTime).toISOString().substring(11, 16)
          : "",
        endTime: eo.onDutyDetails?.endTime
          ? new Date(eo.onDutyDetails.endTime).toISOString().substring(11, 16)
          : "",
        dutyLocation: eo.onDutyDetails?.dutyLocation || "",
        dutyType: eo.onDutyDetails?.dutyType || "",
      },

      offenceOccurenceDetails: {
        timeOfOffence: eo.offenceOccurenceDetails?.timeOfOffence
          ? new Date(eo.offenceOccurenceDetails.timeOfOffence)
              .toISOString()
              .substring(11, 16)
          : "",
        incidentLocation: eo.offenceOccurenceDetails?.incidentLocation || "",
        description: eo.offenceOccurenceDetails?.description || "",
        briefDescription: eo.offenceOccurenceDetails?.briefDescription || "",
      },

      offenceTypes: eo.offenceTypes || [],
      offenceRefList: eo.offenceTypeReference || [],
      remarks: eo.customFields?.remarks || eo.remarks || "",
    };

    console.log("HYDRATED TRAFFIC 👉", traffic);

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...initialState.formData,
        traffic,
      },
    });
  }, [existingOffence?._id]);

const mapTrafficToReport = (traffic: any) => {
  const occ = traffic?.offenceOccurenceDetails || {};
  const duty = traffic?.onDutyDetails || {};
  const mp = traffic?.onDutyDetailsMPReporting || {};
  const v = traffic?.vehicleDetails || {};

  const val = (v: any) =>
    v !== undefined && v !== null && v !== "Nil" ? String(v) : "";

  const dateVal = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "";

  /* ================= PERSON MAPPER ================= */
  const mapPerson = (person: any) => {
    const d = person?.details || person?.offenderDetails || person || {};

    const hasValue = Object.values(d || {}).some(
      (v) => v !== undefined && v !== null && v !== ""
    );

    if (!hasValue) return null;

    return {
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

  /* ================= OFFENDERS ================= */
  const persons = Array.isArray(traffic?.offenderPeople)
    ? traffic.offenderPeople.map(mapPerson).filter(Boolean)
    : [];

  /* ================= PARTICULAR BLOCKS ================= */

  const blocks: any[] = [];

  persons.forEach((p: any, i: number) => {
    blocks.push({
      index: `(1.${i + 1})`,
      type: "person",
      fields: [
        { label: "Name", value: p.name },
        { label: "S/O", value: p.so },
        { label: "Army No.", value: p.armyNo },
        { label: "Rank", value: p.rank },
        { label: "Unit", value: p.unit },
        { label: "Address", value: p.address },
        { label: "I Card No.", value: p.iCardNo },
      ],
    });
  });

  if (traffic?.vehicleInvolved === "yes") {
    blocks.push({
      index: `(1.${blocks.length + 1})`,
      type: "vehicle",
      fields: [
        { label: "DD Veh. BA No.", value: val(v.vehicleNumber) },
        { label: "Make & Take", value: val(v.vehicleName) },
      ],
    });
  }

  /* ================= WITNESSES ================= */

  const witnesses = Array.isArray(traffic?.witnesses)
    ? traffic.witnesses
    : [];

  const witnessSig = witnesses[0]?.reportingBlock
    ? {
        armyNo: val(
          witnesses[0].reportingBlock.armyNumber ||
            witnesses[0].reportingBlock.armyNo
        ),
        rank: val(witnesses[0].reportingBlock.rank),
        name: val(witnesses[0].reportingBlock.nameReportingMP),
        unit: val(witnesses[0].reportingBlock.unit),
      }
    : {
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
      };

  /* ================= RETURN ================= */

  return {
    reportNo: traffic?.reportNo || "",
    reportDate: new Date().toLocaleDateString("en-GB"),

    particulars: {
      blocks, // ✅ KEY FIX
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
        ? `${val(occ.timeOfOffence)} Hrs`
        : "",
      locationOfOffence: val(occ.incidentLocation),
      statement: val(occ.description),
    },

    offence: {
      types: Array.isArray(traffic?.offenceTypes)
        ? traffic.offenceTypes
        : [],
      refs: Array.isArray(traffic?.offenceRefList)
        ? traffic.offenceRefList
        : [],
      description: val(occ.description),
    },

    witnessSig,

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


  /* ================= SUBMIT ================= */
  const onSubmitFinal = async () => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const traffic = state.formData.traffic;

      const payload = {
        reportId: traffic.reportNo || existingOffence?.reportId || "",

        actionStatus: false,

        isVehicleInvolved: traffic.vehicleInvolved === "yes",

        offenceTypes: Array.isArray(traffic.offenceTypes)
          ? traffic.offenceTypes
          : existingOffence?.offenceTypes || [],

        currentOffenceType:
          traffic.offenceTypes?.[traffic.offenceTypes.length - 1] ||
          existingOffence?.currentOffenceType ||
          "",

        offenceTypeReference: Array.isArray(traffic.offenceRefList)
          ? traffic.offenceRefList
          : [],

        offenceOccurenceDetails: {
          timeOfOffence: traffic.offenceOccurenceDetails?.timeOfOffence
            ? new Date(
                `1970-01-01T${traffic.offenceOccurenceDetails.timeOfOffence}:00Z`,
              )
            : existingOffence?.offenceOccurenceDetails?.timeOfOffence
              ? new Date(existingOffence.offenceOccurenceDetails.timeOfOffence)
              : null,

          incidentLocation:
            traffic.offenceOccurenceDetails?.incidentLocation ||
            existingOffence?.offenceOccurenceDetails?.incidentLocation ||
            "",

          description:
            traffic.offenceOccurenceDetails?.description ||
            existingOffence?.offenceOccurenceDetails?.description ||
            "",

          briefDescription:
            traffic.offenceOccurenceDetails?.briefDescription ||
            existingOffence?.offenceOccurenceDetails?.briefDescription ||
            "",
        },

        onDutyDetails: {
          dateOfDuty: traffic.onDutyDetails?.dateOfDuty
            ? new Date(traffic.onDutyDetails.dateOfDuty)
            : existingOffence?.onDutyDetails?.dateOfDuty
              ? new Date(existingOffence.onDutyDetails.dateOfDuty)
              : null,

          startTime: traffic.onDutyDetails?.startTime
            ? new Date(`1970-01-01T${traffic.onDutyDetails.startTime}:00Z`)
            : existingOffence?.onDutyDetails?.startTime
              ? new Date(existingOffence.onDutyDetails.startTime)
              : null,

          endTime: traffic.onDutyDetails?.endTime
            ? new Date(`1970-01-01T${traffic.onDutyDetails.endTime}:00Z`)
            : existingOffence?.onDutyDetails?.endTime
              ? new Date(existingOffence.onDutyDetails.endTime)
              : null,

          dutyLocation:
            traffic.onDutyDetails?.dutyLocation ||
            existingOffence?.onDutyDetails?.dutyLocation ||
            "",

          dutyType:
            traffic.onDutyDetails?.dutyType ||
            existingOffence?.onDutyDetails?.dutyType ||
            "",
        },

        onDutyDetailsMPReporting: {
          nameReportingMP:
            traffic.onDutyDetailsMPReporting?.nameReportingMP ||
            existingOffence?.onDutyDetailsMPReporting?.nameReportingMP ||
            "",

          rank:
            traffic.onDutyDetailsMPReporting?.rank ||
            existingOffence?.onDutyDetailsMPReporting?.rank ||
            "",

          unit:
            traffic.onDutyDetailsMPReporting?.unit ||
            existingOffence?.onDutyDetailsMPReporting?.unit ||
            "",

          armyNumber:
            traffic.onDutyDetailsMPReporting?.armyNumber ||
            existingOffence?.onDutyDetailsMPReporting?.armyNumber ||
            "",
        },

        onDutyWitnessingMps: Array.isArray(traffic.witnesses)
          ? traffic.witnesses.map((w: any) => ({
              ArmyNo: w.reportingBlock?.armyNumber || "",
              name: w.reportingBlock?.nameReportingMP || "",
              rank: w.reportingBlock?.rank || "",
              unit: w.reportingBlock?.unit || "",
              contactNumber: w.reportingBlock?.contactNumber || "",
            }))
          : existingOffence?.onDutyWitnessingMps || [],

        witnessingMpsCount: Array.isArray(traffic.witnesses)
          ? traffic.witnesses.length
          : existingOffence?.witnessingMpsCount || 0,

        customFields: {
          remarks:
            traffic.remarks || existingOffence?.customFields?.remarks || "",

          selectedWitness: Array.isArray(traffic.witnesses)
            ? traffic.witnesses
            : existingOffence?.customFields?.selectedWitness || [],

          attachments:
            state.formData.mpReport?.attachments ||
            existingOffence?.customFields?.attachments ||
            [],
        },

        offendersCount: existingOffence?.offendersCount || 0,
        resolvedRefs: existingOffence?.resolvedRefs || [],
        displayIndex: existingOffence?.displayIndex || 1,
      };

      let offenceRes;

      if (existingOffence?._id) {
        offenceRes = await updateOffence({
          id: existingOffence._id,
          data: payload,
        });
        toast.success("Traffic Offence Updated");
      } else {
        offenceRes = await createOffence(payload);
        toast.success("Traffic Offence Created");
      }

      const offenceId = offenceRes?._id;

      /* ================= SAVE ATTACHMENTS ================= */
      if (attachments?.length) {
        try {
          console.log("📎 SAVING TRAFFIC ATTACHMENTS ===>", attachments);

          await Promise.all(
            attachments.map((file: any) =>
              createDocumentMutation.mutateAsync({
                name: file.name,
                url: file.url,
                type: file.type?.toLowerCase() || "document",
              }),
            ),
          );

          toast.success("Attachments saved");
        } catch (err) {
          console.error("❌ Attachment Save Error:", err);
          toast.error("Attachment save failed");
        }
      }

      if (!offenceId) throw new Error("Offence ID missing");

      if (Array.isArray(traffic.offenderPeople)) {
        for (const o of traffic.offenderPeople) {
          await createOffender({
            offenceId,
            offenderType: (o.offenderType || "Civilian") as OffenderType,
            offenderDetails: o.details,
          });
        }
      }

      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PREVIEW", payload: false });
    } catch (e: any) {
      toast.error(e.message || "Submit failed");
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  /* ================= STEPS ================= */
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
      title: "2. STATEMENT",
      component: <Step2Statement />,
    },

    3: { title: "3. OFFENCE", component: <Step3Offence /> },
    4: {
      title: "4. REMARKS",
      component: (
        <Step4Remarks
          value={state.formData.traffic.remarks}
          onChange={(v: string) =>
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
    <div className="h-[calc(100vh-40px)] bg-gray-100 px-6">
      <div className="bg-white rounded-lg h-full flex">
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
          reportNo={reportNo}
          onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          onCreate={onSubmitFinal}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          // onAttach={(items) => setAttachments(items)}
          onReportNoChange={(val) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.traffic.reportNo",
              value: val,
            })
          }
          module="traffic"
        />

        <RightPanel
          step={state.currentStep}
          formData={state.formData}
          stepsConfig={stepsConfig}
          mapReport={mapTrafficToReport}
          onNext={() => dispatch({ type: "NEXT_STEP" })}
          onPrev={() => dispatch({ type: "PREV_STEP" })}
          mode="traffic"
        />
      </div>
    </div>
  );
}
