import { useForm } from "@/context/FormContext";
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

export default function MultiStepForm() {
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
      const traffic = state.formData.traffic;
      console.log("🚔 RAW TRAFFIC STATE ===>", traffic);

      /* ================= CREATE OFFENCE ================= */
      const payload = {
        isVehicleInvolved: traffic.vehicleInvolved === "yes",

        onDutyDetails: {
          dateOfDuty: traffic.onDutyDetails.dateOfDuty,
          dutyLocation: traffic.onDutyDetails.dutyLocation,
          dutyType: traffic.onDutyDetails.dutyType,
          startTime: traffic.onDutyDetails.startTime
            ? new Date(
                `${traffic.onDutyDetails.dateOfDuty}T${traffic.onDutyDetails.startTime}`
              ).toISOString()
            : "",
          endTime: traffic.onDutyDetails.endTime
            ? new Date(
                `${traffic.onDutyDetails.dateOfDuty}T${traffic.onDutyDetails.endTime}`
              ).toISOString()
            : "",
        },

        onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,

        offenceOccurenceDetails: {
          description: traffic.offenceOccurenceDetails.description,
          incidentLocation: traffic.offenceOccurenceDetails.incidentLocation,
          timeOfOffence: traffic.offenceOccurenceDetails.timeOfOffence
            ? new Date(
                `${traffic.onDutyDetails.dateOfDuty}T${traffic.offenceOccurenceDetails.timeOfOffence}`
              ).toISOString()
            : "",
        },

        offenceTypes:
          traffic.offenceTypes?.length > 0 ? traffic.offenceTypes : ["minor"],

        offenceTypeReference:
          traffic.offenceCode?.length > 0
            ? traffic.offenceCode
            : ["Mil Tfc Offence"],
      };

      const offenceRes = await mutateAsync(payload);
      const offenceId = offenceRes?._id;
      if (!offenceId) return toast.error("Offence ID missing!");

      toast.success("Traffic Offence Created!");

      /* ================= COLLECT ALL OFFENDERS ================= */
      const allOffenders: any[] = [];

      // 1️⃣ Vehicle involved offenders (array)
      if (Array.isArray(traffic.offenderPeople)) {
        allOffenders.push(...traffic.offenderPeople);
      }

      // 2️⃣ Without vehicle – all possible types
      const withoutVehicle = traffic.offenderWithoutVehicle || {};
      Object.values(withoutVehicle).forEach((item: any) => {
        if (!item) return;
        if (Array.isArray(item)) allOffenders.push(...item);
        else allOffenders.push(item);
      });

      console.log("👥 FINAL OFFENDER ARRAY ===>", allOffenders);

      for (const o of allOffenders) {
        // 🔥 ONLY VALID SOURCE OF FORM DATA
        const details = o.details || {};

        // 🔥 WHO IS THE PERSON (Civilian / Employee / Military)
        const resolvedOffenderType =
          o.type || // driver / co-driver radio
          o.offenderType || // without vehicle
          traffic.vehicleDetails?.driverType ||
          "Civilian";

        // 🔥 ROLE IN INCIDENT
        const resolvedRole =
          o.whoIsIt || // Driver / Co-Driver
          "Offender";

        // 🚫 SKIP PURE EMPTY BLOCKS
        if (
          !details.Name &&
          !details.name &&
          !details.Address &&
          !details.address
        ) {
          console.log("⏭️ Skipping empty offender block");
          continue;
        }

        const offenderPayload: CreateOffenderData = {
          offenceId,
          offenderType: resolvedOffenderType as OffenderType,

          offenderDetails: {
            type: resolvedRole,

            name: details?.Name || details?.name || "",
            rank: details?.Rank || details?.rank || "",
            armyNumber:
              details?.["Army Rider / Driver Number"] ||
              details?.armyNumber ||
              "",
            unit: details?.Unit || details?.unit || "",
            command: details?.Command || details?.command || "",
            fmn: details?.FMN || details?.fmn || "",
            address: details?.Address || details?.address || "",
            iCardNumber:
              details?.["ID Card Number"] || details?.iCardNumber || "",
          },
        };

        console.log(
          "👮 CREATING OFFENDER ===>",
          JSON.stringify(offenderPayload, null, 2)
        );

        await createOffenderMutate(offenderPayload);
      }

      toast.success("All Offenders Saved!");

      /* ================= CREATE WITNESSES ================= */
      if (Array.isArray(traffic.witnesses)) {
        for (const w of traffic.witnesses) {
          await createWitnessMutate({
            offenceId,
            rank: w.reportingBlock.rank,
            unit: w.reportingBlock.unit,
            ArmyNo: w.reportingBlock.armyNumber,
            name: w.reportingBlock.nameReportingMP,
            contactNumber: w.reportingBlock.contactNumber,
          });
        }
        toast.success("Witnesses Added!");
      }

      toast.success("🎉 TRAFFIC REPORT COMPLETED!");

      /* ================= RESET ================= */
      dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
      dispatch({ type: "SET_STEP", payload: 1 });
      dispatch({ type: "SET_PATH", path: "completedSteps", value: [] });
    } catch (err: any) {
      console.error("❌ TRAFFIC FINAL ERROR ===>", err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Traffic submit failed"
      );
    }
  };

  // ================== STEP CONFIG ==================
  const stepsConfig = {
    1: {
      title: "1. PARTICULARS:",
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
      title: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
      component: <Step2Statement />,
    },

    3: {
      title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
      component: <Step3Offence />,
    },

    4: {
      title: "4. REMARKS OF CO/2IC PROVOST UNIT:",
      component: <Step4Remarks />,
    },
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
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal} // <<=== IMPORTANT!!!
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
